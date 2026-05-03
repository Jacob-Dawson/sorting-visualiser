import { useEffect, useRef } from 'react'
import p5 from 'p5'
import type { SortStep } from '../algorithms/types'

interface DotLayoutProps {
    step: SortStep | null
    width: number
    height: number
}

export default function DotLayout({ step, width, height }: DotLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const p5Ref = useRef<p5 | null>(null)
    const stepRef = useRef<SortStep | null>(null)

    useEffect(() => {
        stepRef.current = step
    }, [step])

    useEffect(() => {
        if (!containerRef.current) return

        const sketch = (p: p5) => {
            p.setup = () => {
                p.createCanvas(width, height).parent(containerRef.current!)
                p.colorMode(p.HSB, 360, 100, 100)
                p.noLoop()
            }

            p.draw = () => {
                p.background(0, 0, 10)

                const current = stepRef.current
                if (!current) return

                const arr = current.array
                const n = arr.length
                const max = Math.max(...arr)
                const padding = 20

                const plotWidth = width - padding * 2
                const plotHeight = height - padding * 2

                // draw faint grid lines
                p.stroke(0, 0, 20)
                p.strokeWeight(0.5)
                for (let i = 0; i <= 4; i++) {
                    const x = padding + (i / 4) * plotWidth
                    const y = padding + (i / 4) * plotHeight
                    p.line(x, padding, x, padding + plotHeight)
                    p.line(padding, y, padding + plotWidth, y)
                }

                for (let i = 0; i < n; i++) {
                    const x = padding + (i / (n - 1)) * plotWidth
                    const y = padding + plotHeight - (arr[i] / max) * plotHeight
                    const hue = (arr[i] / max) * 280

                    let saturation = 85
                    let brightness = 85
                    let dotSize = 5

                    if (current.sorted?.includes(i)) {
                        saturation = 20
                        brightness = 100
                        dotSize = 4
                    } else if (current.active?.includes(i)) {
                        saturation = 100
                        brightness = 100
                        dotSize = current.type === 'swap' ? 12 : 8

                        // draw a vertical drop line for active dots
                        p.stroke(hue, 40, 50)
                        p.strokeWeight(1)
                        p.line(x, y + dotSize / 2, x, padding + plotHeight)
                    }

                p.noStroke()
                p.fill(hue, saturation, brightness)
                p.circle(x, y, dotSize)
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