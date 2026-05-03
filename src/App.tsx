import { useEffect, useState } from "react"
import { useSortPlayer } from "./hooks/useSortPlayer"
import BarLayout from "./layouts/BarLayout"
import type { AlgorithmMeta } from "./algorithms/types"
import { ALGORITHMS } from "./algorithms"

function randomArray(n: number): number[]{

  return Array.from({length: n}, () => Math.floor(Math.random() * 100) + 1)

}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400

export default function App(){

  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmMeta>(ALGORITHMS[0])
  const { currentStep, isPlaying, isFinished, play, pause, resume, reset} = useSortPlayer()

  const handleStart = () => {
    const arr = randomArray(60)
    const steps = selectedAlgo.generate(arr)
    play(steps)
  }

  const handleAlgoChange = (id: string) => {

    reset()
    setSelectedAlgo(ALGORITHMS.find(a => a.id === id)!)

  }

  // auto start when algorithm changes mid session
  useEffect(() => {
    if(isFinished){
      handleStart()
    }
  }, [isFinished])

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
        <BarLayout
          step={currentStep}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />
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