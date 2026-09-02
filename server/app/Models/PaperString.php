<?php

namespace App\Models;

use Database\Factories\PaperStringFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['paper1_id', 'paper2_id'])]
class PaperString extends Model
{
    /** @use HasFactory<PaperStringFactory> */
    use HasFactory;

    protected $table = 'strings';

    public function paper1(): BelongsTo
    {
        return $this->belongsTo(Paper::class, 'paper1_id');
    }

    public function paper2(): BelongsTo
    {
        return $this->belongsTo(Paper::class, 'paper2_id');
    }
}
