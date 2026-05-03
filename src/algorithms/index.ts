import { bubbleSort } from './bubble'
import { selectionSort } from './selection'
import { doubleSelectionSort } from './doubleSelection'
import { insertionSort } from './insertion'
import { shellSort } from './shell'
import { gnomeSort } from './gnome'
import { cycleSort } from './cycle'
import { pancakeSort } from './pancake'
import { cocktailShakerSort } from './cocktailShaker'
import { mergeSort } from './merge'
import { quickSort } from './quick'
import { heapSort } from './heap'
import { timSort } from './tim'
import { introSort } from './intro'
import { radixSort } from './radix'
import { countingSort } from './counting'
import { patientSort } from './patient'
import { cocktailBogoSort } from './cocktailBogo'
import type { AlgorithmMeta } from './types'

export const ALGORITHMS: AlgorithmMeta[] = [
    bubbleSort,
    selectionSort,
    doubleSelectionSort,
    insertionSort,
    shellSort,
    gnomeSort,
    cycleSort,
    pancakeSort,
    cocktailShakerSort,
    mergeSort,
    quickSort,
    heapSort,
    timSort,
    introSort,
    radixSort,
    countingSort,
    patientSort,
    cocktailBogoSort,
]

export type { AlgorithmMeta }