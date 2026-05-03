import type { AlgorithmMeta, SortStep } from "./types";

function generate(array: number[]): SortStep[] {

    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length

    let left = 0
    let right = n - 1

    while(left < right){

        let minIndex = left
        let maxIndex = left
        
        for(let j = left + 1; j <= right; j++){

            steps.push({
                type: 'compare',
                array: [...arr],
                active: [minIndex, j],
                sorted: [...sorted]
            })

            if(arr[j] < arr[minIndex]){

                minIndex = j

            }

            steps.push({
                type: 'compare',
                array: [...arr],
                active: [maxIndex, j],
                sorted: [...sorted]
            })

            if(arr[j] > arr[maxIndex]){

                maxIndex = j

            }

        }

        if(minIndex !== left){

            ;[arr[left], arr[minIndex]] = [arr[minIndex], arr[left]]

            steps.push({
                type: 'swap',
                array: [...arr],
                active: [left, minIndex],
                sorted: [...sorted]
            })

            // if maxIndex was at left, it has now moved to minIndex
            if(maxIndex === left) maxIndex = minIndex

        }

        if(maxIndex !== right){

            ;[arr[right], arr[maxIndex]] = [arr[maxIndex], arr[right]]

            steps.push({
                type: 'swap',
                array: [...arr],
                active: [right, maxIndex],
                sorted: [...sorted]
            })

        }

        sorted.push(left, right)
        steps.push({
            type: 'mark-sorted',
            array: [...arr],
            active: [],
            sorted: [...sorted]
        })

        left++
        right--

    }

    if(left === right){

        sorted.push(left)
        steps.push({
            type: 'mark-sorted',
            array: [...arr],
            active: [],
            sorted: [...sorted]
        })

    }

    return steps

}

export const doubleSelectionSort: AlgorithmMeta = {
    id: 'double-selection',
    name: 'Double Selection Sort',
    timeComplexity: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description: 'An optimisation of selection sort that finds both the minimum and maximum element in each pass, placing them at the left and right ends simultaneously. Halves the number of passes needed.',
    generate
}