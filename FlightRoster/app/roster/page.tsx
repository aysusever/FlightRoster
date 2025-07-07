"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Download, Plane, Users, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FlightRoster {
  flightInfo: {
    flightNumber: string
    date: string
    duration: string
    distance: string
    source: {
      country: string
      city: string
      airport: string
      code: string
    }
    destination: {
      country: string
      city: string
      airport: string
      code: string
    }
    aircraftType: string
    totalSeats: number
  }
  flightCrew: Array<{
    id: string
    name: string
    age: number
    gender: string
    nationality: string
    languages: string[]
    seniority: string
    vehicleRestriction: string
    allowedRange: number
    position: string
  }>
  cabinCrew: Array<{
    id: string
    name: string
    age: number
    gender: string
    nationality: string
    languages: string[]
    type: string
    vehicleRestrictions: string[]
    recipes?: string[]
    position: string
  }>
  passengers: Array<{
    id: string
    name: string
    age: number
    gender: string
    nationality: string
    seatType: string
    seatNumber?: string
    parentId?: string
    affiliatedPassengers?: string[]
  }>
}

export default function RosterPage() {
  const [selectedFlight, setSelectedFlight] = useState("TK1234")
  const [roster, setRoster] = useState<FlightRoster | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState("tabular")
  const { toast } = useToast()

  const generateRoster = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/roster/generate?flightNumber=${selectedFlight}`)
      const data = await response.json()
      setRoster(data)
      toast({
        title: "Roster Generated",
        description: `Flight roster for ${selectedFlight} has been generated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate roster. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportRoster = () => {
    if (!roster) return

    const dataStr = JSON.stringify(roster, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `roster_${selectedFlight}_${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Export Complete",
      description: "Roster has been exported as JSON file.",
    })
  }

  useEffect(() => {
    if (selectedFlight) {
      generateRoster()
    }
  }, [selectedFlight])

  const renderSeatPlan = () => {
    if (!roster) return null

    const { totalSeats } = roster.flightInfo
    const seatsPerRow = 6 // Assuming 3-3 configuration
    const rows = Math.ceil(totalSeats / seatsPerRow)

    // Create seat map
    const seatMap: { [key: string]: any } = {}

    // Add crew positions
    roster.flightCrew.forEach((crew, index) => {
      seatMap[`cockpit-${index}`] = { ...crew, type: "flight-crew" }
    })

    roster.cabinCrew.forEach((crew, index) => {
      seatMap[`crew-${index}`] = { ...crew, type: "cabin-crew" }
    })

    // Add passengers
    roster.passengers.forEach((passenger) => {
      if (passenger.seatNumber) {
        seatMap[passenger.seatNumber] = { ...passenger, type: "passenger" }
      }
    })

    return (
      <div className="space-y-6">
        {/* Cockpit */}
        <div className="border rounded-lg p-4 bg-blue-50">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Cockpit
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {roster.flightCrew.map((crew, index) => (
              <div
                key={crew.id}
                className="p-2 bg-blue-100 rounded border text-center cursor-pointer hover:bg-blue-200 transition-colors"
                title={`${crew.name} - ${crew.seniority} Pilot`}
              >
                <div className="text-xs font-medium">{crew.name}</div>
                <div className="text-xs text-gray-600">{crew.seniority}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cabin Crew Stations */}
        <div className="border rounded-lg p-4 bg-green-50">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Cabin Crew Stations
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {roster.cabinCrew.map((crew, index) => (
              <div
                key={crew.id}
                className="p-2 bg-green-100 rounded border text-center cursor-pointer hover:bg-green-200 transition-colors"
                title={`${crew.name} - ${crew.type}`}
              >
                <div className="text-xs font-medium">{crew.name}</div>
                <div className="text-xs text-gray-600">{crew.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Passenger Cabin */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Passenger Cabin
          </h3>
          <div className="space-y-2">
            {Array.from({ length: rows }, (_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1">
                <div className="text-xs text-gray-500 w-6 text-center">{rowIndex + 1}</div>
                {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                  const seatNumber = `${rowIndex + 1}${String.fromCharCode(65 + seatIndex)}`
                  const occupant = seatMap[seatNumber]

                  return (
                    <div
                      key={seatIndex}
                      className={`w-8 h-8 border rounded text-xs flex items-center justify-center cursor-pointer transition-colors ${
                        occupant
                          ? occupant.seatType === "business"
                            ? "bg-purple-100 hover:bg-purple-200"
                            : "bg-gray-100 hover:bg-gray-200"
                          : "bg-white hover:bg-gray-50"
                      } ${seatIndex === 2 ? "mr-4" : ""}`}
                      title={occupant ? `${occupant.name} - ${occupant.seatType}` : `Seat ${seatNumber} - Available`}
                    >
                      {occupant
                        ? occupant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : seatNumber}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Flight Roster</h1>
          <p className="text-gray-600">Generate and view comprehensive flight rosters</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedFlight} onValueChange={setSelectedFlight}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select flight" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TK1234">TK1234 - IST → JFK</SelectItem>
              <SelectItem value="TK5678">TK5678 - IST → LHR</SelectItem>
              <SelectItem value="TK9012">TK9012 - IST → CDG</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateRoster} disabled={loading}>
            {loading ? "Generating..." : "Generate Roster"}
          </Button>
          <Button variant="outline" onClick={exportRoster} disabled={!roster}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {roster && (
        <div className="space-y-6">
          {/* Flight Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Flight Information - {roster.flightInfo.flightNumber}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Route</Label>
                  <p className="font-medium">
                    {roster.flightInfo.source.code} → {roster.flightInfo.destination.code}
                  </p>
                  <p className="text-sm text-gray-600">
                    {roster.flightInfo.source.city} to {roster.flightInfo.destination.city}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date & Duration</Label>
                  <p className="font-medium">{roster.flightInfo.date}</p>
                  <p className="text-sm text-gray-600">{roster.flightInfo.duration}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Aircraft</Label>
                  <p className="font-medium">{roster.flightInfo.aircraftType}</p>
                  <p className="text-sm text-gray-600">{roster.flightInfo.totalSeats} seats</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Distance</Label>
                  <p className="font-medium">{roster.flightInfo.distance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roster Views */}
          <Card>
            <CardHeader>
              <CardTitle>Roster Views</CardTitle>
              <CardDescription>Choose how to view the flight roster information</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeView} onValueChange={setActiveView}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tabular">Tabular View</TabsTrigger>
                  <TabsTrigger value="plane">Plane View</TabsTrigger>
                  <TabsTrigger value="extended">Extended View</TabsTrigger>
                </TabsList>

                <TabsContent value="tabular" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Position/Seat</TableHead>
                        <TableHead>Nationality</TableHead>
                        <TableHead>Additional Info</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roster.flightCrew.map((crew) => (
                        <TableRow key={crew.id}>
                          <TableCell className="font-medium">{crew.name}</TableCell>
                          <TableCell>{crew.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Flight Crew</Badge>
                          </TableCell>
                          <TableCell>{crew.position}</TableCell>
                          <TableCell>{crew.nationality}</TableCell>
                          <TableCell>{crew.seniority} Pilot</TableCell>
                        </TableRow>
                      ))}
                      {roster.cabinCrew.map((crew) => (
                        <TableRow key={crew.id}>
                          <TableCell className="font-medium">{crew.name}</TableCell>
                          <TableCell>{crew.id}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Cabin Crew</Badge>
                          </TableCell>
                          <TableCell>{crew.position}</TableCell>
                          <TableCell>{crew.nationality}</TableCell>
                          <TableCell>{crew.type}</TableCell>
                        </TableRow>
                      ))}
                      {roster.passengers.map((passenger) => (
                        <TableRow key={passenger.id}>
                          <TableCell className="font-medium">{passenger.name}</TableCell>
                          <TableCell>{passenger.id}</TableCell>
                          <TableCell>
                            <Badge>Passenger</Badge>
                          </TableCell>
                          <TableCell>{passenger.seatNumber || "Unassigned"}</TableCell>
                          <TableCell>{passenger.nationality}</TableCell>
                          <TableCell>{passenger.seatType}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="plane" className="space-y-4">
                  {renderSeatPlan()}
                </TabsContent>

                <TabsContent value="extended" className="space-y-6">
                  {/* Flight Crew Table */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Plane className="h-5 w-5" />
                      Flight Crew ({roster.flightCrew.length})
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Seniority</TableHead>
                          <TableHead>Languages</TableHead>
                          <TableHead>Vehicle Restriction</TableHead>
                          <TableHead>Max Range</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {roster.flightCrew.map((crew) => (
                          <TableRow key={crew.id}>
                            <TableCell className="font-medium">{crew.name}</TableCell>
                            <TableCell>{crew.age}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  crew.seniority === "Senior"
                                    ? "default"
                                    : crew.seniority === "Junior"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {crew.seniority}
                              </Badge>
                            </TableCell>
                            <TableCell>{crew.languages.join(", ")}</TableCell>
                            <TableCell>{crew.vehicleRestriction}</TableCell>
                            <TableCell>{crew.allowedRange} km</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Separator />

                  {/* Cabin Crew Table */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Cabin Crew ({roster.cabinCrew.length})
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Languages</TableHead>
                          <TableHead>Vehicle Restrictions</TableHead>
                          <TableHead>Specialties</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {roster.cabinCrew.map((crew) => (
                          <TableRow key={crew.id}>
                            <TableCell className="font-medium">{crew.name}</TableCell>
                            <TableCell>{crew.age}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  crew.type === "Chief" ? "default" : crew.type === "Chef" ? "secondary" : "outline"
                                }
                              >
                                {crew.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{crew.languages.join(", ")}</TableCell>
                            <TableCell>{crew.vehicleRestrictions.join(", ")}</TableCell>
                            <TableCell>{crew.recipes?.join(", ") || "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Separator />

                  {/* Passengers Table */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Passengers ({roster.passengers.length})
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Seat Number</TableHead>
                          <TableHead>Seat Type</TableHead>
                          <TableHead>Nationality</TableHead>
                          <TableHead>Special Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {roster.passengers.map((passenger) => (
                          <TableRow key={passenger.id}>
                            <TableCell className="font-medium">{passenger.name}</TableCell>
                            <TableCell>{passenger.age}</TableCell>
                            <TableCell>{passenger.seatNumber || "Unassigned"}</TableCell>
                            <TableCell>
                              <Badge variant={passenger.seatType === "business" ? "default" : "secondary"}>
                                {passenger.seatType}
                              </Badge>
                            </TableCell>
                            <TableCell>{passenger.nationality}</TableCell>
                            <TableCell>
                              {passenger.age <= 2 ? "Infant" : passenger.parentId ? "With Parent" : "Regular"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
