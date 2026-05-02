export type StepType = 
    | 'compare'
    | 'swap'
    | 'overwrite'
    | 'highlight'
    | 'mark-sorted'
    | 'snapshot'

export interface SortStep {
    type: StepType
    array: number[]
    active?: number[]
    sorted?: number[]
    range?: [number, number]
    aux?: number[][]
    phase?: string
}

export interface AlgorithmMeta{
    id: string
    name: string
    timeComplexity: {
        best: string
        average: string
        worst: string
    }
    spaceComplexity: string
    description: string
    generate: (array: number[]) => SortStep[]
}