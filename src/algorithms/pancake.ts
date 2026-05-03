import type { AlgorithmMeta, SortStep } from './types'

function flip(arr: number[], k: number, steps: SortStep[], sorted: number[]) {
  let left = 0
  let right = k

  while (left < right) {
    ;[arr[left], arr[right]] = [arr[right], arr[left]]

    steps.push({
      type: 'swap',
      array: [...arr],
      active: [left, right],
      sorted: [...sorted],
    })

    left++
    right--
  }
}

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length

    for (let size = n; size > 1; size--) {
        let maxIndex = 0

        for (let i = 1; i < size; i++) {
            steps.push({
                type: 'compare',
                array: [...arr],
                active: [i, maxIndex],
                sorted: [...sorted]
            })

            if (arr[i] > arr[maxIndex]) {
                maxIndex = i
            }
        }

        if (maxIndex === size - 1) {
            sorted.push(size - 1)
            steps.push({
                type: 'mark-sorted',
                array: [...arr],
                active: [],
                sorted: [...sorted]
            })
            continue
        }

        if (maxIndex !== 0) {
            flip(arr, maxIndex, steps, sorted)
        }

        flip(arr, size - 1, steps, sorted)

        sorted.push(size - 1)
        steps.push({
            type: 'mark-sorted',
            array: [...arr],
            active: [],
            sorted: [...sorted]
        })
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

export const pancakeSort: AlgorithmMeta = {
    id: 'pancake',
    name: 'Pancake Sort',
    timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description:
        'Sorts by repeatedly flipping prefixes of the array — like flipping a stack of pancakes. Each pass finds the largest unsorted element, flips it to the front, then flips the whole unsorted region to place it at the end.',
    generate
}