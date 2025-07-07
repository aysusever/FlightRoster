import { type NextRequest, NextResponse } from "next/server"

// Cabin Crew API - provides flight attendant information
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const attendantId = searchParams.get("attendantId")
  const vehicleType = searchParams.get("vehicleType")
  const attendantType = searchParams.get("type")

  const attendants = [
    {
      attendantId: "CC001",
      attendantInfo: {
        name: "Maria Rodriguez",
        age: 35,
        gender: "Female",
        nationality: "Spanish",
        knownLanguages: ["Spanish", "English", "Turkish"],
      },
      attendantType: "Chief",
      attendantVehicleRestriction: ["Boeing 777", "Airbus A320"],
    },
    {
      attendantId: "CC002",
      attendantInfo: {
        name: "Ahmed Hassan",
        age: 28,
        gender: "Male",
        nationality: "Turkish",
        knownLanguages: ["Turkish", "Arabic", "English"],
      },
      attendantType: "Regular",
      attendantVehicleRestriction: ["Boeing 777", "Airbus A320"],
    },
    {
      attendantId: "CC003",
      attendantInfo: {
        name: "Chef Pierre Dubois",
        age: 42,
        gender: "Male",
        nationality: "French",
        knownLanguages: ["French", "English"],
      },
      attendantType: "Chef",
      attendantVehicleRestriction: ["Boeing 777"],
      recipes: ["Coq au Vin", "Beef Bourguignon", "Ratatouille", "French Onion Soup"],
    },
    {
      attendantId: "CC004",
      attendantInfo: {
        name: "Lisa Chen",
        age: 26,
        gender: "Female",
        nationality: "Chinese",
        knownLanguages: ["Chinese", "English"],
      },
      attendantType: "Regular",
      attendantVehicleRestriction: ["Boeing 777", "Airbus A320"],
    },
    {
      attendantId: "CC005",
      attendantInfo: {
        name: "Chef Marco Rossi",
        age: 38,
        gender: "Male",
        nationality: "Italian",
        knownLanguages: ["Italian", "English"],
      },
      attendantType: "Chef",
      attendantVehicleRestriction: ["Boeing 777", "Airbus A320"],
      recipes: ["Risotto Milanese", "Osso Buco", "Tiramisu"],
    },
  ]

  let filteredAttendants = attendants

  if (vehicleType) {
    filteredAttendants = filteredAttendants.filter((attendant) =>
      attendant.attendantVehicleRestriction.some((vehicle) =>
        vehicle.toLowerCase().includes(vehicleType.toLowerCase()),
      ),
    )
  }

  if (attendantType) {
    filteredAttendants = filteredAttendants.filter(
      (attendant) => attendant.attendantType.toLowerCase() === attendantType.toLowerCase(),
    )
  }

  if (attendantId) {
    const attendant = filteredAttendants.find((a) => a.attendantId === attendantId)
    return attendant
      ? NextResponse.json(attendant)
      : NextResponse.json({ error: "Attendant not found" }, { status: 404 })
  }

  return NextResponse.json(filteredAttendants)
}
