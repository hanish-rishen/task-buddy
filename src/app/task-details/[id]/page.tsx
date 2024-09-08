"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Task, getTask, takeTask } from '@/lib/firestore'
import { formatDistanceToNow, isValid } from 'date-fns'
import { motion } from 'framer-motion'
import { useAuth } from '@/AuthContext'
import { Loader2, Clock } from 'lucide-react'
import { Timestamp } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

export default function TaskDetails() {
  const { id } = useParams()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true)
      try {
        if (typeof id === 'string') {
          const fetchedTask = await getTask(id)
          setTask(fetchedTask)
        } else {
          throw new Error('Invalid task ID')
        }
      } catch (error) {
        console.error('Error fetching task:', error)
        toast({
          title: "Error",
          description: "Failed to fetch task details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchTask()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="container mx-auto pt-20 px-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Loading task details...</p>
      </div>
    )
  }

  if (!task) {
    return <div className="container mx-auto pt-20 px-4 text-center">Task not found</div>
  }

  const getAvatarSrc = (postedBy: string) => {
    if (user && postedBy === 'You') {
      return user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.displayName || user.email}`
    }
    return `https://api.dicebear.com/6.x/initials/svg?seed=${postedBy}`
  }

  const handleTakeTask = async () => {
    if (!user || !task) return;
    setIsLoading(true)
    try {
      await takeTask(user.uid, task.id, task.duration)
      toast({
        title: "Success",
        description: "Task taken successfully!",
        variant: "default",
      })
      router.push('/my-tasks')
    } catch (error) {
      console.error("Error taking task:", error)
      toast({
        title: "Error",
        description: "Failed to take task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCreatedAt = (createdAt: Timestamp | { seconds: number; nanoseconds: number } | Date | string | null) => {
    if (!createdAt) return 'Recently';
    
    let date: Date;
    if (createdAt instanceof Timestamp) {
      date = createdAt.toDate();
    } else if (createdAt instanceof Date) {
      date = createdAt;
    } else if (typeof createdAt === 'string') {
      date = new Date(createdAt);
    } else if (typeof createdAt === 'object' && 'seconds' in createdAt && 'nanoseconds' in createdAt) {
      date = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000);
    } else {
      return 'Recently';
    }

    return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : 'Recently';
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto pt-20 px-4 max-w-3xl"
    >
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-4"
      >
        {task.title}
      </motion.h1>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center space-x-4 mb-6"
      >
        <Avatar>
          <AvatarImage src={getAvatarSrc(task.postedBy)} />
          <AvatarFallback>{task.postedBy[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{task.postedBy}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <p>{formatCreatedAt(task.createdAt)}</p>
          </div>
        </div>
        <Badge variant="secondary" className="ml-auto">{task.duration} hours</Badge>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="prose max-w-none mb-8"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap">{task.description}</p>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button 
          className="bg-green-500 hover:bg-green-600 transition-colors duration-300"
          onClick={handleTakeTask}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Taking Task...
            </>
          ) : "Take Task"}
        </Button>
      </motion.div>
    </motion.div>
  )
}