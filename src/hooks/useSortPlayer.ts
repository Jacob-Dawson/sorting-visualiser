import { useState, useRef, useCallback, useEffect } from 'react'
import type { SortStep } from '../algorithms/types'

const STEP_INTERVAL_MS = 50

interface UseSortPlayerReturn {
    currentStep: SortStep | null
    isPlaying: boolean
    isFinished: boolean
    stepIndex: number
    totalSteps: number
    play: (steps: SortStep[]) => void
    pause: () => void
    resume: () => void
    reset: () => void
}

export function useSortPlayer(): UseSortPlayerReturn {
    const [currentStep, setCurrentStep] = useState<SortStep | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [stepIndex, setStepIndex] = useState(0)
    const [totalSteps, setTotalSteps] = useState(0)

    const stepsRef = useRef<SortStep[]>([])
    const indexRef = useRef(0)

    useEffect(() => {

        if(!isPlaying) return
        
        const interval = setInterval(() => {

            const i = indexRef.current
            const steps = stepsRef.current

            if(i >= steps.length){

                clearInterval(interval)
                setIsPlaying(false)
                setIsFinished(true)
                return

            }

            setCurrentStep(steps[i])
            setStepIndex(i)
            indexRef.current = i + 1

        }, STEP_INTERVAL_MS)

        return () => clearInterval(interval)

    }, [isPlaying])

    const play = useCallback((steps: SortStep[]) => {

        stepsRef.current = steps
        indexRef.current = 0
        setTotalSteps(steps.length)
        setStepIndex(0)
        setCurrentStep(steps[0])
        setIsFinished(false)
        setIsPlaying(true)

    }, [])

    const pause = useCallback(() => {

        setIsPlaying(false)

    }, [])

    const resume = useCallback(() => {
        if(stepsRef.current.length === 0) return
        setIsPlaying(true)
    }, [])

    const reset = useCallback(() => {
        setIsPlaying(false)
        setIsFinished(false)
        setCurrentStep(null)
        setStepIndex(0)
        setTotalSteps(0)
        stepsRef.current = []
        indexRef.current = 0
    }, [])

    return {
        currentStep,
        isPlaying,
        isFinished,
        stepIndex,
        totalSteps,
        play,
        pause,
        resume,
        reset
    }
}