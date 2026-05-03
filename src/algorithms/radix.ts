import type { AlgorithmMeta, SortStep } from './types'

function getDigit(num: number, place: number): number {
    return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10
}

function digitCount(num: number): number {
    if (num === 0) return 1
    return Math.floor(Math.log10(Math.abs(num))) + 1
}

function mostDigits(arr: number[]): number {
    return Math.max(...arr.map(digitCount))
}

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length
    const maxDigits = mostDigits(arr)

    for (let digit = 0; digit < maxDigits; digit++) {
        const buckets: number[][] = Array.from({ length: 10 }, () => [])

        // distribute into buckets
        for (let i = 0; i < n; i++) {
            const d = getDigit(arr[i], digit)

            steps.push({
                type: 'highlight',
                array: [...arr],
                active: [i],
                sorted: [...sorted],
                aux: buckets.map(b => [...b]),
                phase: `Pass ${digit + 1} — distributing (digit: ${digit === 0 ? 'units' : digit === 1 ? 'tens' : digit === 2 ? 'hundreds' : `10^${digit}`})`
            })

            buckets[d].push(arr[i])
        }

        steps.push({
            type: 'snapshot',
            array: [...arr],
            active: [],
            sorted: [...sorted],
            aux: buckets.map(b => [...b]),
            phase: `Pass ${digit + 1} — buckets filled`
        })

        // collect from buckets back into array
        let k = 0
        for (let b = 0; b < 10; b++) {
            for (let i = 0; i < buckets[b].length; i++) {
                arr[k] = buckets[b][i]

                steps.push({
                    type: 'overwrite',
                    array: [...arr],
                    active: [k],
                    sorted: [...sorted],
                    aux: buckets.map(bucket => [...bucket]),
                    phase: `Pass ${digit + 1} — collecting from bucket ${b}`
                })

                k++
            }
        }

        steps.push({
            type: 'snapshot',
            array: [...arr],
            active: [],
            sorted: [...sorted],
            phase: `Pass ${digit + 1} complete`
        })
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

export const radixSort: AlgorithmMeta = {
    id: 'radix',
    name: 'Radix Sort (LSD)',
    timeComplexity: {
        best: 'O(nk)',
        average: 'O(nk)',
        worst: 'O(nk)'
    },
    spaceComplexity: 'O(n + k)',
    description:
        'A non-comparison sort that processes digits from least significant to most significant (LSD). Elements are distributed into 10 buckets per pass based on the current digit, then collected back in order. Number of passes equals the digit count of the largest element.',
    generate
}