<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Auth', description: 'Authentication endpoints')]
class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService,
    ) {}

    #[OA\Post(
        path: '/api/v1/auth/register',
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'email', 'password', 'password_confirmation'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'john@example.com'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'Password123!'),
                    new OA\Property(property: 'password_confirmation', type: 'string', format: 'password', example: 'Password123!'),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 201, description: 'Registration successful', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Registration successful.'),
                    new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                ],
            )),
            new OA\Response(response: 422, description: 'Validation error', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string'),
                    new OA\Property(property: 'errors', type: 'object'),
                ],
            )),
        ],
    )]
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->register($request->validated());

        return response()->json([
            'message' => 'Registration successful.',
            'user' => new UserResource($user),
        ], Response::HTTP_CREATED);
    }

    #[OA\Post(
        path: '/api/v1/auth/login',
        summary: 'Login with email and password',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'john@example.com'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'Password123!'),
                    new OA\Property(property: 'remember', type: 'boolean', example: false),
                ],
            ),
        ),
        responses: [
            new OA\Response(response: 200, description: 'Login successful', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Login successful.'),
                    new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                ],
            )),
            new OA\Response(response: 401, description: 'Invalid credentials', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Invalid credentials.'),
                ],
            )),
            new OA\Response(response: 422, description: 'Validation error'),
        ],
    )]
    public function login(LoginRequest $request): JsonResponse
    {
        if (! $this->authService->login($request->validated())) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login successful.',
            'user' => new UserResource(Auth::user()),
        ]);
    }

    #[OA\Post(
        path: '/api/v1/auth/logout',
        summary: 'Logout current session',
        tags: ['Auth'],
        security: [['cookie_auth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Logged out successfully', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Logged out successfully.'),
                ],
            )),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ],
    )]
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    #[OA\Post(
        path: '/api/v1/auth/logout-all',
        summary: 'Logout from all devices',
        description: 'Deletes all session rows for this user from the sessions table, then logs out the current session.',
        tags: ['Auth'],
        security: [['cookie_auth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Logged out from all devices', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Logged out from all devices.'),
                ],
            )),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ],
    )]
    public function logoutAll(Request $request): JsonResponse
    {
        $this->authService->logoutFromAllDevices();

        return response()->json([
            'message' => 'Logged out from all devices.',
        ]);
    }

    #[OA\Get(
        path: '/api/v1/auth/me',
        summary: 'Get current authenticated user',
        tags: ['Auth'],
        security: [['cookie_auth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Current user', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                ],
            )),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ],
    )]
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }
}
