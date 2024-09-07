'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Clock, X, Menu } from 'lucide-react'
import { useAuth } from '@/AuthContext'
import { logoutUser } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Browse Tasks', href: '/browse-tasks' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const authenticatedNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Browse Tasks', href: '/browse-tasks' },
    { name: 'Dashboard', href: '/dashboard' },
  ]

  const currentNavItems = user ? authenticatedNavItems : navItems

  return (
    <nav className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-2xl font-bold text-gray-900">TaskBuddy</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {currentNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                <Badge variant="secondary" className="mr-4 py-1 px-3 flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.displayName}`} />
                    <AvatarFallback>{user.displayName ? user.displayName[0] : 'U'}</AvatarFallback>
                  </Avatar>
                  <span>{user.displayName}</span>
                </Badge>
                <Button onClick={handleLogout} variant="outline" className="bg-gray-100">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="mr-4 bg-gray-100">
                  <Link className="text-gray-900" href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="sm:hidden fixed inset-0 z-40 bg-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="pt-2 pb-3 space-y-1">
              {currentNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    pathname === item.href
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex flex-col items-center px-4 space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center w-full">
                      <Avatar className="mr-3">
                        <AvatarImage src={user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.displayName}`} />
                        <AvatarFallback>{user.displayName ? user.displayName[0] : 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="text-gray-900 truncate flex-1">Welcome, {user.displayName}</span>
                    </div>
                    <Button onClick={() => { handleLogout(); setIsOpen(false); }} variant="outline" className="w-full justify-center bg-gray-100">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full justify-center bg-gray-100" onClick={() => setIsOpen(false)}>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="w-full justify-center" onClick={() => setIsOpen(false)}>
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}