import { type NextRequest, NextResponse } from "next/server"

// Flight Crew API - provides pilot information
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pilotId = searchParams.get("pilotId")
  const vehicleType = searchParams.get("vehicleType")
  const maxDistance = searchParams.get("maxDistance")

  const pilots = [
    {
      pilotId: "FC001",
      pilotInfo: {
        name: "Captain John Smith",
        age: 45,
        gender: "Male",
        nationality: "Turkish",
        knownLanguages: ["Turkish", "English", "German"],
      },
      pilotVehicleRestriction: "Boeing 777",
      pilotAllowedRange: 15000,
      pilotSeniorityLevel: "Senior",
    },
    {
      pilotId: "FC002",
      pilotInfo: {
        name: "First Officer Sarah Johnson",
        age: 32,
        gender: "Female",
        nationality: "American",
        knownLanguages: ["English", "Spanish"],
      },
      pilotVehicleRestriction: "Boeing 777",
      pilotAllowedRange: 12000,
      pilotSeniorityLevel: "Junior",
    },
    {
      pilotId: "FC003",
      pilotInfo: {
        name: "Captain Ahmed Yilmaz",
        age: 52,
        gender: "Male",
        nationality: "Turkish",
        knownLanguages: ["Turkish", "English", "Arabic"],
      },
      pilotVehicleRestriction: "Airbus A320",
      pilotAllowedRange: 8000,
      pilotSeniorityLevel: "Senior",
    },
    {
      pilotId: "FC004",
      pilotInfo: {
        name: "Trainee Pilot Mark Davis",
        age: 25,
        gender: "Male",
        nationality: "Canadian",
        knownLanguages: ["English"],
      },
      pilotVehicleRestriction: "Boeing 737",
      pilotAllowedRange: 4000,
      pilotSeniorityLevel: "Trainee",
    },
  ]

  let filteredPilots = pilots

  if (vehicleType) {
    filteredPilots = filteredPilots.filter((pilot) =>
      pilot.pilotVehicleRestriction.toLowerCase().includes(vehicleType.toLowerCase()),
    )
  }

  if (maxDistance) {
    filteredPilots = filteredPilots.filter((pilot) => pilot.pilotAllowedRange >= Number.parseInt(maxDistance))
  }

  if (pilotId) {
    const pilot = filteredPilots.find((p) => p.pilotId === pilotId)
    return pilot ? NextResponse.json(pilot) : NextResponse.json({ error: "Pilot not found" }, { status: 404 })
  }

  return NextResponse.json(filteredPilots)
}
