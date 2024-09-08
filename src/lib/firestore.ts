import { Firestore, getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc, setDoc, query, where } from 'firebase/firestore'
import { getApp } from 'firebase/app'

export type Task = {
  id: string
  title: string
  description: string
  duration: number
  postedBy: string
  createdAt: { seconds: number; nanoseconds: number }
}

let db: Firestore

const getDb = (): Firestore => {
  if (!db) {
    db = getFirestore(getApp())
  }
  return db
}

const getTasksCollection = () => collection(getDb(), 'tasks')

export const getTasks = async (): Promise<Task[]> => {
  const tasksCollection = collection(getDb(), 'tasks')
  const querySnapshot = await getDocs(tasksCollection)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task))
}

export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<string> => {
  const taskWithTimestamp = { ...task, createdAt: new Date() }
  const docRef = await addDoc(getTasksCollection(), taskWithTimestamp)
  return docRef.id
}

export const updateTask = async (id: string, task: Partial<Task>): Promise<void> => {
  const taskDoc = doc(getDb(), 'tasks', id)
  await updateDoc(taskDoc, task)
}

export const deleteTask = async (id: string): Promise<void> => {
  const taskDoc = doc(getDb(), 'tasks', id)
  await deleteDoc(taskDoc)
}

export const getTask = async (id: string): Promise<Task | null> => {
  const taskDoc = doc(getDb(), 'tasks', id)
  const taskSnapshot = await getDoc(taskDoc)
  if (taskSnapshot.exists()) {
    return { id: taskSnapshot.id, ...taskSnapshot.data() } as Task
  }
  return null
}

export const initializeUserProfile = async (userId: string) => {
  await setDoc(doc(getDb(), 'users', userId), {
    timeCredits: 60 // 60 minutes (1 hour) initial credit
  })
}

export const getUserTimeCredits = async (userId: string): Promise<number> => {
  const userDoc = await getDoc(doc(getDb(), 'users', userId))
  return userDoc.data()?.timeCredits || 0
}

export const updateUserTimeCredits = async (userId: string, newCredits: number) => {
  await updateDoc(doc(getDb(), 'users', userId), {
    timeCredits: newCredits
  })
}

export const takeTask = async (userId: string, taskId: string, taskDuration: number) => {
  const userCredits = await getUserTimeCredits(userId)
  const taskDurationMinutes = taskDuration * 60 // Convert hours to minutes
  if (userCredits < taskDurationMinutes) {
    throw new Error(`Not enough time credits. You need ${taskDurationMinutes} minutes, but you have ${userCredits} minutes.`)
  }
  
  // Deduct credits
  await updateUserTimeCredits(userId, userCredits - taskDurationMinutes)
  
  // Update task status and associate with user
  const taskRef = doc(getDb(), 'tasks', taskId)
  await updateDoc(taskRef, {
    takenBy: userId,
    status: 'taken'
  })

  // Return the updated task
  const updatedTask = await getDoc(taskRef)
  return { id: updatedTask.id, ...updatedTask.data() } as Task
}

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  const tasksCollection = collection(getDb(), 'tasks')
  const q = query(tasksCollection, where('takenBy', '==', userId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task))
}

export const addInitialCredits = async (userId: string) => {
  const userDoc = await getDoc(doc(getDb(), 'users', userId))
  if (!userDoc.exists()) {
    await initializeUserProfile(userId)
  }
}