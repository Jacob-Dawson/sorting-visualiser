import type { AlgorithmMeta, SortStep } from './types'

function mergeFunc(
  arr: number[],
  left: number,
  right: number,
  steps: SortStep[],
  sorted: number[]
) {
  if (left >= right) return

  const mid = Math.floor((left + right) / 2)

  steps.push({
    type: 'highlight',
    array: [...arr],
    active: [left, mid, right],
    sorted: [...sorted],
    range: [left, right],
    phase: `Split [${left}..${right}]`,
  })

  mergeFunc(arr, left, mid, steps, sorted)
  mergeFunc(arr, mid + 1, right, steps, sorted)

  merge(arr, left, mid, right, steps, sorted)
}

function merge(
    arr: number[],
    left: number,
    mid: number,
    right: number,
    steps: SortStep[],
    sorted: number[]
) {
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)

    let i = 0
    let j = 0
    let k = left

    while (i < leftArr.length && j < rightArr.length) {
        steps.push({
            type: 'compare',
            array: [...arr],
            active: [left + i, mid + 1 + j],
            sorted: [...sorted],
            range: [left, right],
            aux: [leftArr, rightArr],
            phase: `Merge [${left}..${mid}] + [${mid + 1}..${right}]`
        })

        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i]
            i++
        } else {
            arr[k] = rightArr[j]
            j++
        }

        steps.push({
            type: 'overwrite',
            array: [...arr],
            active: [k],
            sorted: [...sorted],
            range: [left, right],
            aux: [leftArr, rightArr],
            phase: `Merge [${left}..${mid}] + [${mid + 1}..${right}]`
        })

        k++
    }

    while (i < leftArr.length) {
        arr[k] = leftArr[i]

        steps.push({
            type: 'overwrite',
            array: [...arr],
            active: [k],
            sorted: [...sorted],
            range: [left, right],
            aux: [leftArr, rightArr],
            phase: `Merge [${left}..${mid}] + [${mid + 1}..${right}]`
        })

        i++
        k++
    }

    while (j < rightArr.length) {
        arr[k] = rightArr[j]

        steps.push({
            type: 'overwrite',
            array: [...arr],
            active: [k],
            sorted: [...sorted],
            range: [left, right],
            aux: [leftArr, rightArr],
            phase: `Merge [${left}..${mid}] + [${mid + 1}..${right}]`
        })

        j++
        k++
    }

    steps.push({
        type: 'snapshot',
        array: [...arr],
        active: [],
        sorted: [...sorted],
        range: [left, right],
        phase: `Merged [${left}..${right}]`
    })

    if (left === 0 && right === arr.length - 1) {
        for (let x = 0; x < arr.length; x++) sorted.push(x)
            steps.push({
            type: 'mark-sorted',
            array: [...arr],
            active: [],
            sorted: [...sorted]
        })
    }
}

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []

    mergeFunc(arr, 0, arr.length - 1, steps, sorted)

    return steps
}

export const mergeSort: AlgorithmMeta = {
    id: 'merge',
    name: 'Merge Sort',
    timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    description:
        'Recursively divides the array in half until each subarray has one element, then merges them back together in sorted order. Guaranteed O(n log n) in all cases at the cost of O(n) extra space.',
    generate
}