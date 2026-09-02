<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Services\Auth\ProfileService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Profile', description: 'Profile management endpoints')]
class ProfileController extends Controller
{
    public function __construct(
        protected ProfileService $profileService,
    ) {}

    #[OA\Put(
        path: '/api/v1/auth/profile',
        summary: 'Update authenticated user profile',
        description: 'Update name, email, and/or avatar. Avatar must be an image file (jpg, png, webp) up to 2MB.',
        tags: ['Profile'],
        security: [['cookie_auth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    required: ['name', 'email'],
                    properties: [
                        new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'john@example.com'),
                        new OA\Property(property: 'avatar', type: 'string', format: 'binary', description: 'Image file (jpg, png, webp), max 2MB'),
                    ],
                ),
            ),
        ),
        responses: [
            new OA\Response(response: 200, description: 'Profile updated successfully', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Profile updated successfully.'),
                    new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                ],
            )),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 422, description: 'Validation error'),
        ],
    )]
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->profileService->update(
            $request->user(),
            $request->validated(),
        );

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => new UserResource($user),
        ]);
    }
}
