import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function TaskDetails() {
  const task = {
    id: 1,
    title: "Help with Gardening",
    description: "Need help planting new flowers and trimming hedges in my backyard. Experience with gardening preferred.",
    duration: 3,
    postedBy: "Alice Smith",
    location: "123 Green St, Townsville",
    date: "2023-06-15",
    status: "Open"
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{task.title}</CardTitle>
              <CardDescription>Posted by {task.postedBy}</CardDescription>
            </div>
            <Badge>{task.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{task.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${task.postedBy}`} />
                <AvatarFallback>{task.postedBy[0]}</AvatarFallback>
              </Avatar>
              <span>{task.postedBy}</span>
            </div>
            <Badge variant="secondary">{task.duration} hours</Badge>
          </div>
          <div>
            <p><strong>Location:</strong> {task.location}</p>
            <p><strong>Date:</strong> {task.date}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Ask a Question</Button>
          <Button>Offer Help</Button>
        </CardFooter>
      </Card>
    </div>
  )
}