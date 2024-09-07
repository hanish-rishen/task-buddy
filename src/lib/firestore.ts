import { Firestore, getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore'
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
  const snapshot = await getDocs(getTasksCollection())
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task))
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