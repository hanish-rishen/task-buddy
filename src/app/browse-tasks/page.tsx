"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type Task = {
  id: number
  title: string
  description: string
  duration: number
  postedBy: string
  location: string
}

export default function BrowseTasks() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tasks] = useState<Task[]>([
    { id: 1, title: "Grocery Shopping", description: "Need help with weekly grocery shopping", duration: 1, postedBy: "Alice", location: "Downtown" },
    { id: 2, title: "Garden Maintenance", description: "Help needed to mow lawn and trim hedges", duration: 2, postedBy: "Bob", location: "Suburbs" },
    { id: 3, title: "Dog Walking", description: "Walk my dog for 30 minutes", duration: 0.5, postedBy: "Charlie", location: "Park Area" },
  ])

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto pt-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Browse Tasks</h1>
      <div className="mb-6">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle>{task.title}</CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${task.postedBy}`} />
                    <AvatarFallback>{task.postedBy[0]}</AvatarFallback>
                  </Avatar>
                  <span>{task.postedBy}</span>
                </div>
                <Badge>{task.duration} hour{task.duration > 1 ? 's' : ''}</Badge>
              </div>
              <p className="mt-2 text-sm text-gray-500">{task.location}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}