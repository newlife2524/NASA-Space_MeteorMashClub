import Decimal from 'decimal.js'
import { z } from 'zod'

export const impactInputSchema = z.object({
  asteroidDiameterKm: z.number().positive(),
  asteroidDensityKgM3: z.number().positive(),
  velocityKmPerS: z.number().positive(),
  impactAngleDeg: z.number().min(0).max(90),
  targetDensityKgM3: z.number().positive(),
})

export type ImpactInputs = z.infer<typeof impactInputSchema>

export type ImpactResults = {
  kineticEnergyMtTnt: number
  craterDiameterKm: number
  craterDepthKm: number
  airburstAltitudeKm?: number
}

// Physics helper: round to 0.01
function round2(x: Decimal): number {
  return x.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber()
}

// Simple physics approximations using high-precision Decimal math
export function computeImpact(inputs: ImpactInputs): ImpactResults {
  const v = new Decimal(inputs.velocityKmPerS).mul(1000) // m/s
  const r = new Decimal(inputs.asteroidDiameterKm).div(2).mul(1000) // m
  const volume = new Decimal(4).div(3).mul(Math.PI).mul(r.pow(3))
  const density = new Decimal(inputs.asteroidDensityKgM3)
  const mass = volume.mul(density) // kg

  const kineticJoules = mass.mul(v.pow(2)).div(2) // J
  const joulesPerMtTnt = new Decimal(4.184e15)
  const energyMt = kineticJoules.div(joulesPerMtTnt)

  // Rough scaling laws for transient crater size (not scientifically rigorous)
  const angleRad = (inputs.impactAngleDeg * Math.PI) / 180
  const verticalVelocity = v.mul(Math.sin(angleRad))
  const coupling = energyMt.pow(1 / 3).mul(verticalVelocity.div(1000))
  const craterDiameterKm = Decimal.max(coupling.mul(0.02), new Decimal(0.01))
  const craterDepthKm = craterDiameterKm.mul(0.2)

  // Simple heuristic: potential airburst if small and porous
  const airburstAltitudeKm =
    inputs.asteroidDensityKgM3 < 1500 && inputs.asteroidDiameterKm < 0.05
      ? 5
      : undefined

  return {
    kineticEnergyMtTnt: round2(energyMt),
    craterDiameterKm: round2(craterDiameterKm),
    craterDepthKm: round2(craterDepthKm),
    airburstAltitudeKm,
  }
}
