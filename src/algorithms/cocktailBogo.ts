import type { AlgorithmMeta, SortStep } from './types'

const MAX_ITERATIONS = 10000

function isSortedRange(arr: number[], left: number, right: number): boolean {
    for (let i = left; i < right; i++) {
        if (arr[i] > arr[i + 1]) return false
    }
    return true
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []

    let left = 0
    let right = arr.length - 1
    let iterations = 0

    while (left < right && iterations < MAX_ITERATIONS) {
        iterations++

        // check and fix left boundary
        if (arr[left] <= arr[left + 1]) {
            sorted.push(left)
            steps.push({
                type: 'mark-sorted',
                array: [...arr],
                active: [],
                sorted: [...sorted],
                phase: `Left confirmed: index ${left}`
            })
            left++
        } else {
            const swapIdx = randomInt(left, right)

            steps.push({
                type: 'compare',
                array: [...arr],
                active: [left, left + 1],
                sorted: [...sorted],
                phase: `Left unsorted — random swap at ${swapIdx}`
            })

            ;[arr[left], arr[swapIdx]] = [arr[swapIdx], arr[left]]

            steps.push({
                type: 'swap',
                array: [...arr],
                active: [left, swapIdx],
                sorted: [...sorted],
                phase: `Left unsorted — random swap at ${swapIdx}`
            })
        }

        if (left >= right) break

        // check and fix right boundary
        if (arr[right] >= arr[right - 1]) {
            sorted.push(right)
            steps.push({
                type: 'mark-sorted',
                array: [...arr],
                active: [],
                sorted: [...sorted],
                phase: `Right confirmed: index ${right}`
            })
            right--
        } else {
            const swapIdx = randomInt(left, right)

            steps.push({
                type: 'compare',
                array: [...arr],
                active: [right, right - 1],
                sorted: [...sorted],
                phase: `Right unsorted — random swap at ${swapIdx}`
            })

            ;[arr[right], arr[swapIdx]] = [arr[swapIdx], arr[right]]

            steps.push({
                type: 'swap',
                array: [...arr],
                active: [right, swapIdx],
                sorted: [...sorted],
                phase: `Right unsorted — random swap at ${swapIdx}`
            })
        }

        // snapshot every 100 iterations so progress is visible
        if (iterations % 100 === 0) {
            steps.push({
                type: 'snapshot',
                array: [...arr],
                active: [],
                sorted: [...sorted],
                phase: `Iteration ${iterations}`
            })
        }
    }

    // if somehow sorted within max iterations, mark remaining
    if (isSortedRange(arr, left, right)) {
        for (let i = left; i <= right; i++) sorted.push(i)
    }

    steps.push({
        type: 'mark-sorted',
        array: [...arr],
        active: [],
        sorted: [...sorted]
    })

    return steps
}

export const cocktailBogoSort: AlgorithmMeta = {
    id: 'cocktail-bogo',
    name: 'Cocktail Bogo Sort',
    timeComplexity: {
        best: 'O(n)',
        average: 'O(n · n!)',
        worst: 'O(∞)'
    },
    spaceComplexity: 'O(1)',
    description:
        'A chaotic variant of bogo sort that works from both ends simultaneously. Checks if the leftmost and rightmost unsorted elements are in place — if not, performs a random swap. Closes in from both sides but still relies heavily on chance. Capped at 10,000 iterations to keep it watchable.',
    generate
}