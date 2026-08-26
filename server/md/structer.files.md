app/
├── Http/Controllers/Api/Auth/
│   ├── AuthController.php       # register, login, logout, logout-all, me
│   └── PasswordController.php   # forgot, reset, change
├── Http/Requests/Auth/          # RegisterRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest
├── Http/Resources/UserResource.php
├── Policies/UserPolicy.php
├── Providers/RepositoryServiceProvider.php
├── Repositories/Contracts/UserRepositoryInterface.php + UserRepository.php
└── Services/Auth/AuthService.php
routes/api-auth.php
