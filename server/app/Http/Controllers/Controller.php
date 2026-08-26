<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'MindBoard API',
    version: '1.0.0',
    description: 'AI-Powered Visual Learning Platform API. Cookie-based SPA authentication via Laravel Sanctum.',
    contact: new OA\Contact(name: 'MindBoard', email: 'api@mindboard.com'),
)]
abstract class Controller
{
    //
}
