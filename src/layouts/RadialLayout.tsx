import { useEffect, useRef } from "react";
import p5 from 'p5'
import type { SortStep } from "../algorithms/types";

interface RadialLayoutProps {
    step: SortStep | null
    width: number
    height: number
}

export default function RadialLayout({
    step,
    width,
    height
}: RadialLayoutProps){

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
                const cx = width / 2
                const cy = height / 2
                const maxRadius = Math.min(width, height) * 0.45
                const minRadius = maxRadius * 0.2
                const angleStep = (Math.PI * 2) / n

                for(let i = 0; i < n; i++){

                    const angle = i * angleStep - Math.PI / 2
                    const radius = minRadius + (arr[i] / max) * (maxRadius - minRadius)
                    const hue = (arr[i] / max) * 280

                    const x = cx + Math.cos(angle) * radius
                    const y = cy + Math.sin(angle) * radius

                    let saturation = 90
                    let brightness = 90
                    let dotSize = 4

                    if(current.sorted?.includes(i)){

                        saturation = 20
                        brightness = 100
                        dotSize = 3

                    } else if (current.active?.includes(i)){

                        saturation = 100
                        brightness = 100
                        dotSize = current.type === 'swap' ? 10 : 7

                    }

                    p.fill(hue, saturation, brightness)
                    p.noStroke()
                    p.circle(x, y, dotSize)

                }

                // draw a faint guide circle
                p.noFill()
                p.stroke(0, 0, 25)
                p.strokeWeight(0.5)
                p.circle(cx, cy, maxRadius * 2)
                p.circle(cx, cy, minRadius * 2)
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