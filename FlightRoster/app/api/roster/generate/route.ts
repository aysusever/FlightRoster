import { type NextRequest, NextResponse } from "next/server"

// Mock data for demonstration
const mockFlightData = {
  TK1234: {
    flightNumber: "TK1234",
    date: "2024-01-15 14:30",
    duration: "8h 45m",
    distance: "8,000 km",
    source: {
      country: "Turkey",
      city: "Istanbul",
      airport: "Istanbul Airport",
      code: "IST",
    },
    destination: {
      country: "United States",
      city: "New York",
      airport: "John F. Kennedy International Airport",
      code: "JFK",
    },
    aircraftType: "Boeing 777-300ER",
    totalSeats: 396,
  },
  TK5678: {
    flightNumber: "TK5678",
    date: "2024-01-16 10:15",
    duration: "4h 20m",
    distance: "2,500 km",
    source: {
      country: "Turkey",
      city: "Istanbul",
      airport: "Istanbul Airport",
      code: "IST",
    },
    destination: {
      country: "United Kingdom",
      city: "London",
      airport: "Heathrow Airport",
      code: "LHR",
    },
    aircraftType: "Airbus A320",
    totalSeats: 180,
  },
}

const mockCrewData = {
  flightCrew: [
    {
      id: "FC001",
      name: "Captain John Smith",
      age: 45,
      gender: "Male",
      nationality: "Turkish",
      languages: ["Turkish", "English", "German"],
      seniority: "Senior",
      vehicleRestriction: "Boeing 777",
      allowedRange: 15000,
      position: "Captain",
    },
    {
      id: "FC002",
      name: "First Officer Sarah Johnson",
      age: 32,
      gender: "Female",
      nationality: "American",
      languages: ["English", "Spanish"],
      seniority: "Junior",
      vehicleRestriction: "Boeing 777",
      allowedRange: 12000,
      position: "First Officer",
    },
  ],
  cabinCrew: [
    {
      id: "CC001",
      name: "Maria Rodriguez",
      age: 35,
      gender: "Female",
      nationality: "Spanish",
      languages: ["Spanish", "English", "Turkish"],
      type: "Chief",
      vehicleRestrictions: ["Boeing 777", "Airbus A320"],
      position: "Chief Flight Attendant",
    },
    {
      id: "CC002",
      name: "Ahmed Hassan",
      age: 28,
      gender: "Male",
      nationality: "Turkish",
      languages: ["Turkish", "Arabic", "English"],
      type: "Regular",
      vehicleRestrictions: ["Boeing 777", "Airbus A320"],
      position: "Flight Attendant",
    },
    {
      id: "CC003",
      name: "Chef Pierre Dubois",
      age: 42,
      gender: "Male",
      nationality: "French",
      languages: ["French", "English"],
      type: "Chef",
      vehicleRestrictions: ["Boeing 777"],
      recipes: ["Coq au Vin", "Beef Bourguignon", "Ratatouille"],
      position: "Chef",
    },
    {
      id: "CC004",
      name: "Lisa Chen",
      age: 26,
      gender: "Female",
      nationality: "Chinese",
      languages: ["Chinese", "English"],
      type: "Regular",
      vehicleRestrictions: ["Boeing 777", "Airbus A320"],
      position: "Flight Attendant",
    },
  ],
}

const generatePassengers = (flightNumber: string, totalSeats: number) => {
  const passengers = []
  const passengerCount = Math.floor(totalSeats * 0.85) // 85% occupancy

  const firstNames = ["John", "Sarah", "Michael", "Emma", "David", "Lisa", "Robert", "Anna", "James", "Maria"]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ]
  const nationalities = [
    "American",
    "British",
    "German",
    "French",
    "Turkish",
    "Spanish",
    "Italian",
    "Chinese",
    "Japanese",
    "Canadian",
  ]

  for (let i = 0; i < passengerCount; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const age = Math.floor(Math.random() * 70) + 18
    const seatType = Math.random() < 0.2 ? "business" : "economy"

    // Generate seat number
    const row = Math.floor(i / 6) + 1
    const seatLetter = String.fromCharCode(65 + (i % 6))
    const seatNumber = `${row}${seatLetter}`

    passengers.push({
      id: `P${String(i + 1).padStart(3, "0")}`,
      name: `${firstName} ${lastName}`,
      age,
      gender: Math.random() < 0.5 ? "Male" : "Female",
      nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
      seatType,
      seatNumber,
    })
  }

  return passengers
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const flightNumber = searchParams.get("flightNumber")

  if (!flightNumber || !mockFlightData[flightNumber as keyof typeof mockFlightData]) {
    return NextResponse.json({ error: "Flight not found" }, { status: 404 })
  }

  const flightInfo = mockFlightData[flightNumber as keyof typeof mockFlightData]
  const passengers = generatePassengers(flightNumber, flightInfo.totalSeats)

  const roster = {
    flightInfo,
    flightCrew: mockCrewData.flightCrew,
    cabinCrew: mockCrewData.cabinCrew,
    passengers,
  }

  return NextResponse.json(roster)
}
