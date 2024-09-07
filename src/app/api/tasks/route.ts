import { NextResponse } from 'next/server'

// Temporary in-memory storage (replace with database in production)
let tasks = [
  { id: 1, title: "Grocery Shopping", description: "Need help with weekly grocery shopping", duration: 1, postedBy: "Alice" },
  { id: 2, title: "Garden Maintenance", description: "Help needed to mow lawn and trim hedges", duration: 2, postedBy: "Bob" },
]

export async function GET() {
  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const task = await request.json()
  task.id = tasks.length + 1
  task.postedBy = "You" // In a real app, this would be the current user's name
  tasks.push(task)
  return NextResponse.json(task, { status: 201 })
}

export async function PUT(request: Request) {
  const { id, ...updatedTask } = await request.json()
  tasks = tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task)
  return NextResponse.json({ message: 'Task updated successfully' })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  tasks = tasks.filter(task => task.id !== id)
  return NextResponse.json({ message: 'Task deleted successfully' })
}