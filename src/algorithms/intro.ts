import type { AlgorithmMeta, SortStep } from './types'

const SIZE_THRESHOLD = 16

function insertionSort(
    arr: number[],
    left: number,
    right: number,
    steps: SortStep[],
    sorted: number[]
) {
    for (let i = left + 1; i <= right; i++) {
        let j = i

        while (j > left) {
            steps.push({
                type: 'compare',
                array: [...arr],
                active: [j, j - 1],
                sorted: [...sorted],
                range: [left, right],
                phase: 'Insertion Sort'
            })

            if (arr[j] < arr[j - 1]) {
                ;[arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]

                steps.push({
                    type: 'swap',
                    array: [...arr],
                    active: [j, j - 1],
                    sorted: [...sorted],
                    range: [left, right],
                    phase: 'Insertion Sort'
                })

                j--
            } else {
                break
            }
        }
    }
}

function heapify(
    arr: number[],
    n: number,
    i: number,
    left: number,
    steps: SortStep[],
    sorted: number[]
) {
    let largest = i
    const l = 2 * (i - left) + 1 + left
    const r = 2 * (i - left) + 2 + left

    if (l < left + n) {
        steps.push({
            type: 'compare',
            array: [...arr],
            active: [largest, l],
            sorted: [...sorted],
            phase: 'Heap Sort'
        })

        if (arr[l] > arr[largest]) largest = l
    }

    if (r < left + n) {
        steps.push({
            type: 'compare',
            array: [...arr],
            active: [largest, r],
            sorted: [...sorted],
            phase: 'Heap Sort'
        })

        if (arr[r] > arr[largest]) largest = r
    }

    if (largest !== i) {
        ;[arr[i], arr[largest]] = [arr[largest], arr[i]]

        steps.push({
            type: 'swap',
            array: [...arr],
            active: [i, largest],
            sorted: [...sorted],
            phase: 'Heap Sort'
        })

        heapify(arr, n, largest, left, steps, sorted)
    }
}

function heapSort(
    arr: number[],
    left: number,
    right: number,
    steps: SortStep[],
    sorted: number[]
) {
    const n = right - left + 1

    for (let i = left + Math.floor(n / 2) - 1; i >= left; i--) {
        steps.push({
        type: 'highlight',
        array: [...arr],
        active: [i],
        sorted: [...sorted],
        range: [left, right],
        phase: 'Heap Sort — Build Heap'
        })

        heapify(arr, n, i, left, steps, sorted)
    }

    for (let i = right; i > left; i--) {
        ;[arr[left], arr[i]] = [arr[i], arr[left]]

        steps.push({
            type: 'swap',
            array: [...arr],
            active: [left, i],
            sorted: [...sorted],
            range: [left, i],
            phase: 'Heap Sort — Extract'
        })

        heapify(arr, i - left, left, left, steps, sorted)
    }
}

function partition(
    arr: number[],
    left: number,
    right: number,
    steps: SortStep[],
    sorted: number[]
): number {
    const mid = Math.floor((left + right) / 2)

    // median of three pivot selection
    if (arr[mid] < arr[left]) {
        ;[arr[left], arr[mid]] = [arr[mid], arr[left]]
    }
    if (arr[right] < arr[left]) {
        ;[arr[left], arr[right]] = [arr[right], arr[left]]
    }
    if (arr[mid] < arr[right]) {
        ;[arr[mid], arr[right]] = [arr[right], arr[mid]]
    }

    const pivot = arr[right]

    steps.push({
        type: 'highlight',
        array: [...arr],
        active: [right],
        sorted: [...sorted],
        range: [left, right],
        phase: `Quick Sort — Pivot: ${pivot}`
    })

    let i = left - 1

    for (let j = left; j < right; j++) {
        steps.push({
            type: 'compare',
            array: [...arr],
            active: [j, right],
            sorted: [...sorted],
            range: [left, right],
            phase: `Quick Sort — Pivot: ${pivot}`
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
                phase: `Quick Sort — Pivot: ${pivot}`
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
        phase: `Quick Sort — Pivot placed at ${i + 1}`
    })

    sorted.push(i + 1)
    steps.push({
        type: 'mark-sorted',
        array: [...arr],
        active: [],
        sorted: [...sorted]
    })

    return i + 1
}

function introFunc(
    arr: number[],
    left: number,
    right: number,
    depthLimit: number,
    steps: SortStep[],
    sorted: number[]
) {
    const size = right - left + 1

    if (size <= SIZE_THRESHOLD) {
        insertionSort(arr, left, right, steps, sorted)
        return
    }

    if (depthLimit === 0) {
        heapSort(arr, left, right, steps, sorted)
        return
    }

    const pivotIndex = partition(arr, left, right, steps, sorted)
    introFunc(arr, left, pivotIndex - 1, depthLimit - 1, steps, sorted)
    introFunc(arr, pivotIndex + 1, right, depthLimit - 1, steps, sorted)
}

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length
    const depthLimit = 2 * Math.floor(Math.log2(n))

    introFunc(arr, 0, n - 1, depthLimit, steps, sorted)

    for (let i = 0; i < n; i++) {
        if (!sorted.includes(i)) sorted.push(i)
    }

    steps.push({
        type: 'mark-sorted',
        array: [...arr],
        active: [],
        sorted: [...sorted]
    })

    return steps
}

export const introSort: AlgorithmMeta = {
    id: 'intro',
    name: 'Intro Sort',
    timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
    },
    spaceComplexity: 'O(log n)',
    description:
        'A hybrid of quick sort, heap sort, and insertion sort used in C++ STL. Uses quick sort by default, switches to heap sort when recursion depth exceeds 2log(n) to avoid worst case, and falls back to insertion sort for small partitions. All three phases are visible in the animation.',
    generate
}