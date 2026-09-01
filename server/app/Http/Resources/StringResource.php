<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'String',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 11),
        new OA\Property(property: 'paper1_id', type: 'integer', example: 1),
        new OA\Property(property: 'paper2_id', type: 'integer', example: 2),
    ],
)]
class StringResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'paper1_id' => $this->paper1_id,
            'paper2_id' => $this->paper2_id,
        ];
    }
}
