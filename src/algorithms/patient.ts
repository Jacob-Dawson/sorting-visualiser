import type { AlgorithmMeta, SortStep } from './types'

function generate(array: number[]): SortStep[] {
    const steps: SortStep[] = []
    const arr = [...array]
    const sorted: number[] = []
    const n = arr.length

    const piles: number[][] = []

    // deal cards into piles
    for (let i = 0; i < n; i++) {
        const card = arr[i]
        let placed = false

        for (let p = 0; p < piles.length; p++) {
            const top = piles[p][piles[p].length - 1]

            steps.push({
                type: 'compare',
                array: [...arr],
                active: [i],
                sorted: [...sorted],
                aux: piles.map(pile => [...pile]),
                phase: `Dealing — comparing ${card} with pile ${p} top (${top})`
            })

            if (card <= top) {
                piles[p].push(card)
                placed = true

                steps.push({
                    type: 'highlight',
                    array: [...arr],
                    active: [i],
                    sorted: [...sorted],
                    aux: piles.map(pile => [...pile]),
                    phase: `Dealing — placed ${card} on pile ${p}`
                })

                break
            }
        }

        if (!placed) {
            piles.push([card])

            steps.push({
                type: 'highlight',
                array: [...arr],
                active: [i],
                sorted: [...sorted],
                aux: piles.map(pile => [...pile]),
                phase: `Dealing — new pile created for ${card}`
            })
        }
    }

    steps.push({
        type: 'snapshot',
        array: [...arr],
        active: [],
        sorted: [...sorted],
        aux: piles.map(pile => [...pile]),
        phase: `All cards dealt — ${piles.length} piles`
    })

    // merge piles back using k-way merge
    let k = 0
    while (piles.some(p => p.length > 0)) {
        let minVal = Infinity
        let minPile = -1

        for (let p = 0; p < piles.length; p++) {
            if (piles[p].length === 0) continue

            const top = piles[p][piles[p].length - 1]

            steps.push({
                type: 'compare',
                array: [...arr],
                active: [k],
                sorted: [...sorted],
                aux: piles.map(pile => [...pile]),
                phase: `Merging — checking pile ${p} top (${top})`
            })

            if (top < minVal) {
                minVal = top
                minPile = p
            }
        }

        piles[minPile].pop()
        arr[k] = minVal

        steps.push({
            type: 'overwrite',
            array: [...arr],
            active: [k],
            sorted: [...sorted],
            aux: piles.map(pile => [...pile]),
            phase: `Merging — placed ${minVal} at index ${k}`
        })

        sorted.push(k)
        steps.push({
            type: 'mark-sorted',
            array: [...arr],
            active: [],
            sorted: [...sorted],
            aux: piles.map(pile => [...pile]),
            phase: 'Merging piles'
        })

        k++
    }

    return steps
}

export const patientSort: AlgorithmMeta = {
    id: 'patient',
    name: 'Patient Sort',
    timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    description:
        'Inspired by the patience card game. Cards are dealt into piles where each card must be placed on a pile whose top card is greater or equal, or starts a new pile. Piles are then k-way merged back into sorted order. The pile structure is clearly visible via the aux arrays.',
    generate
}