import { Firestore, getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc, setDoc, query, where, serverTimestamp, FieldValue } from 'firebase/firestore'
import { getApp } from 'firebase/app'

export type Task = {
  id: string
  title: string
  description: string
  duration: number
  postedBy: string
  postedById: string
  createdAt: { seconds: number; nanoseconds: number }
  status: string
  takenBy?: string
}

let db: Firestore

const getDb = (): Firestore => {
  if (!db) {
    db = getFirestore(getApp())
  }
  return db
}

const getTasksCollection = () => collection(getDb(), 'tasks')

export const getTasks = async (userId?: string): Promise<Task[]> => {
  const tasksCollection = collection(getDb(), 'tasks')
  let q = query(tasksCollection)
  if (userId) {
    q = query(tasksCollection, where('postedById', '==', userId))
  }
  const querySnapshot = await getDocs(q)
  const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task))
  console.log(`Fetched ${tasks.length} tasks${userId ? ` for user ${userId}` : ''}:`, tasks)
  return tasks
}

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'postedBy' | 'status'>, user: { uid: string, displayName: string | null }): Promise<Task> => {
  const tasksCollection = collection(getDb(), 'tasks')
  const newTask = {
    ...task,
    postedBy: user.displayName || 'Anonymous',
    postedById: user.uid,
    createdAt: serverTimestamp(),
    status: 'available'
  }
  console.log("Adding new task to Firestore:", newTask)
  const docRef = await addDoc(tasksCollection, newTask)
  console.log("New task added with ID:", docRef.id)
  const createdTask = await getTask(docRef.id)
  if (!createdTask) {
    throw new Error("Failed to retrieve created task")
  }
  return createdTask
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
    const data = taskSnapshot.data()
    return {
      id: taskSnapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date()
    } as Task
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
  const updatedTask = await getTask(taskId)
  if (!updatedTask) {
    throw new Error("Failed to retrieve updated task")
  }
  return updatedTask
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