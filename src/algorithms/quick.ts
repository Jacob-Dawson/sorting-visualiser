import type { AlgorithmMeta, SortStep } from './types'

function partition(
    arr: number[],
    left: number,
    right: number,
    steps: SortStep[],
    sorted: number[]
): number {
    const pivot = arr[right]
    let i = left - 1

    steps.push({
        type: 'highlight',
        array: [...arr],
        active: [right],
        sorted: [...sorted],
        range: [left, right],
        phase: `Pivot: ${pivot}`
    })

    for (let j = left; j < right; j++) {
        steps.push({
            type: 'compare',
            array: [...arr],
            active: [j, right],
            sorted: [...sorted],
            range: [left, right],
            phase: `Pivot: ${pivot}`
        })

        if (arr[j] <= pivot) {
        i++

            if (i !== j) {
                ;[arr[i], arr[j]] = [arr[j], arr[i]]

                steps.push({
                    type: 'swap',
                    array: [...arr],
                    active: [i, j],
                    sorted: [...sorted],
                    range: [left, right],
                    phase: `Pivot: ${pivot}`
                })
            }
        }
    }

    ;[arr[i + 1], arr[right]] = [arr[right], arr[i + 1]]

    steps.push({
        type: 'swap',
        array: [...arr],
        active: [i + 1, right],
        sorted: [...sorted],
        range: [left, right],
        phase: `Pivot placed at ${i + 1}`
    })

    sorted.push(i + 1)
    steps.push({
        type: 'mark-sorted',
        array: [...arr],
        active: [],
        sorted: [...sorted],
        range: [left, right]
    })

    return i + 1
}

function quickFunc(
    arr: number[],
    left: number,
    right: number,
    steps: SortStep[],
    sorted: number[]
) {
    if (left >= right) {
        if (left === right) {
            sorted.push(left)
            steps.push({
                type: 'mark-sorted',
                array: [...arr],
                active: [],
                sorted: [...sorted]
            })
        }
        return
    }

    const pivotIndex = partition(arr, left, right, steps, sorted)
    quickFunc(arr, left, pivotIndex - 1, steps, sorted)
    quickFunc(arr, pivotIndex + 1, right, steps, sorted)
}

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []

    quickFunc(arr, 0, arr.length - 1, steps, sorted)

    return steps
}

export const quickSort: AlgorithmMeta = {
    id: 'quick',
    name: 'Quick Sort',
    timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    description:
        'Selects a pivot element and partitions the array into elements smaller and larger than the pivot, recursively sorting each partition. Very fast in practice despite O(n²) worst case — the pivot placement is clearly visible in the animation.',
    generate
}