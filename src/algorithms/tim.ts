import type { AlgorithmMeta, SortStep } from './types'

const RUN = 32

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
                phase: `Insertion Sort Run [${left}..${right}]`
            })

            if (arr[j] < arr[j - 1]) {
                ;[arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]

                steps.push({
                    type: 'swap',
                    array: [...arr],
                    active: [j, j - 1],
                    sorted: [...sorted],
                    range: [left, right],
                    phase: `Insertion Sort Run [${left}..${right}]`
                })

                j--
            } else {
                break
            }
        }
    }
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
}

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length

    // sort individual runs with insertion sort
    for (let i = 0; i < n; i += RUN) {
        const right = Math.min(i + RUN - 1, n - 1)
        insertionSort(arr, i, right, steps, sorted)

        steps.push({
            type: 'snapshot',
            array: [...arr],
            active: [],
            sorted: [...sorted],
            range: [i, right],
            phase: `Run sorted [${i}..${right}]`
        })
    }

    // merge runs together
    for (let size = RUN; size < n; size *= 2) {
        for (let left = 0; left < n; left += size * 2) {
            const mid = Math.min(left + size - 1, n - 1)
            const right = Math.min(left + size * 2 - 1, n - 1)

            if (mid < right) {
                merge(arr, left, mid, right, steps, sorted)
            }
        }
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

export const timSort: AlgorithmMeta = {
    id: 'tim',
    name: 'Tim Sort',
    timeComplexity: {
        best: 'O(n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    description:
        'A hybrid of insertion sort and merge sort used in Python and Java\'s standard libraries. Divides the array into small runs sorted by insertion sort, then merges them using merge sort. The two distinct phases are clearly visible in the animation.',
    generate
}