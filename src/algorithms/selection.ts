import type { AlgorithmMeta, SortStep } from "./types";

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length

    for(let i = 0; i < n - 1; i++){

        let minIndex = i

        for(let j = i + 1; j < n; j++){

            steps.push({
                type: 'compare',
                array: [...arr],
                active: [minIndex, j],
                sorted: [...sorted]
            })

            if(arr[j] < arr[minIndex]){

                minIndex = j

            }

        }

        if(minIndex !== i){

            ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]

            steps.push({
                type: 'swap',
                array: [...arr],
                active: [i, minIndex],
                sorted: [...sorted]
            })

        }

        sorted.push(i)
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

export const selectionSort: AlgorithmMeta = {
    id: 'selection',
    name: 'Selection Sort',
    timeComplexity: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description: 'Divides the array into a sorted and unsorted region. On each pass it finds the minimum element in the unsorted region and swaps it into its correct position at the front.',
    generate
}