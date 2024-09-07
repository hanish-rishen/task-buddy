import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Join TaskBuddy and start exchanging time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input id="skills" placeholder="Gardening, Cooking, Tutoring" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full">Sign Up</Button>
          <p className="mt-4 text-sm text-center text-gray-500">
            Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Log in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}