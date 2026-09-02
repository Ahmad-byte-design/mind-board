<?php

namespace App\Models;

use Database\Factories\PaperFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['page_id', 'content', 'x', 'y'])]
class Paper extends Model
{
    /** @use HasFactory<PaperFactory> */
    use HasFactory;

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}
