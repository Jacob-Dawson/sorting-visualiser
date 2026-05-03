import type { AlgorithmMeta, SortStep } from './types'

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length

    let left = 0
    let right = n - 1

    while (left < right) {
        let swapped = false

        for (let i = left; i < right; i++) {
            steps.push({
                type: 'compare',
                array: [...arr],
                active: [i, i + 1],
                sorted: [...sorted]
            })

            if (arr[i] > arr[i + 1]) {
                ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]

                steps.push({
                    type: 'swap',
                    array: [...arr],
                    active: [i, i + 1],
                    sorted: [...sorted]
                })

                swapped = true
            }
        }

        sorted.push(right)
        steps.push({
            type: 'mark-sorted',
            array: [...arr],
            active: [],
            sorted: [...sorted]
        })
        right--

        if (!swapped) break

        swapped = false

        for (let i = right; i > left; i--) {
            steps.push({
                type: 'compare',
                array: [...arr],
                active: [i, i - 1],
                sorted: [...sorted]
            })

            if (arr[i] < arr[i - 1]) {
                ;[arr[i], arr[i - 1]] = [arr[i - 1], arr[i]]

                steps.push({
                    type: 'swap',
                    array: [...arr],
                    active: [i, i - 1],
                    sorted: [...sorted]
                })

                swapped = true
            }
        }

        sorted.push(left)
        steps.push({
            type: 'mark-sorted',
            array: [...arr],
            active: [],
            sorted: [...sorted]
        })
        left++

        if (!swapped) break
    }

    for (let i = left; i <= right; i++) sorted.push(i)
    steps.push({
        type: 'mark-sorted',
        array: [...arr],
        active: [],
        sorted: [...sorted]
    })

    return steps
}

export const cocktailShakerSort: AlgorithmMeta = {
    id: 'cocktail-shaker',
    name: 'Cocktail Shaker Sort',
    timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description:
        'A bidirectional variant of bubble sort. Each pass alternates direction — left to right bubbles the largest unsorted element to the right, right to left bubbles the smallest to the left. Reduces the turtle problem of small elements at the end.',
    generate
}