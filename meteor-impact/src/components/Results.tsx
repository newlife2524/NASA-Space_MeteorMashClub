import { useAppStore } from '../state/store'

export function Results() {
  const { results } = useAppStore()
  if (!results) return null
  return (
    <div style={{ position: 'absolute', bottom: 16, left: 16, padding: 12, background: 'rgba(20,20,20,0.85)', color: '#fff', borderRadius: 8, width: 320 }}>
      <h3 style={{ marginTop: 0 }}>Results</h3>
      <div>Kinetic energy: {results.kineticEnergyMtTnt.toFixed(2)} Mt TNT</div>
      <div>Crater diameter: {results.craterDiameterKm.toFixed(2)} km</div>
      <div>Crater depth: {results.craterDepthKm.toFixed(2)} km</div>
      {results.airburstAltitudeKm !== undefined && (
        <div>Airburst altitude: {results.airburstAltitudeKm.toFixed(2)} km</div>
      )}
    </div>
  )
}
