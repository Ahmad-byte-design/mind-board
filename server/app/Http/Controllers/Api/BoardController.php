<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\AiGenerationException;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateBoardRequest;
use App\Http\Resources\PaperResource;
use App\Http\Resources\StringResource;
use App\Models\Page;
use App\Services\Board\BoardGenerationService;
use App\Services\StringService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Board', description: 'Board endpoints')]
class BoardController extends Controller
{
    public function __construct(
        protected StringService $stringService,
        protected BoardGenerationService $boardGenerationService,
    ) {}

    #[OA\Get(
        path: '/api/v1/pages/{page}/board',
        summary: 'Get the full board for a page (papers and strings)',
        tags: ['Board'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'page', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Board data', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'papers', type: 'array', items: new OA\Items(ref: '#/components/schemas/Paper')),
                    new OA\Property(property: 'strings', type: 'array', items: new OA\Items(ref: '#/components/schemas/String')),
                ],
            )),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Not found'),
        ],
    )]
    public function show(Request $request, Page $page): JsonResponse
    {
        $board = $this->stringService->boardForPage($page);

        return response()->json([
            'papers' => PaperResource::collection($board['papers']),
            'strings' => StringResource::collection($board['strings']),
        ]);
    }

    #[OA\Patch(
        path: '/api/v1/pages/{page}/board',
        summary: 'Save the board (paper positions and new string connections)',
        description: 'Batched save for the board: updates the position of the listed papers and creates any listed string connections that do not already exist. Papers/strings not listed in the payload are left untouched.',
        tags: ['Board'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'page', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'papers', type: 'array', items: new OA\Items(
                        type: 'object',
                        required: ['id', 'x', 'y'],
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 12),
                            new OA\Property(property: 'x', type: 'integer', example: 480),
                            new OA\Property(property: 'y', type: 'integer', example: 240),
                        ],
                    )),
                    new OA\Property(property: 'strings', type: 'array', items: new OA\Items(
                        type: 'object',
                        required: ['paper1_id', 'paper2_id'],
                        properties: [
                            new OA\Property(property: 'paper1_id', type: 'integer', example: 12),
                            new OA\Property(property: 'paper2_id', type: 'integer', example: 15),
                        ],
                    )),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 200, description: 'Board updated successfully', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Board updated successfully.'),
                    new OA\Property(property: 'created_strings', type: 'array', items: new OA\Items(ref: '#/components/schemas/String')),
                ],
            )),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Not found'),
            new OA\Response(response: 422, description: 'Validation error'),
        ],
    )]
    public function update(UpdateBoardRequest $request, Page $page): JsonResponse
    {
        $result = $this->stringService->saveBoard($page, $request->validated());

        return response()->json([
            'message' => 'Board updated successfully.',
            'created_strings' => StringResource::collection($result['created_strings']),
        ], Response::HTTP_OK);
    }

    #[OA\Post(
        path: '/api/v1/pages/{page}/generate',
        summary: 'Generate a board from the page title',
        description: 'Asks the AI to break the page title into a focused concept graph, persists papers, strings and tree-shaped positions, then returns the full board. Only works on an empty page.',
        tags: ['AI'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'page', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 201, description: 'Board generated successfully', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Board generated successfully.'),
                    new OA\Property(property: 'papers', type: 'array', items: new OA\Items(
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 45),
                            new OA\Property(property: 'page_id', type: 'integer', example: 12),
                            new OA\Property(property: 'content', type: 'string', example: 'JavaScript Fundamentals'),
                            new OA\Property(property: 'x', type: 'integer', example: 0),
                            new OA\Property(property: 'y', type: 'integer', example: 0),
                            new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
                            new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
                        ],
                    )),
                    new OA\Property(property: 'strings', type: 'array', items: new OA\Items(
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 17),
                            new OA\Property(property: 'paper1_id', type: 'integer', example: 45),
                            new OA\Property(property: 'paper2_id', type: 'integer', example: 46),
                        ],
                    )),
                ],
            )),
            new OA\Response(response: 401, description: 'Unauthenticated', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.'),
                ],
            )),
            new OA\Response(response: 403, description: 'Forbidden', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'This action is unauthorized.'),
                ],
            )),
            new OA\Response(response: 404, description: 'Not found', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'No query results for model [App\\Models\\Page].'),
                ],
            )),
            new OA\Response(response: 409, description: 'The page already has a board', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'This page already has a board.'),
                ],
            )),
            new OA\Response(response: 422, description: 'The AI returned malformed output', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'The AI returned malformed output. Please try again.'),
                ],
            )),
            new OA\Response(response: 502, description: 'The AI provider failed', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'The AI provider returned an error. Please try again.'),
                ],
            )),
        ],
    )]
    public function generate(Request $request, Page $page): JsonResponse
    {
        try {
            $board = $this->boardGenerationService->generate($page);
        } catch (AiGenerationException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], $exception->statusCode());
        }

        return response()->json([
            'message' => 'Board generated successfully.',
            'papers' => PaperResource::collection($board['papers']),
            'strings' => StringResource::collection($board['strings']),
        ], Response::HTTP_CREATED);
    }
}
