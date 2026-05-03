import { useEffect, useRef } from 'react'
import p5 from 'p5'
import type { SortStep } from '../algorithms/types'

interface StripLayoutProps {
  step: SortStep | null
  width: number
  height: number
}

export default function StripLayout({ step, width, height }: StripLayoutProps) {
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
                const stripWidth = width / n

                for (let i = 0; i < n; i++) {
                    const normalised = arr[i] / max
                    const stripHeight = normalised * (height - 10)
                    const hue = normalised * 280
                    const x = i * stripWidth
                    const y = height - stripHeight

                    let saturation = 90
                    let brightness = 90

                    if (current.sorted?.includes(i)) {
                        saturation = 20
                        brightness = 100
                    } else if (current.active?.includes(i)) {
                        if (current.type === 'swap') {
                            // flash white on swap
                            p.fill(0, 0, 100)
                            p.noStroke()
                            p.rect(x, y, stripWidth - 1, stripHeight)
                            continue
                        }
                        saturation = 100
                        brightness = 100
                    }

                    // draw full height background strip for context
                    p.fill(hue, saturation * 0.15, brightness * 0.2)
                    p.noStroke()
                    p.rect(x, 0, stripWidth - 1, height)

                    // draw actual value strip on top
                    p.fill(hue, saturation, brightness)
                    p.noStroke()
                    p.rect(x, y, stripWidth - 1, stripHeight)
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