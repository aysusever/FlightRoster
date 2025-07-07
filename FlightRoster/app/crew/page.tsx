"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plane, ChefHat, Search } from "lucide-react"

export default function CrewPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [crewData, setCrewData] = useState<any>(null)

  useEffect(() => {
    // Fetch crew data
    const fetchCrewData = async () => {
      try {
        const response = await fetch("/api/crew")
        const data = await response.json()
        setCrewData(data)
      } catch (error) {
        console.error("Failed to fetch crew data:", error)
      }
    }

    fetchCrewData()
  }, [])

  if (!crewData) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  const filteredFlightCrew = crewData.flightCrew.filter(
    (crew: any) =>
      crew.name.toLowerCase().includes(searchTerm.toLowerCase()) && (filterType === "all" || filterType === "flight"),
  )

  const filteredCabinCrew = crewData.cabinCrew.filter(
    (crew: any) =>
      crew.name.toLowerCase().includes(searchTerm.toLowerCase()) && (filterType === "all" || filterType === "cabin"),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Crew Management</h1>
          <p className="text-gray-600">Manage flight and cabin crew information</p>
        </div>
        <Button>Add New Crew Member</Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search crew members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crew</SelectItem>
                <SelectItem value="flight">Flight Crew</SelectItem>
                <SelectItem value="cabin">Cabin Crew</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Crew Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Flight Crew</p>
                <p className="text-2xl font-bold">{crewData.flightCrew.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Cabin Crew</p>
                <p className="text-2xl font-bold">{crewData.cabinCrew.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Chefs</p>
                <p className="text-2xl font-bold">
                  {crewData.cabinCrew.filter((crew: any) => crew.type === "Chef").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crew Tables */}
      <Tabs defaultValue="flight" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flight">Flight Crew</TabsTrigger>
          <TabsTrigger value="cabin">Cabin Crew</TabsTrigger>
        </TabsList>

        <TabsContent value="flight">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Flight Crew ({filteredFlightCrew.length})
              </CardTitle>
              <CardDescription>Pilots and flight officers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Seniority</TableHead>
                    <TableHead>Aircraft Type</TableHead>
                    <TableHead>Max Range</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFlightCrew.map((crew: any) => (
                    <TableRow key={crew.id}>
                      <TableCell className="font-medium">{crew.name}</TableCell>
                      <TableCell>{crew.age}</TableCell>
                      <TableCell>{crew.nationality}</TableCell>
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
                      <TableCell>{crew.vehicleRestriction}</TableCell>
                      <TableCell>{crew.allowedRange.toLocaleString()} km</TableCell>
                      <TableCell>{crew.languages.join(", ")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          Available
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cabin">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Cabin Crew ({filteredCabinCrew.length})
              </CardTitle>
              <CardDescription>Flight attendants and service staff</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Aircraft Types</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead>Specialties</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCabinCrew.map((crew: any) => (
                    <TableRow key={crew.id}>
                      <TableCell className="font-medium">{crew.name}</TableCell>
                      <TableCell>{crew.age}</TableCell>
                      <TableCell>{crew.nationality}</TableCell>
                      <TableCell>
                        <Badge
                          variant={crew.type === "Chief" ? "default" : crew.type === "Chef" ? "secondary" : "outline"}
                        >
                          {crew.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{crew.vehicleRestrictions.join(", ")}</TableCell>
                      <TableCell>{crew.languages.join(", ")}</TableCell>
                      <TableCell>{crew.recipes?.join(", ") || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          Available
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
