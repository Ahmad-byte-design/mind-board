<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaperRequest;
use App\Http\Requests\UpdatePaperRequest;
use App\Http\Resources\PaperResource;
use App\Models\Page;
use App\Models\Paper;
use App\Services\PaperService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Papers', description: 'Paper note endpoints')]
class PaperController extends Controller
{
    public function __construct(
        protected PaperService $paperService,
    ) {}

    #[OA\Get(
        path: '/api/v1/pages/{page}/papers',
        summary: 'List papers on a page (cursor paginated)',
        tags: ['Papers'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'page', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'List of papers', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Paper')),
                    new OA\Property(property: 'meta', type: 'object', properties: [
                        new OA\Property(property: 'per_page', type: 'integer', example: 15),
                        new OA\Property(property: 'next_cursor', type: 'string', nullable: true),
                        new OA\Property(property: 'prev_cursor', type: 'string', nullable: true),
                    ]),
                ],
            )),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Not found'),
        ],
    )]
    public function index(Request $request, Page $page): JsonResponse
    {
        $papers = $this->paperService->listForPage(
            $page,
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'data' => PaperResource::collection($papers->items()),
            'meta' => [
                'per_page' => $papers->perPage(),
                'next_cursor' => $papers->nextCursor()?->encode(),
                'prev_cursor' => $papers->previousCursor()?->encode(),
            ],
        ]);
    }

    #[OA\Post(
        path: '/api/v1/pages/{page}/papers',
        summary: 'Create a new paper on a page',
        tags: ['Papers'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'page', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['content'],
                properties: [
                    new OA\Property(property: 'content', type: 'string', example: 'useState is a React Hook used to manage changing state.'),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 201, description: 'Paper created successfully', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Paper created successfully.'),
                    new OA\Property(property: 'paper', ref: '#/components/schemas/Paper'),
                ],
            )),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 422, description: 'Validation error'),
        ],
    )]
    public function store(StorePaperRequest $request, Page $page): JsonResponse
    {
        $paper = $this->paperService->create($page, $request->validated());

        return response()->json([
            'message' => 'Paper created successfully.',
            'paper' => new PaperResource($paper),
        ], Response::HTTP_CREATED);
    }

    #[OA\Get(
        path: '/api/v1/papers/{paper}',
        summary: 'Show one paper',
        tags: ['Papers'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'paper', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Paper details', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'paper', ref: '#/components/schemas/Paper'),
                ],
            )),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Not found'),
        ],
    )]
    public function show(Request $request, Paper $paper): JsonResponse
    {
        $paper = $this->paperService->show($paper);

        return response()->json([
            'paper' => new PaperResource($paper),
        ]);
    }

    #[OA\Put(
        path: '/api/v1/papers/{paper}',
        summary: 'Update a paper',
        tags: ['Papers'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'paper', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['content'],
                properties: [
                    new OA\Property(property: 'content', type: 'string', example: 'useState is a React Hook for managing local component state.'),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 200, description: 'Paper updated successfully', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Paper updated successfully.'),
                    new OA\Property(property: 'paper', ref: '#/components/schemas/Paper'),
                ],
            )),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Not found'),
        ],
    )]
    public function update(UpdatePaperRequest $request, Paper $paper): JsonResponse
    {
        $this->paperService->update($paper, $request->validated());

        return response()->json([
            'message' => 'Paper updated successfully.',
            'paper' => new PaperResource($paper->fresh()),
        ]);
    }

    #[OA\Delete(
        path: '/api/v1/papers/{paper}',
        summary: 'Delete a paper',
        tags: ['Papers'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'paper', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Paper deleted successfully', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Paper deleted successfully.'),
                ],
            )),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Not found'),
        ],
    )]
    public function destroy(Request $request, Paper $paper): JsonResponse
    {
        $this->paperService->delete($paper);

        return response()->json([
            'message' => 'Paper deleted successfully.',
        ]);
    }
}
