import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
}

export default function Messaging() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Alice', content: 'Hi, I saw your gardening task. Can you provide more details?', timestamp: '10:00 AM' },
    { id: 2, sender: 'You', content: 'I need help planting new flowers and trimming the hedges.', timestamp: '10:05 AM' },
    { id: 3, sender: 'Alice', content: 'Sounds good. How big is your garden?', timestamp: '10:10 AM' },
  ])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      setNewMessage('')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/6.x/initials/svg?seed=Alice" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <span>Chat with Alice</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {messages.map((message) => (
              <div key={message.id} className={`mb-4 ${message.sender === 'You' ? 'text-right' : ''}`}>
                <div className={`inline-block p-2 rounded-lg ${message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex mt-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} className="ml-2">Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}