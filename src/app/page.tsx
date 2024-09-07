'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Clock, Users, Zap, ChevronDown } from 'lucide-react'
import Footer from '@/components/Footer'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 landing-page">
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8"
        style={{ opacity, scale }}
      >
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Exchange Time,<br />Build Community
        </motion.h1>
        <motion.p 
          className="text-lg sm:text-xl lg:text-2xl text-gray-900 mb-6 sm:mb-8 max-w-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          TaskBuddy connects you with neighbors to exchange help on daily tasks. 
          Save time, make friends, and strengthen your community.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full">
            <Link href="/register">
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-gray-900 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full">
            <Link href="/about">
              Learn More
            </Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900 animate-bounce" />
        </motion.div>
      </motion.div>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Time is Currency", description: "Exchange hours of service instead of money" },
              { icon: Users, title: "Build Connections", description: "Meet and help neighbors in your community" },
              { icon: Zap, title: "Diverse Skills", description: "Find help for any task, big or small" }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-900">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl font-bold mb-6 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Join TaskBuddy Today
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-900 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Start exchanging time and building stronger communities. Sign up now!
          </motion.p>
          <motion.form 
            className="flex flex-col sm:flex-row justify-center max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Input type="email" placeholder="Enter your email" className="rounded-r-none sm:rounded-r-none sm:rounded-l-lg mb-2 sm:mb-0" />
            <Button type="submit" className="rounded-l-none sm:rounded-l-none sm:rounded-r-lg">Get Started</Button>
          </motion.form>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: "Sarah L.", quote: "TaskBuddy has transformed the way I interact with my community. I&apos;ve met amazing people and gotten so much done!", avatar: "SL" },
              { name: "Michael R.", quote: "As a busy professional, TaskBuddy has been a lifesaver. I can get help with tasks and give back when I have time.", avatar: "MR" },
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <p className="text-gray-900 mb-4">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <span className="font-semibold text-gray-900">{testimonial.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}