'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Clock } from 'lucide-react'
import { useAuth } from '@/AuthContext'
import { logoutUser } from '@/lib/auth'

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

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-2xl font-bold text-gray-900">TaskBuddy</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
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
                <span className="mr-4 text-gray-900">Welcome, {user.displayName}</span>
                <Button onClick={handleLogout} variant="outline" className="mr-4 bg-gray-100">
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
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <motion.div 
        className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={false}
        animate={isOpen ? { height: 'auto' } : { height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === item.href
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            {user ? (
              <>
                <span className="mr-4 text-gray-900">Welcome, {user.displayName}</span>
                <Button onClick={handleLogout} variant="ghost" className="mr-4 w-full justify-center">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="mr-4 w-full justify-center">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="w-full justify-center">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </nav>
  )
}