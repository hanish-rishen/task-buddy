"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Task as FirestoreTask, getTasks } from '@/lib/firestore'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/AuthContext'
import { motion } from 'framer-motion'
import { Loader2, Clock, Calendar, Tag } from 'lucide-react'

type Task = FirestoreTask & {
  location?: string
}

export default function BrowseTasks() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

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
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAvatarSrc = (postedBy: string) => {
    if (user && postedBy === 'You') {
      return user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.displayName || user.email}`
    }
    return `https://api.dicebear.com/6.x/initials/svg?seed=${postedBy}`
  }

  return (
    <div className="container mx-auto pt-20 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Browse Tasks</h1>
      <div className="mb-8">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md mx-auto"
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-xl text-gray-500 ml-2">Loading tasks...</p>
        </div>
      ) : (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
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
                  <CardTitle className="text-xl font-semibold line-clamp-1 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{task.title}</span>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 line-clamp-2">
                    {task.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-col space-y-2 mt-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={getAvatarSrc(task.postedBy)} alt={task.postedBy} />
                        <AvatarFallback>{task.postedBy[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{task.postedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{task.duration} hour{task.duration > 1 ? 's' : ''}</span>
                    </div>
                    {task.createdAt && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{formatDistanceToNow(new Date(task.createdAt.seconds * 1000), { addSuffix: true })}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = `/task-details/${task.id}`}>View Details</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold break-words">{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-gray-700 whitespace-pre-wrap break-words">{selectedTask?.description}</p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>Posted by:</strong> {selectedTask?.postedBy}</p>
              <p><strong>Duration:</strong> {selectedTask?.duration} hours</p>
              {selectedTask?.createdAt && (
                <p><strong>Posted:</strong> {formatDistanceToNow(new Date(selectedTask.createdAt.seconds * 1000), { addSuffix: true })}</p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button onClick={() => setSelectedTask(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}