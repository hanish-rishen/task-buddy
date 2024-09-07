import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateTask() {
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Task</CardTitle>
          <CardDescription>Describe the task you need help with</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input id="title" placeholder="Enter a clear title for your task" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Task Description</Label>
            <Textarea id="description" placeholder="Provide details about the task" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Estimated Duration (hours)</Label>
            <Input id="duration" type="number" placeholder="2" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Enter the task location" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Post Task</Button>
        </CardFooter>
      </Card>
    </div>
  )
}