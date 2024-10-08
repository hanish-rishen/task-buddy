"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Task, getTasks, createTask, updateTask, deleteTask, getUserTimeCredits, addInitialCredits } from '@/lib/firestore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Loader2, Star, CheckSquare, ShoppingCart, Scissors, Book, Briefcase, Wrench, Paintbrush } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/AuthContext'
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const [timeCredits, setTimeCredits] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'createdAt' | 'postedBy' | 'status'>>({ 
    title: '', 
    description: '', 
    duration: 0, 
    postedById: '',
    posterEmail: ''
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirmTask, setDeleteConfirmTask] = useState<Task | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          await addInitialCredits(user.uid);
          const credits = await getUserTimeCredits(user.uid);
          setTimeCredits(credits);
          const fetchedTasks = await getTasks(user.uid);
          setTasks(fetchedTasks);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast({
            title: "Error",
            description: "Failed to fetch data. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [user, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewTask(prev => ({ 
      ...prev, 
      [name]: name === 'duration' ? parseInt(value) || 0 : value 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsLoading(true)
    try {
      if (editingTask) {
        await updateTask(editingTask.id, newTask)
      } else {
        console.log("Creating task with:", newTask, user.uid)
        await createTask({ 
          ...newTask, 
          postedById: user.uid,
          postedBy: user.displayName || '',
          posterEmail: user.email || '',
        }, { uid: user.uid, displayName: user.displayName, email: user.email })
      }
      setNewTask({ 
        title: '', 
        description: '', 
        duration: 0, 
        postedById: '',
        posterEmail: ''
      })
      setEditingTask(null)
      setIsDialogOpen(false)
      const updatedTasks = await getTasks(user.uid)
      setTasks(updatedTasks)
      toast({
        title: "Success",
        description: editingTask ? "Task updated successfully" : "Task created successfully",
      })
    } catch (error) {
      console.error("Error creating/updating task:", error)
      toast({
        title: "Error",
        description: "An error occurred while saving the task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setNewTask({ 
      title: task.title, 
      description: task.description, 
      duration: task.duration, 
      postedById: task.postedById,
      posterEmail: task.posterEmail
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id)
      setDeleteConfirmTask(null)
      const updatedTasks = await getTasks(user?.uid || '')
      setTasks(updatedTasks)
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getTaskIcon = (title: string) => {
    const lowercaseTitle = title.toLowerCase()
    if (lowercaseTitle.includes('shopping')) return <ShoppingCart className="h-5 w-5 mr-2 text-blue-500" />
    if (lowercaseTitle.includes('garden') || lowercaseTitle.includes('lawn')) return <Scissors className="h-5 w-5 mr-2 text-green-500" />
    if (lowercaseTitle.includes('study') || lowercaseTitle.includes('homework')) return <Book className="h-5 w-5 mr-2 text-purple-500" />
    if (lowercaseTitle.includes('work') || lowercaseTitle.includes('office')) return <Briefcase className="h-5 w-5 mr-2 text-indigo-500" />
    if (lowercaseTitle.includes('repair') || lowercaseTitle.includes('fix')) return <Wrench className="h-5 w-5 mr-2 text-orange-500" />
    if (lowercaseTitle.includes('paint') || lowercaseTitle.includes('decorate')) return <Paintbrush className="h-5 w-5 mr-2 text-pink-500" />
    return <CheckSquare className="h-5 w-5 mr-2 text-teal-500" />
  }

  console.log("Current user:", user)
  console.log("Current tasks:", tasks)

  return (
    <div className="container mx-auto pt-4 sm:pt-20 px-4">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">TaskBuddy</h1>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Time Credits:</span>
            <Badge variant="secondary" className="text-lg">{timeCredits} minutes</Badge>
          </div>
        </div>
      </header>

      <div className="bg-blue-100 p-4 rounded-lg mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">How Time Credits Work</h2>
        <p className="text-sm sm:text-base">You start with 4 hours of credit. When you take a task, credits are deducted. After completing a task, you earn 1 hour of credit. If you finish early, you keep the difference!</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Post a New Task</CardTitle>
          <CardDescription>Share a task you need help with</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Task Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Describe the task"
                  value={newTask.description}
                  onChange={handleInputChange}
                  required
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  placeholder="Estimated duration in hours"
                  value={newTask.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Task'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <h2 className="text-xl sm:text-2xl font-bold mb-4">Your Tasks</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">You haven&apos;t posted any tasks yet. Create a new task to get started!</p>
        </Card>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {tasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getTaskIcon(task.title)}
                        <CardTitle className="line-clamp-1 text-base sm:text-lg">{task.title}</CardTitle>
                      </div>
                      {task.postedBy === user?.displayName && <Star className="h-5 w-5 text-yellow-400" />}
                    </div>
                    <CardDescription>
                      <p className="text-xs sm:text-sm">Posted by: {task.postedBy}</p>
                      {task.createdAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(task.createdAt.seconds * 1000), { addSuffix: true })}
                        </p>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm sm:text-base">{task.description}</p>
                    <p className="mt-2 text-sm sm:text-base">Duration: {task.duration} hours</p>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
                    <Button variant="outline" onClick={() => handleEdit(task)} className="w-full sm:w-auto">Edit</Button>
                    <Button variant="destructive" onClick={() => setDeleteConfirmTask(task)} className="w-full sm:w-auto">Delete</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Task Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Task Description</Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (hours)</Label>
                <Input
                  id="edit-duration"
                  name="duration"
                  type="number"
                  value={newTask.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Task'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmTask} onOpenChange={() => setDeleteConfirmTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete the task &quot;{deleteConfirmTask?.title}&quot;? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmTask(null)} className="w-full sm:w-auto">Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirmTask && handleDelete(deleteConfirmTask.id)} className="w-full sm:w-auto">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}