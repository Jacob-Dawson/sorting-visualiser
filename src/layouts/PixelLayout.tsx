import { useEffect, useRef } from 'react'
import p5 from 'p5'
import type { SortStep } from '../algorithms/types'

interface PixelLayoutProps {
  step: SortStep | null
  width: number
  height: number
}

export default function PixelLayout({ step, width, height }: PixelLayoutProps) {
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

                // lay out pixels in a grid
                const cols = Math.ceil(Math.sqrt(n * (width / height)))
                const rows = Math.ceil(n / cols)
                const pixelW = width / cols
                const pixelH = height / rows

                for (let i = 0; i < n; i++) {
                    const col = i % cols
                    const row = Math.floor(i / cols)
                    const x = col * pixelW
                    const y = row * pixelH
                    const hue = (arr[i] / max) * 280

                    let saturation = 90
                    let brightness = 90

                    if (current.sorted?.includes(i)) {
                        saturation = 15
                        brightness = 100
                    } else if (current.active?.includes(i)) {
                        if (current.type === 'swap') {
                            p.fill(0, 0, 100)
                            p.noStroke()
                            p.rect(x, y, pixelW, pixelH)
                            continue
                        }
                        saturation = 100
                        brightness = 100
                    }

                    p.fill(hue, saturation, brightness)
                    p.noStroke()
                    p.rect(x, y, pixelW, pixelH)
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