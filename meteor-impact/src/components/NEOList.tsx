import { useAppStore } from '../state/store'
import { computeImpact } from '../lib/physics'

export function NEOList() {
  const { neos, setInputs, inputs, setResults } = useAppStore()
  if (!neos.length) return null
  return (
    <div style={{ position: 'absolute', top: 60, right: 16, padding: 12, background: 'rgba(20,20,20,0.85)', color: '#fff', borderRadius: 8, width: 360, maxHeight: 320, overflowY: 'auto', zIndex: 10 }}>
      <h3 style={{ marginTop: 0 }}>NEOs Today</h3>
      {neos.map((n) => (
        <div key={n.id} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontWeight: 600 }}>{n.name}</div>
          <div>Diameter: {n.estimatedDiameterKm?.toFixed(2) ?? '—'} km</div>
          <div>Miss distance: {n.missDistanceKm?.toFixed(2) ?? '—'} km</div>
          <div>Velocity: {n.relativeVelocityKmS?.toFixed(2) ?? '—'} km/s</div>
          <div>Hazardous: {n.isPotentiallyHazardous ? 'Yes' : 'No'}</div>
          <button
            style={{ marginTop: 6 }}
            onClick={() => {
              const updates: Partial<typeof inputs> = {}
              if (n.estimatedDiameterKm) updates.asteroidDiameterKm = Number(n.estimatedDiameterKm.toFixed(2))
              if (n.relativeVelocityKmS) updates.velocityKmPerS = Number(n.relativeVelocityKmS.toFixed(2))
              setInputs(updates)
              const next = { ...inputs, ...updates }
              setResults(computeImpact(next))
            }}
          >
            Simulate this NEO
          </button>
        </div>
      ))}
    </div>
  )
}
