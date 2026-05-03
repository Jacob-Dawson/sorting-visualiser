import { useEffect, useState } from "react"
import { useSortPlayer } from "./hooks/useSortPlayer"
import BarLayout from "./layouts/BarLayout"
import SpectrumLayout from "./layouts/SpectrumLayout"
import RadialLayout from "./layouts/RadialLayout"
import DotLayout from "./layouts/DotLayout"
import PixelLayout from "./layouts/PixelLayout"
import StripLayout from "./layouts/StripLayout"
import type { AlgorithmMeta } from "./algorithms/types"
import { ALGORITHMS } from "./algorithms"
import type { SortStep } from "./algorithms/types"

type LayoutId = 'bar' | 'spectrum' | 'radial' | 'dot' | 'pixel' | 'strip'

const LAYOUTS: { 
  id: LayoutId
  label: string
} [] = [
  { id: 'bar', label: 'bars'},
  { id: 'spectrum', label: 'Spectrum'},
  { id: 'radial', label: 'Radial'},
  { id: 'dot', label: 'Dot'},
  { id: 'pixel', label: 'Pixel'},
  { id: 'strip', label: 'Strips'}
]

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400

function renderLayout(
  id: LayoutId,
  step: SortStep | null,
  width: number,
  height: number
) {
  switch(id){
    case 'bar':
      return <BarLayout step={step} width={width} height={height} />
    case 'spectrum':
      return <SpectrumLayout step={step} width={width} height={height} />
    case 'radial':
      return <RadialLayout step={step} width={width} height={height}/>  
    case 'dot':
      return <DotLayout step={step} width={width} height={height} />
    case 'pixel':
      return <PixelLayout step={step} width={width} height={height} />
    case 'strip':
      return <StripLayout step={step} width={width} height={height} />
  }
}

export default function App(){

  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmMeta>(ALGORITHMS[0])
  const [selectedLayout, setSelectedLayout] = useState<LayoutId>('bar')
  const { currentStep, isPlaying, isFinished, play, pause, resume, reset} = useSortPlayer()

  function randomArray(n: number): number[]{

    return Array.from({length: n}, () => Math.floor(Math.random() * 100) + 1)

  }

  const handleStart = () => {
    const arr = randomArray(60)
    const steps = selectedAlgo.generate(arr)
    play(steps)
  }

  const handleAlgoChange = (id: string) => {

    reset()
    setSelectedAlgo(ALGORITHMS.find(a => a.id === id)!)

  }

  const handleLayoutChange = (id: LayoutId) => {

    reset()
    setSelectedLayout(id)

  }

  return (
    <div style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h1 style={{fontSize: '1.5rem'}}>Sorting Visualiser</h1>

      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <select
          value={selectedAlgo.id}
          onChange={e => handleAlgoChange(e.target.value)}
          style={{
            padding: '0.5rem',
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #444'
          }}
        >
          {ALGORITHMS.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <div style={{
          display: 'flex',
          gap: '0.5rem'
        }}>
          {LAYOUTS.map(l => (
            <button
              key={l.id}
              onClick={() => handleLayoutChange(l.id)}
              style={{
                padding: '0.5rem 1rem',
                background: selectedLayout === l.id ? '#3a86ff' : '#444',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleStart}
          style={{
            padding: '0.5rem 1rem',
            background: '#3a86ff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Start
        </button>

        <button
          onClick={isPlaying ? pause : resume}
          style={{ 
            padding: '0.5rem 1rem',
            background: '#444',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isPlaying ? 'Pause' : 'Resume'}
        </button>

        <button
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            background: '#444',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      <div style={{border: '1px solid #333'}}>
        {renderLayout(selectedLayout, currentStep, CANVAS_WIDTH, CANVAS_HEIGHT)}
      </div>

      <div style={{color: '#888', fontSize: '0.9rem'}}>
        <strong style={{ color: '#fff'}}>
          {selectedAlgo.name}
        </strong>
        - {selectedAlgo.description}
      </div>
    </div>
  )

}