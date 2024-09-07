"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type Task = {
  id: number
  title: string
  description: string
  duration: number
  postedBy: string
}

export default function Dashboard() {
  const [timeBalance] = useState(5) // Initial time balance in hours
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskDuration, setNewTaskDuration] = useState('')
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Grocery Shopping", description: "Need help with weekly grocery shopping", duration: 1, postedBy: "Alice" },
    { id: 2, title: "Garden Maintenance", description: "Help needed to mow lawn and trim hedges", duration: 2, postedBy: "Bob" },
  ])

  const handlePostTask = () => {
    if (newTaskTitle && newTaskDescription && newTaskDuration) {
      const newTask: Task = {
        id: tasks.length + 1,
        title: newTaskTitle,
        description: newTaskDescription,
        duration: parseInt(newTaskDuration),
        postedBy: "You" // In a real app, this would be the current user's name
      }
      setTasks([...tasks, newTask])
      setNewTaskTitle('')
      setNewTaskDescription('')
      setNewTaskDuration('')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">TaskBuddy</h1>
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Time Balance:</span>
          <Badge variant="secondary" className="text-lg">{timeBalance} hours</Badge>
        </div>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Post a New Task</CardTitle>
          <CardDescription>Share a task you need help with</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Task Description</Label>
              <Input
                id="task-description"
                placeholder="Describe the task"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-duration">Duration (hours)</Label>
              <Input
                id="task-duration"
                type="number"
                placeholder="Estimated duration in hours"
                value={newTaskDuration}
                onChange={(e) => setNewTaskDuration(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePostTask}>Post Task</Button>
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Available Tasks</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
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
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Offer Help</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}