import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function About() {
  const teamMembers = [
    { name: "Hanish", avatar: "H" },
    { name: "Arnav", avatar: "A" },
    { name: "Hemanth", avatar: "H" },
  ]

  return (
    <div className="container mx-auto pt-20 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">About TaskBuddy</h1>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              TaskBuddy aims to build stronger communities by enabling people to exchange time and skills. 
              We believe in the power of mutual support and the idea that everyone has something valuable to offer.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We envision a world where communities are connected, supportive, and resilient. 
              Where people can easily find help for their daily tasks and share their own skills, 
              creating a cycle of reciprocity and strengthening social bonds.
            </p>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-semibold mt-12 mb-6 text-center">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <CardHeader>
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.avatar}`} />
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-center mt-4">{member.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Email us at: <a href="mailto:contact@taskbuddy.com" className="text-blue-500 hover:underline">contact@taskbuddy.com</a><br />
              Or call us at: (123) 456-7890
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}