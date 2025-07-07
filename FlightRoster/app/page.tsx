"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plane, Users, FileText, Download, Search } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [selectedFlight, setSelectedFlight] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Plane className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Flight Roster Management System</h1>
          </div>
          <p className="text-lg text-gray-600">Comprehensive flight crew and passenger management platform</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Flights</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Available Crew</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Generated Rosters</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Exports Today</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flight Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Flight Selection</CardTitle>
                <CardDescription>Select a flight to generate roster</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="flight-number">Flight Number</Label>
                  <Input
                    id="flight-number"
                    placeholder="e.g., TK1234"
                    value={selectedFlight}
                    onChange={(e) => setSelectedFlight(e.target.value)}
                  />
                </div>

                <div className="text-center text-gray-500">or</div>

                <div>
                  <Label htmlFor="search">Search Flights</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search"
                      placeholder="Search by destination, date..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Filter Options</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select aircraft type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boeing-737">Boeing 737</SelectItem>
                      <SelectItem value="airbus-a320">Airbus A320</SelectItem>
                      <SelectItem value="boeing-777">Boeing 777</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Link href="/roster" className="w-full">
                  <Button className="w-full" disabled={!selectedFlight}>
                    Generate Roster
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Flights */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Recent Flights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { number: "TK1234", route: "IST → JFK", status: "Active" },
                    { number: "TK5678", route: "IST → LHR", status: "Completed" },
                    { number: "TK9012", route: "IST → CDG", status: "Scheduled" },
                  ].map((flight) => (
                    <div key={flight.number} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{flight.number}</p>
                        <p className="text-sm text-gray-600">{flight.route}</p>
                      </div>
                      <Badge
                        variant={
                          flight.status === "Active"
                            ? "default"
                            : flight.status === "Completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {flight.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Flight roster management capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="apis">APIs</TabsTrigger>
                    <TabsTrigger value="views">Roster Views</TabsTrigger>
                  </TabsList>

                  <TabsContent value="features" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Crew Management</h3>
                        <p className="text-sm text-gray-600">
                          Automatic and manual crew selection with constraint validation
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Seat Assignment</h3>
                        <p className="text-sm text-gray-600">
                          Intelligent seat allocation for passengers without assigned seats
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Data Integration</h3>
                        <p className="text-sm text-gray-600">
                          Combines data from multiple service providers seamlessly
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Export & Storage</h3>
                        <p className="text-sm text-gray-600">Store rosters locally and export in JSON format</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="apis" className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { name: "Flight Information API", desc: "Flight details, schedules, and aircraft information" },
                        { name: "Flight Crew API", desc: "Pilot information, qualifications, and availability" },
                        { name: "Cabin Crew API", desc: "Flight attendant details and specializations" },
                        { name: "Passenger API", desc: "Passenger manifests and seating preferences" },
                      ].map((api) => (
                        <div key={api.name} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium">{api.name}</h4>
                            <p className="text-sm text-gray-600">{api.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="views" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">📊 Tabular View</h3>
                        <p className="text-sm text-gray-600">
                          Summary table with all personnel information in a structured format
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">✈️ Plane View</h3>
                        <p className="text-sm text-gray-600">
                          Interactive seat plan with hover information for each position
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">📋 Extended View</h3>
                        <p className="text-sm text-gray-600">
                          Detailed tables separated by personnel type with comprehensive information
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Link href="/roster">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">View Rosters</h3>
                    <p className="text-sm text-gray-600">Browse existing flight rosters</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/crew">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">Manage Crew</h3>
                    <p className="text-sm text-gray-600">View and manage crew information</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/flights">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Plane className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold">Flight Schedule</h3>
                    <p className="text-sm text-gray-600">View flight schedules and details</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
