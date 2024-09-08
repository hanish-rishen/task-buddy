"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Task as FirestoreTask, getTasks, takeTask } from '@/lib/firestore'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/AuthContext'
import { motion } from 'framer-motion'
import { Loader2, Clock, Calendar, Tag } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import ShinyButton from '@/components/magicui/shiny-button'

type Task = FirestoreTask & {
  location?: string
  status: 'available' | 'taken'
}

export default function BrowseTasks() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      try {
        const fetchedTasks = await getTasks()
        setTasks(fetchedTasks as Task[])
      } finally {
        setIsLoading(false)
      }
    }
    fetchTasks()
  }, [])

  const filteredTasks = tasks.filter(task => 
    task.status !== 'taken' &&
    (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getAvatarSrc = (postedBy: string, postedById: string) => {
    if (user && user.uid === postedById) {
      return user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.displayName || user.email}`
    }
    return `https://api.dicebear.com/6.x/initials/svg?seed=${postedBy}`
  }

  const handleTakeTask = async (task: Task) => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("You must be logged in to take a task.");
      }
      await takeTask(user.uid, task.id, task.duration);
      toast({
        title: "Task Taken",
        description: "You have successfully taken the task.",
        variant: "default",
        className: "bg-green-500 text-white",
      });
      // Refresh tasks after taking one
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks as Task[]);
    } catch (error) {
      console.error("Error taking task:", error);
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unknown error occurred while taking the task.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto pt-16 px-4 sm:pt-20 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Browse Tasks</h1>
      <div className="mb-6 sm:mb-8">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-full sm:max-w-md mx-auto"
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-lg sm:text-xl text-gray-500 ml-2">Loading tasks...</p>
        </div>
      ) : (
        <motion.div 
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg sm:text-xl font-semibold line-clamp-1 flex items-center">
                    <Tag className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{task.title}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {task.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-col space-y-2 mt-3 sm:mt-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarImage src={getAvatarSrc(task.postedBy, task.postedById)} alt={task.postedBy} />
                        <AvatarFallback>{task.postedBy[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs sm:text-sm font-medium">{task.postedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      <span className="text-xs sm:text-sm">{task.duration} hour{task.duration > 1 ? 's' : ''}</span>
                    </div>
                    {task.createdAt && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                        <span className="text-xs sm:text-sm">{formatDistanceToNow(new Date(task.createdAt.seconds * 1000), { addSuffix: true })}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    className="w-1/2 text-xs sm:text-sm mr-2" 
                    onClick={() => window.location.href = `/task-details/${task.id}`}
                  >
                    View Details
                  </Button>
                  <ShinyButton
                    onClick={() => handleTakeTask(task)}
                    text={isLoading ? "Taking..." : "Take Task"}
                    className="bg-green-300 w-1/2 text-xs sm:text-sm"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  </ShinyButton>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold break-words">{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">{selectedTask?.description}</p>
            <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
              <p className="text-sm sm:text-base"><strong>Posted by:</strong> {selectedTask?.postedBy}</p>
              <p className="text-sm sm:text-base"><strong>Duration:</strong> {selectedTask?.duration} hours</p>
              {selectedTask?.createdAt && (
                <p className="text-sm sm:text-base"><strong>Posted:</strong> {formatDistanceToNow(new Date(selectedTask.createdAt.seconds * 1000), { addSuffix: true })}</p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4 sm:mt-6">
            <Button onClick={() => setSelectedTask(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}