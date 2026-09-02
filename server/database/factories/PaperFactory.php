<?php

namespace Database\Factories;

use App\Models\Page;
use App\Models\Paper;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Paper>
 */
class PaperFactory extends Factory
{
    protected $model = Paper::class;

    public function definition(): array
    {
        return [
            'page_id' => Page::factory(),
            'content' => fake()->sentence(4),
            'x' => fake()->numberBetween(0, 1000),
            'y' => fake()->numberBetween(0, 1000),
        ];
    }

    public function withNullPosition(): static
    {
        return $this->state(fn () => [
            'x' => null,
            'y' => null,
        ]);
    }
}
