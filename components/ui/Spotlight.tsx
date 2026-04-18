'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

type SpotlightProps = {
  className?: string
  size?: number
}

export function Spotlight({ className = '', size = 400 }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null)

  const mouseX = useSpring(0, { bounce: 0 })
  const mouseY = useSpring(0, { bounce: 0 })

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`)
  const spotlightTop  = useTransform(mouseY, (y) => `${y - size / 2}px`)

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement
      if (parent) {
        parent.style.position = 'relative'
        setParentElement(parent)
      }
    }
  }, [])

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return
      const { left, top } = parentElement.getBoundingClientRect()
      mouseX.set(event.clientX - left)
      mouseY.set(event.clientY - top)
    },
    [mouseX, mouseY, parentElement]
  )

  useEffect(() => {
    if (!parentElement) return
    const onEnter = () => setIsHovered(true)
    const onLeave = () => setIsHovered(false)
    parentElement.addEventListener('mousemove', handleMouseMove)
    parentElement.addEventListener('mouseenter', onEnter)
    parentElement.addEventListener('mouseleave', onLeave)
    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove)
      parentElement.removeEventListener('mouseenter', onEnter)
      parentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [parentElement, handleMouseMove])

  return (
    <motion.div
      ref={containerRef}
      className={`pointer-events-none absolute rounded-full blur-2xl transition-opacity duration-300 ${className}`}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
        background: 'radial-gradient(circle at center, rgba(255,179,122,0.25) 0%, transparent 70%)',
        opacity: isHovered ? 1 : 0,
      }}
    />
  )
}
