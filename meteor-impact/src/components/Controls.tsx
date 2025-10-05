import { useAppStore } from '../state/store'
import { computeImpact } from '../lib/physics'
import type { ChangeEvent } from 'react'

export function Controls() {
  const { inputs, setInputs, setResults } = useAppStore()

  function onChangeNumber(key: keyof typeof inputs) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value)
      if (!Number.isNaN(value)) {
        setInputs({ [key]: value } as any)
      }
    }
  }

  return (
    <div style={{ position: 'absolute', top: 16, left: 16, padding: 12, background: 'rgba(20,20,20,0.85)', color: '#fff', borderRadius: 8, width: 300, zIndex: 10 }}>
      <h3 style={{ marginTop: 0 }}>Impact Parameters</h3>
      <label>Diameter (km)
        <input type="number" step="0.01" value={inputs.asteroidDiameterKm} onChange={onChangeNumber('asteroidDiameterKm')} style={{ width: '100%' }} />
      </label>
      <label>Density (kg/m³)
        <input type="number" step="1" value={inputs.asteroidDensityKgM3} onChange={onChangeNumber('asteroidDensityKgM3')} style={{ width: '100%' }} />
      </label>
      <label>Velocity (km/s)
        <input type="number" step="0.01" value={inputs.velocityKmPerS} onChange={onChangeNumber('velocityKmPerS')} style={{ width: '100%' }} />
      </label>
      <label>Angle (deg)
        <input type="number" step="0.01" value={inputs.impactAngleDeg} onChange={onChangeNumber('impactAngleDeg')} style={{ width: '100%' }} />
      </label>
      <label>Target density (kg/m³)
        <input type="number" step="1" value={inputs.targetDensityKgM3} onChange={onChangeNumber('targetDensityKgM3')} style={{ width: '100%' }} />
      </label>
      <button style={{ marginTop: 8, width: '100%' }} onClick={() => setResults(computeImpact(inputs))}>Calculate</button>
    </div>
  )
}
