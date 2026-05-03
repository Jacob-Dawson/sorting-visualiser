import { useEffect, useRef } from "react";
import p5 from 'p5'
import type { SortStep } from "../algorithms/types";

interface SpectrumLayoutProps {
    step: SortStep | null
    width: number
    height: number
}

export default function SpectrumLayout({
    step,
    width,
    height
}: SpectrumLayoutProps){

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
                p.colorMode(p.HSB, 360, 100, 100)
                p.noLoop()
            }

            p.draw = () => {
                p.background(0, 0, 10)

                const current = stepRef.current
                if(!current) return

                const arr = current.array
                const n = arr.length
                const max = Math.max(...arr)
                const stripWidth = width / n

                for(let i = 0; i < n; i++){

                    const hue = (arr[i] / max) * 280 // 0 (red) to 280 (violet)
                    const x = i * stripWidth

                    let saturation = 90
                    let brightness = 90

                    if(current.sorted?.includes(i)){

                        saturation = 20
                        brightness = 100

                    } else if (current.active?.includes(i)){

                        saturation = 100
                        brightness = 100

                        // flash white on swap
                        if(current.type === 'swap'){

                            p.fill(0, 0, 100)
                            p.noStroke()
                            p.rect(x, 0, stripWidth, height)
                            continue

                        }

                    }

                    p.fill(hue, saturation, brightness)
                    p.noStroke()
                    p.rect(x, 0, stripWidth, height)

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