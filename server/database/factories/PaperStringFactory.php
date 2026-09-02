<?php

namespace Database\Factories;

use App\Models\Paper;
use App\Models\PaperString;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaperString>
 */
class PaperStringFactory extends Factory
{
    protected $model = PaperString::class;

    public function definition(): array
    {
        return [
            'paper1_id' => Paper::factory(),
            'paper2_id' => Paper::factory(),
        ];
    }
}
