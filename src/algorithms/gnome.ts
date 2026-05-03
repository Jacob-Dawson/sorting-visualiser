import type { AlgorithmMeta, SortStep } from './types'

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length
    let i = 0

    while (i < n) {
        if (i === 0 || arr[i] >= arr[i - 1]) {
        steps.push({
            type: 'compare',
            array: [...arr],
            active: [i, Math.max(i - 1, 0)],
            sorted: [...sorted]
        })
        i++
        } else {
        steps.push({
            type: 'compare',
            array: [...arr],
            active: [i, i - 1],
            sorted: [...sorted]
        })

        ;[arr[i], arr[i - 1]] = [arr[i - 1], arr[i]]

        steps.push({
            type: 'swap',
            array: [...arr],
            active: [i, i - 1],
            sorted: [...sorted]
        })

        i--
        }
    }

    for (let k = 0; k < n; k++) sorted.push(k)
    steps.push({
        type: 'mark-sorted',
        array: [...arr],
        active: [],
        sorted: [...sorted]
    })

    return steps
}

    export const gnomeSort: AlgorithmMeta = {
    id: 'gnome',
    name: 'Gnome Sort',
    timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description:
        'Works like a gnome sorting a line of flower pots — steps forward when elements are in order, swaps and steps back when they are not. Similar to insertion sort but moves elements into place via swaps rather than shifts.',
    generate
}