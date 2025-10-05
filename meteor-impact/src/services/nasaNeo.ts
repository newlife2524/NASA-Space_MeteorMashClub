import { z } from 'zod'
import type { NEO } from '../state/store'

const neoSchema = z.object({
  id: z.string(),
  name: z.string(),
  absolute_magnitude_h: z.number().optional(),
  estimated_diameter: z.object({
    kilometers: z.object({
      estimated_diameter_min: z.number().optional(),
      estimated_diameter_max: z.number().optional(),
    }),
  }).optional(),
  is_potentially_hazardous_asteroid: z.boolean(),
  close_approach_data: z
    .array(
      z.object({
        close_approach_date: z.string().optional(),
        miss_distance: z.object({ kilometers: z.string().optional() }).optional(),
        relative_velocity: z.object({ kilometers_per_second: z.string().optional() }).optional(),
      })
    )
    .optional(),
})

const feedSchema = z.object({
  element_count: z.number(),
  near_earth_objects: z.record(z.string(), z.array(neoSchema)),
})

export async function fetchNEOFeed({ startDate, endDate }: { startDate: string; endDate: string }): Promise<NEO[]> {
  const apiKey = import.meta.env.VITE_NASA_API_KEY
  if (!apiKey) throw new Error('Missing VITE_NASA_API_KEY')
  const url = new URL('https://api.nasa.gov/neo/rest/v1/feed')
  url.searchParams.set('start_date', startDate)
  url.searchParams.set('end_date', endDate)
  url.searchParams.set('api_key', apiKey)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`NASA NEO feed error: ${res.status}`)
  const json = await res.json()
  const parsed = feedSchema.parse(json)

  const all: NEO[] = []
  const days = Object.keys(parsed.near_earth_objects)
  for (const day of days) {
    const list = parsed.near_earth_objects[day]
    for (const item of (list ?? [])) {
      const km = item.estimated_diameter?.kilometers
      const approach = item.close_approach_data?.[0]
      const missKm = approach?.miss_distance?.kilometers
      const relVel = approach?.relative_velocity?.kilometers_per_second
      all.push({
        id: item.id,
        name: item.name,
        absoluteMagnitudeH: item.absolute_magnitude_h,
        estimatedDiameterKm: km ? ((km.estimated_diameter_min ?? 0) + (km.estimated_diameter_max ?? 0)) / 2 : undefined,
        isPotentiallyHazardous: item.is_potentially_hazardous_asteroid,
        closeApproachDate: approach?.close_approach_date,
        missDistanceKm: missKm ? Number(missKm) : undefined,
        relativeVelocityKmS: relVel ? Number(relVel) : undefined,
      })
    }
  }
  return all
}
