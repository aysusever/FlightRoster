import { type NextRequest, NextResponse } from "next/server"

// Flight Information API - provides detailed flight information
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const flightNumber = searchParams.get("flightNumber")

  // Mock flight database
  const flights = {
    TK1234: {
      flightNumber: "TK1234",
      flightInfo: {
        date: "2024-01-15T14:30:00Z",
        duration: "8h 45m",
        distance: "8000 km",
      },
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
      vehicleType: {
        type: "Boeing 777-300ER",
        seats: 396,
        seatingPlan: "3-4-3",
        standardMenu: ["Turkish Breakfast", "International Cuisine", "Vegetarian Options"],
      },
      sharedFlightInfo: null,
    },
    TK5678: {
      flightNumber: "TK5678",
      flightInfo: {
        date: "2024-01-16T10:15:00Z",
        duration: "4h 20m",
        distance: "2500 km",
      },
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
      vehicleType: {
        type: "Airbus A320",
        seats: 180,
        seatingPlan: "3-3",
        standardMenu: ["Light Meal", "Snacks", "Beverages"],
      },
      sharedFlightInfo: null,
    },
  }

  if (flightNumber && flights[flightNumber as keyof typeof flights]) {
    return NextResponse.json(flights[flightNumber as keyof typeof flights])
  }

  if (!flightNumber) {
    return NextResponse.json(Object.values(flights))
  }

  return NextResponse.json({ error: "Flight not found" }, { status: 404 })
}
