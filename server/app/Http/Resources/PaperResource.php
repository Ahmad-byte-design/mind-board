<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'Paper',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 45),
        new OA\Property(property: 'page_id', type: 'integer', example: 12),
        new OA\Property(property: 'content', type: 'string', example: 'useState is a React Hook used to manage changing state.'),
        new OA\Property(property: 'x', type: 'integer', example: 480),
        new OA\Property(property: 'y', type: 'integer', example: 240),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ],
)]
class PaperResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'page_id' => $this->page_id,
            'content' => $this->content,
            'x' => $this->x,
            'y' => $this->y,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
