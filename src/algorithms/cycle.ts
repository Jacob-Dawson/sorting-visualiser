import type { AlgorithmMeta, SortStep } from './types'

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length

    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
        let item = arr[cycleStart]
        let pos = cycleStart

        for (let i = cycleStart + 1; i < n; i++) {
            steps.push({
                type: 'compare',
                array: [...arr],
                active: [cycleStart, i],
                sorted: [...sorted]
            })

            if (arr[i] < item) pos++
        }

        if (pos === cycleStart) {
            sorted.push(cycleStart)
            steps.push({
                type: 'mark-sorted',
                array: [...arr],
                active: [],
                sorted: [...sorted]
            })
            continue
        }

        while (arr[pos] === item) pos++

        ;[arr[pos], item] = [item, arr[pos]]

        steps.push({
            type: 'swap',
            array: [...arr],
            active: [pos, cycleStart],
            sorted: [...sorted]
        })

        while (pos !== cycleStart) {
            pos = cycleStart

            for (let i = cycleStart + 1; i < n; i++) {
                steps.push({
                type: 'compare',
                array: [...arr],
                active: [cycleStart, i],
                sorted: [...sorted]
                })

                if (arr[i] < item) pos++
            }

            while (arr[pos] === item) pos++

            ;[arr[pos], item] = [item, arr[pos]]

            steps.push({
                type: 'swap',
                array: [...arr],
                active: [pos, cycleStart],
                sorted: [...sorted]
            })
        }

        sorted.push(cycleStart)
        steps.push({
            type: 'mark-sorted',
            array: [...arr],
            active: [],
            sorted: [...sorted]
        })
    }

    sorted.push(n - 1)
    steps.push({
        type: 'mark-sorted',
        array: [...arr],
        active: [],
        sorted: [...sorted]
    })

    return steps
}

export const cycleSort: AlgorithmMeta = {
    id: 'cycle',
    name: 'Cycle Sort',
    timeComplexity: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description:
        'Minimises the number of writes to the array by cycling elements directly into their correct positions. Each element is written at most once, making it optimal for write-heavy storage like flash memory.',
    generate
}