<?php

namespace App\Services\Ai;

use App\Exceptions\AiGenerationException;
use Illuminate\Support\Facades\Http;

class KnowledgeGraphGenerator
{
    public function __construct(
        protected array $config = [],
    ) {}

    public function generate(string $title): array
    {
        $config = $this->config ?: config('services.gemini');

        foreach ([1, 2] as $attempt) {
            try {
                $response = Http::withHeaders([
                    'x-goog-api-key' => $config['api_key'],
                ])->timeout(45)->post(
                    "https://generativelanguage.googleapis.com/v1beta/models/{$config['model']}:generateContent",
                    [
                        'systemInstruction' => [
                            'parts' => [
                                'text' => $this->systemPrompt(),
                            ],
                        ],
                        'contents' => [
                            [
                                'role' => 'user',
                                'parts' => [
                                    'text' => $this->userPrompt($title),
                                ],
                            ],
                        ],
                        'generationConfig' => $this->generationConfig($config),
                    ],
                );

                if ($response->failed()) {
                    $providerError = data_get($response->json(), 'error.message');

                    $message = 'The AI provider returned an error. Please try again.';

                    if (config('app.debug') && is_string($providerError) && $providerError !== '') {
                        $message .= " ({$providerError})";
                    }

                    throw new AiGenerationException(502, $message);
                }

                $text = $this->extractText($response->json());

                return $this->parse((string) ($text ?? ''));
            } catch (AiGenerationException $exception) {
                if ($exception->statusCode() !== 422 || $attempt === 2) {
                    throw $exception;
                }
            }
        }

        throw new AiGenerationException(422, 'The AI returned malformed output. Please try again.');
    }

    private function generationConfig(array $config): array
    {
        $generationConfig = [
            'temperature' => 0.4,
            'responseMimeType' => 'application/json',
        ];

        if (! empty($config['max_output_tokens'])) {
            $generationConfig['maxOutputTokens'] = (int) $config['max_output_tokens'];
        }

        return $generationConfig;
    }

    private function systemPrompt(): string
    {
        return <<<'PROMPT'
You are a study-plan designer following the "first 20 hours" philosophy:
prioritize fundamentals, prerequisites, and practical skills over trivia.

Given a learning goal, produce a focused knowledge graph:
- Target roughly 12-20 concepts. Never produce huge open-ended lists.
- Each concept is a short noun phrase (like "JavaScript Fundamentals", "JSX").
- Add an edge whenever one concept is a prerequisite of another. Do not
  create cyclic dependencies.

Output JSON only — no prose, no markdown fences — exactly this shape:
{
  "nodes": [{ "id": "n1", "content": "JavaScript Fundamentals" }],
  "edges": [{ "from": "n1", "to": "n2" }]
}
"from" is the prerequisite, "to" is the dependent concept.
PROMPT;
    }

    private function userPrompt(string $title): string
    {
        return "I want to learn: {$title}";
    }

    private function extractText(?array $payload): ?string
    {
        $parts = data_get($payload, 'candidates.0.content.parts', []);

        return collect($parts)
            ->pluck('text')
            ->map(fn ($part) => (string) ($part ?? ''))
            ->implode('');
    }

    private function parse(string $text): array
    {
        $text = trim($text);

        $text = preg_replace('/^```(?:json)?\s*/i', '', $text);
        $text = preg_replace('/\s*```$/', '', $text);

        if ($text === '') {
            throw new AiGenerationException(422, 'The AI returned an empty response.');
        }

        $decoded = json_decode($text, true);

        if (! is_array($decoded) || ! isset($decoded['nodes']) || ! is_array($decoded['nodes'])) {
            throw new AiGenerationException(422, 'The AI response is not valid JSON.');
        }

        $nodes = [];
        $declared = [];

        foreach ($decoded['nodes'] as $index => $node) {
            $id = is_string($node['id'] ?? null) && $node['id'] !== '' ? $node['id'] : (string) $index;
            $content = is_string($node['content'] ?? null) && $node['content'] !== '' ? $node['content'] : null;

            if ($content === null) {
                continue;
            }

            $nodes[] = ['id' => $id, 'content' => $content];
            $declared[$id] = true;
        }

        if ($nodes === []) {
            throw new AiGenerationException(422, 'The AI response contains no valid concepts.');
        }

        $edges = [];

        foreach (is_array($decoded['edges'] ?? null) ? $decoded['edges'] : [] as $edge) {
            $from = $edge['from'] ?? null;
            $to = $edge['to'] ?? null;

            if (! is_string($from) || ! is_string($to) || ! isset($declared[$from]) || ! isset($declared[$to])) {
                continue;
            }

            if ($from === $to) {
                continue;
            }

            $edges[] = ['from' => $from, 'to' => $to];
        }

        return ['nodes' => $nodes, 'edges' => $edges];
    }
}
