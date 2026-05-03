import { useEffect, useRef } from "react";
import p5 from 'p5'
import type { SortStep } from "../algorithms/types";

interface BarLayoutProps {
    step: SortStep | null
    width: number
    height: number
}

const COLOURS = {
    default: [100, 160, 255],
    compare: [255, 220, 50],
    swap: [255, 80, 80],
    sorted: [80, 255, 140]
} as const

export default function BarLayout({step, width, height}: BarLayoutProps){

    const containerRef = useRef<HTMLDivElement>(null)
    const p5Ref = useRef<p5 | null>(null)
    const stepRef = useRef<SortStep | null>(null)

    useEffect(() => {
        stepRef.current = step
    }, [step])

    useEffect(() => {
        if(!containerRef.current) return

        const sketch = (p: p5) => {
            p.setup = () => {
                p.createCanvas(width, height).parent(containerRef.current!)
                p.noLoop()
            }

            p.draw = () => {
                p.background(15)

                const current = stepRef.current
                if(!current) return

                const arr = current.array
                const n = arr.length
                const max = Math.max(...arr)
                const barWidth = width / n

                for(let i = 0; i < n; i++){

                    const barHeight = (arr[i] / max) * (height - 10)
                    const x = i * barWidth
                    const y = height - barHeight

                    let colour: readonly [number, number, number] = COLOURS.default

                    if(current.sorted?.includes(i)){

                        colour = COLOURS.sorted

                    } else if (current.active?.includes(i)){

                        colour = current.type === 'swap' ? COLOURS.swap : COLOURS.compare

                    }

                    p.fill(colour[0], colour[1], colour[2])
                    p.noStroke()
                    p.rect(x, y, barWidth - 1, barHeight)

                }
            }
        }

        p5Ref.current = new p5(sketch)

        return () => {
            p5Ref.current?.remove()
            p5Ref.current = null
        }
    }, [width, height])

    useEffect(() => {

        p5Ref.current?.redraw()

    }, [step])

    return <div ref={containerRef} />

}