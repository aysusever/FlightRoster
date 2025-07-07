"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plane, CalendarIcon, Clock, MapPin, Search } from "lucide-react"
import { format } from "date-fns"

export default function FlightsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [statusFilter, setStatusFilter] = useState("all")
  const [flightData, setFlightData] = useState<any>(null)

  useEffect(() => {
    // Fetch flight data
    const fetchFlightData = async () => {
      try {
        const response = await fetch("/api/flights")
        const data = await response.json()
        setFlightData(data)
      } catch (error) {
        console.error("Failed to fetch flight data:", error)
      }
    }

    fetchFlightData()
  }, [])

  if (!flightData) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  const filteredFlights = flightData.flights.filter((flight: any) => {
    const matchesSearch =
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.route.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || flight.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Flight Schedule</h1>
          <p className="text-gray-600">View and manage flight schedules</p>
        </div>
        <Button>Add New Flight</Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search flights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Flight Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Flights</p>
                <p className="text-2xl font-bold">{flightData.flights.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">
                  {flightData.flights.filter((f: any) => f.status === "Active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">
                  {flightData.flights.filter((f: any) => f.status === "Scheduled").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Destinations</p>
                <p className="text-2xl font-bold">
                  {new Set(flightData.flights.map((f: any) => f.destination.code)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flights Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Schedule ({filteredFlights.length})
          </CardTitle>
          <CardDescription>Comprehensive flight information and schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight Number</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Aircraft</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlights.map((flight: any) => (
                <TableRow key={flight.flightNumber}>
                  <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{flight.source.code}</span>
                      <Plane className="h-3 w-3 text-gray-400" />
                      <span>{flight.destination.code}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.source.city} → {flight.destination.city}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{flight.date}</div>
                    <div className="text-sm text-gray-600">{flight.time}</div>
                  </TableCell>
                  <TableCell>{flight.duration}</TableCell>
                  <TableCell>{flight.aircraftType}</TableCell>
                  <TableCell>{flight.distance}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        flight.status === "Active"
                          ? "default"
                          : flight.status === "Completed"
                            ? "secondary"
                            : flight.status === "Cancelled"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {flight.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
