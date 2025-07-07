import { type NextRequest, NextResponse } from "next/server"

// Passenger API - provides passenger information for flights
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const flightId = searchParams.get("flightId")
  const passengerId = searchParams.get("passengerId")

  // Mock passenger database organized by flight
  const passengersByFlight = {
    TK1234: [
      {
        passengerId: "P001",
        flightId: "TK1234",
        passengerInfo: {
          name: "Robert Johnson",
          age: 35,
          gender: "Male",
          nationality: "American",
          seatType: "business",
        },
        seatNumber: "1A",
      },
      {
        passengerId: "P002",
        flightId: "TK1234",
        passengerInfo: {
          name: "Emily Davis",
          age: 28,
          gender: "Female",
          nationality: "British",
          seatType: "economy",
        },
        seatNumber: "12F",
      },
      {
        passengerId: "P003",
        flightId: "TK1234",
        passengerInfo: {
          name: "Michael Brown",
          age: 42,
          gender: "Male",
          nationality: "Canadian",
          seatType: "business",
        },
        seatNumber: "2C",
      },
      {
        passengerId: "P004",
        flightId: "TK1234",
        passengerInfo: {
          name: "Baby Emma Brown",
          age: 1,
          gender: "Female",
          nationality: "Canadian",
          seatType: "infant",
        },
        parentId: "P003",
      },
      {
        passengerId: "P005",
        flightId: "TK1234",
        passengerInfo: {
          name: "Anna Wilson",
          age: 31,
          gender: "Female",
          nationality: "German",
          seatType: "economy",
        },
        affiliatedPassengers: ["P006"],
      },
      {
        passengerId: "P006",
        flightId: "TK1234",
        passengerInfo: {
          name: "Thomas Wilson",
          age: 33,
          gender: "Male",
          nationality: "German",
          seatType: "economy",
        },
        affiliatedPassengers: ["P005"],
      },
    ],
    TK5678: [
      {
        passengerId: "P101",
        flightId: "TK5678",
        passengerInfo: {
          name: "James Smith",
          age: 45,
          gender: "Male",
          nationality: "British",
          seatType: "business",
        },
        seatNumber: "1B",
      },
      {
        passengerId: "P102",
        flightId: "TK5678",
        passengerInfo: {
          name: "Sophie Martin",
          age: 29,
          gender: "Female",
          nationality: "French",
          seatType: "economy",
        },
        seatNumber: "15A",
      },
    ],
  }

  if (passengerId) {
    // Find passenger across all flights
    for (const passengers of Object.values(passengersByFlight)) {
      const passenger = passengers.find((p) => p.passengerId === passengerId)
      if (passenger) {
        return NextResponse.json(passenger)
      }
    }
    return NextResponse.json({ error: "Passenger not found" }, { status: 404 })
  }

  if (flightId) {
    const passengers = passengersByFlight[flightId as keyof typeof passengersByFlight]
    return passengers ? NextResponse.json(passengers) : NextResponse.json([])
  }

  // Return all passengers
  const allPassengers = Object.values(passengersByFlight).flat()
  return NextResponse.json(allPassengers)
}
