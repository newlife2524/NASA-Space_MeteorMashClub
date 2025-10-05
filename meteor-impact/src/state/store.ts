import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ImpactInputs, ImpactResults } from '../lib/physics'

export type NEO = {
  id: string
  name: string
  absoluteMagnitudeH?: number
  estimatedDiameterKm?: number
  isPotentiallyHazardous: boolean
  closeApproachDate?: string
  missDistanceKm?: number
  relativeVelocityKmS?: number
}

export type AppState = {
  inputs: ImpactInputs
  results?: ImpactResults
  neos: NEO[]
  loadingNEO: boolean
  setInputs: (updates: Partial<ImpactInputs>) => void
  setResults: (results: ImpactResults) => void
  setNEOs: (neos: NEO[]) => void
  setLoadingNEO: (loading: boolean) => void
}

const defaultInputs: ImpactInputs = {
  asteroidDiameterKm: 0.05,
  asteroidDensityKgM3: 3000,
  velocityKmPerS: 20,
  impactAngleDeg: 45,
  targetDensityKgM3: 2500,
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      inputs: defaultInputs,
      results: undefined,
      neos: [],
      loadingNEO: false,
      setInputs: (updates) => set((s) => ({ inputs: { ...s.inputs, ...updates } })),
      setResults: (results) => set({ results }),
      setNEOs: (neos) => set({ neos }),
      setLoadingNEO: (loading) => set({ loadingNEO: loading }),
    }),
    { name: 'meteor-impact-store' }
  )
)
