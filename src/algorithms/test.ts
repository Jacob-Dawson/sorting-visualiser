import { bubbleSort } from './bubble'
import { selectionSort } from './selection'
import { insertionSort } from './insertion'
import { doubleSelectionSort } from './doubleSelection'
import { shellSort } from './shell'
import type { AlgorithmMeta } from './types'

const algorithms: AlgorithmMeta[] = [
    bubbleSort,
    selectionSort,
    insertionSort,
    doubleSelectionSort,
    shellSort,
]

function randomArray(n: number): number[] {
    return Array.from({ length: n }, () => Math.floor(Math.random() * 100))
}

function isSorted(arr: number[]): boolean {
    return arr.every((v, i) => i === 0 || arr[i - 1] <= v)
}

for (const algo of algorithms) {
    const input = randomArray(20)
    const steps = algo.generate(input)
    const finalArray = steps[steps.length - 1].array

    const ok = isSorted(finalArray)
    console.log(`${algo.name}: ${ok ? '✅' : '❌'} — ${steps.length} steps`)

    if (!ok) {
        console.log('  Input:  ', input)
        console.log('  Output: ', finalArray)
    }
}