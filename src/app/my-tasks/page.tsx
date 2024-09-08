"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/AuthContext'
import { Task, getUserTasks, completeTask, getUserTimeCredits } from '@/lib/firestore'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from 'date-fns'
import { Loader2, Mail } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const [timeCredits, setTimeCredits] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true)
        try {
          const fetchedTasks = await getUserTasks(user.uid)
          setTasks(fetchedTasks.filter(task => task.status !== 'completed'))
          const credits = await getUserTimeCredits(user.uid)
          setTimeCredits(credits)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchData()
  }, [user])

  const { toast } = useToast()

  const handleCompleteTask = async (taskId: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await completeTask(taskId, user.uid);
      toast({
        title: "Task Completed",
        description: "You've earned 1 hour of time credit!",
        variant: "default",
      });
      // Remove the completed task from the local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      const updatedCredits = await getUserTimeCredits(user.uid);
      setTimeCredits(updatedCredits);
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleContactPoster = (task: Task) => {
    console.log("Task object:", task);
    setSelectedTask(task);
    setIsDialogOpen(true);
    if (!task.posterEmail) {
      console.error("Poster email not available for task:", task);
      toast({
        title: "Warning",
        description: "Poster email might not be available.",
        variant: "destructive",
      });
    }
  }

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
      <p className="mb-4">Your current time credits: {timeCredits} hours</p>
      {tasks.length === 0 ? (
        <p>You haven&apos;t taken any tasks yet.</p>
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
              <CardFooter className="flex flex-col space-y-2">
                <Button variant="outline" className="w-full" onClick={() => window.location.href = `/task-details/${task.id}`}>
                  View Details
                </Button>
                <Button variant="default" className="w-full" onClick={() => handleCompleteTask(task.id)}>
                  Complete Task
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => handleContactPoster(task)}>
                  <Mail className="mr-2 h-4 w-4" /> Contact Poster
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Poster</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Here are the details to contact the task poster:
          </DialogDescription>
          {selectedTask && (
            <div className="py-4">
              <p><strong>Task:</strong> {selectedTask.title}</p>
              <p><strong>Poster:</strong> {selectedTask.postedBy}</p>
              <p><strong>Email:</strong> {selectedTask.posterEmail || 'Not available'}</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}