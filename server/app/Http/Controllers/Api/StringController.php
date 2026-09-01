<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStringRequest;
use App\Http\Resources\StringResource;
use App\Models\Page;
use App\Models\PaperString;
use App\Services\StringService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Strings', description: 'Paper relationship endpoints')]
class StringController extends Controller
{
    public function __construct(
        protected StringService $stringService,
    ) {}

    #[OA\Post(
        path: '/api/v1/pages/{page}/strings',
        summary: 'Create a string between two papers on a page',
        tags: ['Strings'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'page', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['paper1_id', 'paper2_id'],
                properties: [
                    new OA\Property(property: 'paper1_id', type: 'integer', example: 1),
                    new OA\Property(property: 'paper2_id', type: 'integer', example: 2),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 201, description: 'String created successfully', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'String created successfully.'),
                    new OA\Property(property: 'string', ref: '#/components/schemas/String'),
                ],
            )),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Not found'),
            new OA\Response(response: 422, description: 'Validation error'),
        ],
    )]
    public function store(StoreStringRequest $request, Page $page): JsonResponse
    {
        $string = $this->stringService->create($page, $request->validated());

        return response()->json([
            'message' => 'String created successfully.',
            'string' => new StringResource($string),
        ], Response::HTTP_CREATED);
    }

    #[OA\Delete(
        path: '/api/v1/strings/{string}',
        summary: 'Delete a string',
        tags: ['Strings'],
        security: [['cookie_auth' => []]],
        parameters: [
            new OA\Parameter(name: 'string', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'String deleted successfully', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'String deleted successfully.'),
                ],
            )),
            new OA\Response(response: 403, description: 'Forbidden'),
            new OA\Response(response: 404, description: 'Not found'),
        ],
    )]
    public function destroy(Request $request, PaperString $string): JsonResponse
    {
        $this->stringService->delete($string);

        return response()->json([
            'message' => 'String deleted successfully.',
        ]);
    }
}
