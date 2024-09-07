'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Clock, Users, Zap } from 'lucide-react'
import Footer from '@/components/Footer'
import Marquee from '@/components/magicui/marquee'
import { BentoGrid, BentoCard } from '@/components/magicui/bento-grid'
import AnimatedGradientText from '@/components/magicui/animated-gradient-text'
import ShinyButton from '@/components/magicui/shiny-button'
import  AnimatedGridPattern  from '@/components/magicui/animated-grid-pattern'
import Image from 'next/image'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const features = [
    {
      Icon: Clock,
      name: "Time is Currency",
      description: "Exchange hours of service instead of money",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-1",
      background: (
        <Image
          src="https://images.unsplash.com/photo-1501139083538-0139583c060f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
          alt="Time is Currency"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
      ),
    },
    {
      Icon: Users,
      name: "Build Connections",
      description: "Meet and help neighbors in your community",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-2",
      background: (
        <Image
          src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
          alt="Build Connections"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
      ),
    },
    {
      Icon: Zap,
      name: "Diverse Skills",
      description: "Find help for any task, big or small",
      href: "#",
      cta: "Learn more",
      className: "col-span-3",
      background: (
        <Image
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
          alt="Diverse Skills"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 landing-page overflow-x-hidden">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
      />
      
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <AnimatedGradientText className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6">
          Exchange Time,<br />Build Community
        </AnimatedGradientText>
        <motion.p 
          className="text-lg sm:text-xl lg:text-2xl text-gray-900 mb-6 sm:mb-8 max-w-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          TaskBuddy connects you with neighbors to exchange help on daily tasks. 
          Save time, make friends, and strengthen your community.
        </motion.p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <ShinyButton>
            <Link href="/register" className="flex items-center">
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </ShinyButton>
          <Button asChild size="lg" variant="outline" className="text-gray-900">
            <Link href="/about">
              Learn More
            </Link>
          </Button>
        </div>
      </section>

      <Marquee className="py-4 bg-blue-100">
        {['Time Banking', 'Community Building', 'Skill Sharing', 'Mutual Aid', 'Neighborhood Support'].map((item) => (
          <div key={item} className="mx-4 text-xl font-semibold">{item}</div>
        ))}
      </Marquee>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
          <BentoGrid>
            {features.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
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
            <ShinyButton text="Get Started" className="rounded-lg sm:rounded-l-none sm:rounded-r-lg whitespace-nowrap" />
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  )
}