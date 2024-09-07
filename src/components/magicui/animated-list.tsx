"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

interface Item {
  name: string;
  description: string;
  color: string;
  time: string;
}

const notifications: Item[] = [
  {
    name: "Sarah Johnson",
    description: "Needs help with gardening",
    time: "15m ago",
    color: "#00C9A7",
  },
  {
    name: "Michael Chen",
    description: "Looking for a math tutor",
    time: "10m ago",
    color: "#FFB800",
  },
  {
    name: "Emily Rodriguez",
    description: "Wants to learn guitar",
    time: "5m ago",
    color: "#FF3D71",
  },
  {
    name: "David Kim",
    description: "Needs help moving furniture",
    time: "2m ago",
    color: "#1E86FF",
  },
];

const Notification = ({ name, description, color, time }: Item) => {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: color,
          }}
        />
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </motion.figure>
  );
};

export function AnimatedList({
  className,
}: {
  className?: string;
}) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleItems((prev) => {
        const newItems = [...prev, currentIndex];
        if (newItems.length > 3) {
          return newItems.slice(1);
        }
        return newItems;
      });
      setCurrentIndex((prevIndex) => (prevIndex + 1) % notifications.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div
      className={cn(
        "relative flex h-[300px] w-full flex-col p-6 overflow-hidden rounded-lg border bg-background md:shadow-xl",
        className
      )}
    >
      <div className="flex flex-col space-y-4">
        <AnimatePresence initial={false}>
          {visibleItems.map((index, i) => (
            <motion.div
              key={`${index}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Notification {...notifications[index]} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
