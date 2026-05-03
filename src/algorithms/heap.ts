import type { AlgorithmMeta, SortStep } from './types'

function heapify(
    arr: number[],
    n: number,
    i: number,
    steps: SortStep[],
    sorted: number[]
) {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2

    if (left < n) {
        steps.push({
            type: 'compare',
            array: [...arr],
            active: [largest, left],
            sorted: [...sorted],
            range: [0, n - 1],
            phase: 'Heapify'
        })

        if (arr[left] > arr[largest]) {
            largest = left
        }
    }

    if (right < n) {
        steps.push({
            type: 'compare',
            array: [...arr],
            active: [largest, right],
            sorted: [...sorted],
            range: [0, n - 1],
            phase: 'Heapify'
        })

        if (arr[right] > arr[largest]) {
            largest = right
        }
    }

    if (largest !== i) {
        ;[arr[i], arr[largest]] = [arr[largest], arr[i]]

        steps.push({
            type: 'swap',
            array: [...arr],
            active: [i, largest],
            sorted: [...sorted],
            range: [0, n - 1],
            phase: 'Heapify'
        })

        heapify(arr, n, largest, steps, sorted)
    }
}

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length

    // build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        steps.push({
            type: 'highlight',
            array: [...arr],
            active: [i],
            sorted: [...sorted],
            range: [0, n - 1],
            phase: 'Build Max Heap'
        })

        heapify(arr, n, i, steps, sorted)
    }

    steps.push({
        type: 'snapshot',
        array: [...arr],
        active: [],
        sorted: [...sorted],
        phase: 'Max Heap Built'
    })

    // extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        ;[arr[0], arr[i]] = [arr[i], arr[0]]

        steps.push({
            type: 'swap',
            array: [...arr],
            active: [0, i],
            sorted: [...sorted],
            phase: 'Extract Max'
        })

        sorted.push(i)
        steps.push({
            type: 'mark-sorted',
            array: [...arr],
            active: [],
            sorted: [...sorted],
            range: [0, i - 1],
            phase: 'Extract Max'
        })

        heapify(arr, i, 0, steps, sorted)
    }

    sorted.push(0)
    steps.push({
        type: 'mark-sorted',
        array: [...arr],
        active: [],
        sorted: [...sorted]
    })

    return steps
}

export const heapSort: AlgorithmMeta = {
    id: 'heap',
    name: 'Heap Sort',
    timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
    },
    spaceComplexity: 'O(1)',
    description:
        'Builds a max heap from the array, then repeatedly extracts the largest element from the root and places it at the end. The two distinct phases — heap construction and extraction — are clearly visible in the animation.',
    generate
}