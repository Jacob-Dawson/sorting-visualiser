import type { AlgorithmMeta, SortStep } from "./types";

function generate(array: number[]): SortStep[] {

    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length

    // Ciura's gap sequence - empirically optimal
    const gaps = [701, 301, 132, 57, 23, 10, 4, 1].filter(g => g < n)

    for(const gap of gaps){

        for(let i = gap; i < n; i++){

            let j = i

            while(j >= gap){

                steps.push({
                    type: 'compare',
                    array: [...arr],
                    active: [j, j - gap],
                    sorted: [...sorted],
                    phase: `Gap: ${gap}`
                })

                if(arr[j] < arr[j - gap]){

                    ;[arr[j], arr[j - gap]] = [arr[j - gap], arr[j]]

                    steps.push({
                        type: 'swap',
                        array: [...arr],
                        active: [j, j - gap],
                        sorted: [...sorted],
                        phase: `Gap: ${gap}`                
                    })

                    j -= gap

                } else {

                    break

                }

            }

        }

    }

    // final pass done, mark everything sorted
    for(let i = 0; i < n; i++) sorted.push(i)
    
    steps.push({
        type: 'mark-sorted',
        array: [...arr],
        active: [],
        sorted: [...sorted]
    })

    return steps

}

export const shellSort: AlgorithmMeta = {
    id: 'shell',
    name: 'Shell Sort',
    timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log² n)',
        worst: 'O(n log² n)',
    },
    spaceComplexity: 'O(1)',
    description: 'A generalisation of insertion sort that allows comparisons and swaps of elements far apart. Uses a shrinking gap sequence — elements are insertion-sorted at each gap size, ending with a gap of 1 for a final pass.',
    generate
}