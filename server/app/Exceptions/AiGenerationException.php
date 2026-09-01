<?php

namespace App\Exceptions;

use RuntimeException;

class AiGenerationException extends RuntimeException
{
    public function statusCode(): int
    {
        return $this->status;
    }

    public function __construct(
        protected int $status,
        string $message,
    ) {
        parent::__construct($message);
    }
}
