"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@mui/material/styles"

type Particle = {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const width = window.innerWidth
        const height = window.innerHeight

        // Set display size (css pixels)
        canvas.style.width = width + "px"
        canvas.style.height = height + "px"

        // Set actual size in memory (scaled to account for extra pixel density)
        const scale = window.devicePixelRatio
        canvas.width = Math.floor(width * scale)
        canvas.height = Math.floor(height * scale)

        setDimensions({ width: canvas.width, height: canvas.height })

        // Initialize particles
        initParticles()
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Initialize particles
  const initParticles = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const particles: Particle[] = []
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100)

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    particlesRef.current = particles
  }

  // Animation
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let mouseX = 0
    let mouseY = 0
    const mouseRadius = 100

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX * window.devicePixelRatio
      mouseY = e.clientY * window.devicePixelRatio
    }

    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY
        }

        // Mouse interaction
        const dx = mouseX - particle.x
        const dy = mouseY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouseRadius) {
          const angle = Math.atan2(dy, dx)
          const force = (mouseRadius - distance) / mouseRadius

          particle.speedX -= Math.cos(angle) * force * 0.2
          particle.speedY -= Math.sin(angle) * force * 0.2
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = isDark ? `rgba(80, 205, 185, ${particle.opacity})` : `rgba(16, 163, 127, ${particle.opacity})`
        ctx.fill()

        // Connect particles
        connectParticles(particle, index)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    const connectParticles = (particle: Particle, index: number) => {
      for (let i = index + 1; i < particlesRef.current.length; i++) {
        const otherParticle = particlesRef.current[i]
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          ctx.beginPath()
          ctx.strokeStyle = isDark
            ? `rgba(80, 205, 185, ${0.1 * (1 - distance / 150)})`
            : `rgba(16, 163, 127, ${0.1 * (1 - distance / 150)})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.stroke()
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [dimensions, isDark])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  )
}
