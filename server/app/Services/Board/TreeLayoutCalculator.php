<?php

namespace App\Services\Board;

class TreeLayoutCalculator
{
    public const LEVEL_HEIGHT = 180;

    public const NODE_SPACING = 240;

    public function calculate(array $nodes, array $edges): array
    {
        if ($nodes === []) {
            return [];
        }

        $depths = [];
        $parents = [];
        $children = [];
        $indegree = [];
        $order = [];

        foreach ($nodes as $node) {
            $depths[$node['id']] = 0;
            $parents[$node['id']] = [];
            $children[$node['id']] = [];
            $indegree[$node['id']] = 0;
            $order[] = $node['id'];
        }

        foreach ($edges as $edge) {
            $from = $edge['from'];
            $to = $edge['to'];

            if (! isset($children[$from]) || ! isset($depths[$to])) {
                continue;
            }

            $children[$from][] = $to;
            $parents[$to][] = $from;
            $indegree[$to]++;
        }

        $queue = collect($order)->filter(
            fn (string $id) => $indegree[$id] === 0,
        )->values()->all();

        $topological = [];
        $pushed = [];

        while ($queue !== []) {
            $id = array_shift($queue);

            if (isset($pushed[$id])) {
                continue;
            }

            $pushed[$id] = true;
            $topological[] = $id;

            foreach ($children[$id] as $child) {
                $indegree[$child]--;

                if ($indegree[$child] === 0) {
                    $queue[] = $child;
                }
            }
        }

        foreach ($topological as $id) {
            foreach ($children[$id] as $child) {
                $depths[$child] = max($depths[$child], $depths[$id] + 1);
            }
        }

        $levels = [];
        $generation = [];

        foreach ($order as $id) {
            $generation[$id] = count($generation);
            $levels[$depths[$id]] ??= [];
            $levels[$depths[$id]][] = $id;
        }

        ksort($levels);

        $positions = [];

        foreach ($levels as $depth => &$level) {
            if ($depth > 0 && count($level) > 1) {
                usort($level, function (string $a, string $b) use ($parents, $generation, &$positions) {
                    $meanA = $this->parentXMean($a, $parents, $positions);
                    $meanB = $this->parentXMean($b, $parents, $positions);

                    if ($meanA === $meanB) {
                        return $generation[$a] <=> $generation[$b];
                    }

                    return $meanA <=> $meanB;
                });
            }

            foreach ($level as $index => $id) {
                $positions[$id] = [
                    'x' => $index * self::NODE_SPACING,
                    'y' => $depth * self::LEVEL_HEIGHT,
                ];
            }
        }
        unset($level);

        $maxLevelWidth = 0;

        foreach ($levels as $level) {
            $maxLevelWidth = max($maxLevelWidth, (count($level) - 1) * self::NODE_SPACING);
        }

        foreach ($levels as $depth => &$level) {
            $levelWidth = (count($level) - 1) * self::NODE_SPACING;
            $offset = (int) (($maxLevelWidth - $levelWidth) / 2);

            foreach ($level as $index => $id) {
                $positions[$id]['x'] += $offset;
            }
        }
        unset($level);

        return $positions;
    }

    private function parentXMean(string $id, array $parents, array $positions): ?float
    {
        $parentIds = $parents[$id] ?? [];

        if ($parentIds === []) {
            return null;
        }

        $sum = 0;

        foreach ($parentIds as $parentId) {
            $sum += $positions[$parentId]['x'] ?? 0;
        }

        return $sum / count($parentIds);
    }
}
