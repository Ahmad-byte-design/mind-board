<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Http\Resources\PageResource;
use App\Models\Page;
use App\Services\PageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Pages', description: 'Learning page endpoints')]
class PageController extends Controller
{
    public function __construct(
        protected PageService $pageService,
    ) {}

    #[OA\Get(
        path: '/api/v1/pages',
        summary: "List the authenticated user's pages (cursor paginated)",
        tags: ['Pages'],
        security: [['cookie_auth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'List of pages', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Page')),
                    new OA\Property(property: 'meta', type: 'object', properties: [
                        new OA\Property(property: 'per_page', type: 'integer', example: 15),
                        new OA\Property(property: 'next_cursor', type: 'string', nullable: true),
                        new OA\Property(property: 'prev_cursor', type: 'string', nullable: true),
                    ]),
                ],
            )),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ],
    )]
    public function index(Request $request): JsonResponse
    {
        $pages = $this->pageService->listForUser(
            $request->user()->id,
            (int) $request->input('per_page', 15),
        );

        return response()->json([
            'data' => PageResource::collection($pages->items()),
            'meta' => [
                'per_page' => $pages->perPage(),
                'next_cursor' => $pages->nextCursor()?->encode(),
                'prev_cursor' => $pages->previousCursor()?->encode(),
            ],
        ]);
    }

    #[OA\Post(
        path: '/api/v1/pages',
        summary: 'Create a new page',
        tags: ['Pages'],
        security: [['cookie_auth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['title'],
                properties: [
                    new OA\Property(property: 'title', type: 'string', example: 'React Mastery'),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 201, description: 'Page created successfully', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Page created successfully.'),
                    new OA\Property(property: 'page', ref: '#/components/schemas/Page'),
                ],
            )),
            new OA\Response(response: 422, description: 'Validation error'),
        ],
    )]
    public function store(StorePageRequest $request): JsonResponse
    {
        $page = $this->pageService->create($request->user()->id, $request->validated());

        return response()->json([
            'message' => 'Page created successfully.',
            'page' => new PageResource($page),
        ], Response::HTTP_CREATED);
    }

    #[OA\Get(
        path: '/api/v1/pages/{page}',
        summary: 'Show one page',
        tags: ['Pages'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'page', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Page details', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'page', ref: '#/components/schemas/Page'),
                ],
            )),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Not found'),
        ],
    )]
    public function show(Request $request, Page $page): JsonResponse
    {
        $page = $this->pageService->show($page);

        return response()->json([
            'page' => new PageResource($page),
        ]);
    }

    #[OA\Put(
        path: '/api/v1/pages/{page}',
        summary: 'Update a page',
        tags: ['Pages'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'page', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['title'],
                properties: [
                    new OA\Property(property: 'title', type: 'string', example: 'React Deep Dive'),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 200, description: 'Page updated successfully', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Page updated successfully.'),
                    new OA\Property(property: 'page', ref: '#/components/schemas/Page'),
                ],
            )),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Not found'),
        ],
    )]
    public function update(UpdatePageRequest $request, Page $page): JsonResponse
    {
        $this->pageService->update($page, $request->validated());

        return response()->json([
            'message' => 'Page updated successfully.',
            'page' => new PageResource($page->fresh()),
        ]);
    }

    #[OA\Delete(
        path: '/api/v1/pages/{page}',
        summary: 'Delete a page',
        tags: ['Pages'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'page', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Page deleted successfully', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Page deleted successfully.'),
                ],
            )),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Not found'),
        ],
    )]
    public function destroy(Request $request, Page $page): JsonResponse
    {
        $this->pageService->delete($page);

        return response()->json([
            'message' => 'Page deleted successfully.',
        ]);
    }
}
