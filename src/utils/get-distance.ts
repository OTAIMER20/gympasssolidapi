export interface Coordinate {
  latitude: number
  longitude: number
}

export function getDistanceInKm(from: Coordinate, to: Coordinate): number {
  const R = 6371 // raio da Terra em km
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const φ1 = toRad(from.latitude)
  const φ2 = toRad(to.latitude)
  const Δφ = toRad(to.latitude - from.latitude)
  const Δλ = toRad(to.longitude - from.longitude)

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // km
}
