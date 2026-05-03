import type { AlgorithmMeta, SortStep } from './types'

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length

    const min = Math.min(...arr)
    const max = Math.max(...arr)
    const range = max - min + 1

    const count: number[] = new Array(range).fill(0)
    const output: number[] = new Array(n).fill(0)

    // count occurrences
    for (let i = 0; i < n; i++) {
        count[arr[i] - min]++

        steps.push({
            type: 'highlight',
            array: [...arr],
            active: [i],
            sorted: [...sorted],
            aux: [[...count], [...output]],
            phase: 'Counting occurrences'
        })
    }

    steps.push({
        type: 'snapshot',
        array: [...arr],
        active: [],
        sorted: [...sorted],
        aux: [[...count], [...output]],
        phase: 'Count array built'
    })

    // accumulate counts
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1]

        steps.push({
            type: 'highlight',
            array: [...arr],
            active: [],
            sorted: [...sorted],
            aux: [[...count], [...output]],
            phase: 'Accumulating counts'
        })
    }

    steps.push({
        type: 'snapshot',
        array: [...arr],
        active: [],
        sorted: [...sorted],
        aux: [[...count], [...output]],
        phase: 'Cumulative count array built'
    })

    // build output array right to left (stable)
    for (let i = n - 1; i >= 0; i--) {
        const val = arr[i]
        const pos = count[val - min] - 1
        output[pos] = val
        count[val - min]--

        steps.push({
            type: 'overwrite',
            array: [...arr],
            active: [i],
            sorted: [...sorted],
            aux: [[...count], [...output]],
            phase: 'Building output array'
        })
    }

    steps.push({
        type: 'snapshot',
        array: [...arr],
        active: [],
        sorted: [...sorted],
        aux: [[...count], [...output]],
        phase: 'Output array built'
    })

    // copy output back into arr
    for (let i = 0; i < n; i++) {
        arr[i] = output[i]

        steps.push({
            type: 'overwrite',
            array: [...arr],
            active: [i],
            sorted: [...sorted],
            aux: [[...count], [...output]],
            phase: 'Copying output to array'
        })
    }

    for (let i = 0; i < n; i++) sorted.push(i)
    steps.push({
        type: 'mark-sorted',
        array: [...arr],
        active: [],
        sorted: [...sorted]
    })

    return steps
}

export const countingSort: AlgorithmMeta = {
    id: 'counting',
    name: 'Counting Sort',
    timeComplexity: {
        best: 'O(n + k)',
        average: 'O(n + k)',
        worst: 'O(n + k)'
    },
    spaceComplexity: 'O(n + k)',
    description:
        'A non-comparison sort that counts occurrences of each value, accumulates those counts into positions, then places each element directly into its correct output position. Four distinct phases are visible: counting, accumulation, output construction, and copying back.',
    generate
}