import type { AlgorithmMeta, SortStep } from "./types";

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length

    for(let i = 0; i < n - 1; i++){

        for(let j = 0; j < n - 1; j++){

            steps.push({
                type: 'compare',
                array: [...arr],
                active: [j, j + 1],
                sorted: [...sorted]
            })

            if(arr[j] > arr[j + 1]) {
                ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]

                steps.push({
                    type: 'swap',
                    array: [...arr],
                    active: [j, j + 1],
                    sorted: [...sorted]
                })
            }

        }

        sorted.push(n - 1 - i)
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

export const bubbleSort: AlgorithmMeta = {

    id: 'bubble',
    name: 'Bubble Sort',
    timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description: 'Repeatedly steps through the list, compares adjacent elements and swap them if they are in the wrong order. The largest unsorted element bubbles to its correct position each pass.',
    generate

}