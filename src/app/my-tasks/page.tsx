"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/AuthContext'
import { Task, getUserTasks } from '@/lib/firestore'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from 'date-fns'
import { Loader2 } from 'lucide-react'

export default function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        setIsLoading(true)
        try {
          const fetchedTasks = await getUserTasks(user.uid)
          setTasks(fetchedTasks)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchTasks()
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto pt-20 px-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Loading your tasks...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto pt-20 px-4">
      <h1 className="text-3xl font-bold mb-8">My Tasks</h1>
      {tasks.length === 0 ? (
        <p>You haven't taken any tasks yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>Posted by: {task.postedBy}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="line-clamp-3">{task.description}</p>
                <p className="mt-2">Duration: {task.duration} hours</p>
                {task.createdAt && (
                  <p className="text-sm text-gray-500 mt-1">
                    Taken {formatDistanceToNow(new Date(task.createdAt.seconds * 1000), { addSuffix: true })}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = `/task-details/${task.id}`}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}