<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['page_id', 'content', 'x', 'y'])]
class Paper extends Model
{
    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}
