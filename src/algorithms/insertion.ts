import type { AlgorithmMeta, SortStep } from "./types";

function generate(array: number[]): SortStep[] {

    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = [0]
    const n = arr.length

    for(let i = 1; i < n; i++){

        let j = i

        while(j > 0){

            steps.push({
                type: 'compare',
                array: [...arr],
                active: [j, j - 1],
                sorted: [...sorted]
            })

            if(arr[j] < arr[j - 1]){

                ;[arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]

                steps.push({
                    type: 'swap',
                    array: [...arr],
                    active: [j, j - 1],
                    sorted: [...sorted]
                })

                j--

            } else {

                break

            }

        }

        sorted.push(i)
        steps.push({
            type: 'mark-sorted',
            array: [...arr],
            active: [],
            sorted: [...sorted]
        })

    }

    return steps

}

export const insertionSort: AlgorithmMeta = {
    id: 'insertion',
    name: 'Insertion Sort',
    timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description: 'Builds the sorted array one element at a time by taking each new element and shifting it leftward into its correct position among the already-sorted elements.',
    generate
}