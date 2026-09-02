<?php

use App\Services\Board\TreeLayoutCalculator;

beforeEach(function () {
    test()->calculator = new TreeLayoutCalculator;
});

it('places a single child below a single root', function () {
    $positions = test()->calculator->calculate(
        [
            ['id' => 'root', 'content' => 'Root'],
            ['id' => 'child', 'content' => 'Child'],
        ],
        [['from' => 'root', 'to' => 'child']],
    );

    expect($positions['child']['y'])->toBeGreaterThan($positions['root']['y']);
});

it('produces strictly increasing depths along a linear chain of four nodes', function () {
    $positions = test()->calculator->calculate(
        [
            ['id' => 'n1', 'content' => '1'],
            ['id' => 'n2', 'content' => '2'],
            ['id' => 'n3', 'content' => '3'],
            ['id' => 'n4', 'content' => '4'],
        ],
        [
            ['from' => 'n1', 'to' => 'n2'],
            ['from' => 'n2', 'to' => 'n3'],
            ['from' => 'n3', 'to' => 'n4'],
        ],
    );

    $yValues = ['n1', 'n2', 'n3', 'n4'];

    for ($i = 1; $i < count($yValues); $i++) {
        expect($positions[$yValues[$i]]['y'])
            ->toBeGreaterThan($positions[$yValues[$i - 1]]['y']);
    }
});

it('centers a shared child between its two parents in a diamond shape', function () {
    $positions = test()->calculator->calculate(
        [
            ['id' => 'p1', 'content' => 'P1'],
            ['id' => 'p2', 'content' => 'P2'],
            ['id' => 'child', 'content' => 'Child'],
        ],
        [
            ['from' => 'p1', 'to' => 'child'],
            ['from' => 'p2', 'to' => 'child'],
        ],
    );

    $minX = min($positions['p1']['x'], $positions['p2']['x']);
    $maxX = max($positions['p1']['x'], $positions['p2']['x']);

    expect($positions['child']['x'])
        ->toBeGreaterThan($minX)
        ->toBeLessThan($maxX);
});

it('places independent roots at the same height and spreads them apart', function () {
    $positions = test()->calculator->calculate(
        [
            ['id' => 'tree1', 'content' => 'T1'],
            ['id' => 'tree2', 'content' => 'T2'],
            ['id' => 'tree3', 'content' => 'T3'],
        ],
        [],
    );

    expect($positions['tree1']['y'])->toBe(0);
    expect($positions['tree2']['y'])->toBe(0);
    expect($positions['tree3']['y'])->toBe(0);

    $xs = array_column($positions, 'x');
    expect($xs)->toHaveCount(3);
    expect(count(array_unique($xs)))->toBe(3);
});

it('handles a cycle gracefully and terminates', function () {
    $positions = test()->calculator->calculate(
        [
            ['id' => 'a', 'content' => 'A'],
            ['id' => 'b', 'content' => 'B'],
        ],
        [
            ['from' => 'a', 'to' => 'b'],
            ['from' => 'b', 'to' => 'a'],
        ],
    );

    expect($positions)->toHaveCount(2);
});
