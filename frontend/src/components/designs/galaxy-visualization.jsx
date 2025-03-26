"use client"

import { useEffect, useRef } from "react"

export default function GalaxyVisualization() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // For high-resolution displays
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.width * dpr
      canvas.height = canvas.height * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Stars
    const stars = []
    const starCount = Math.floor((canvas.width * canvas.height) / 10000) // Adjust density based on screen size

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * 0.1,
        pulseFactor: Math.random() * 0.1,
      })
    }

    // Nebula clouds
    const nebulae = []
    const nebulaCount = 5

    for (let i = 0; i < nebulaCount; i++) {
      nebulae.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 300 + 100,
        color:
          i % 2 === 0
            ? `rgba(139, 92, 246, ${Math.random() * 0.05 + 0.02})`
            : // Purple
              `rgba(192, 132, 252, ${Math.random() * 0.05 + 0.02})`, // Lighter purple
        speed: Math.random() * 0.2 - 0.1,
      })
    }

    // Dust particles
    const particles = []
    const particleCount = 100

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        color: `rgba(255, 255, 255, ${Math.random() * 0.2})`,
        speed: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2,
      })
    }

    // Shooting stars
    const shootingStars = []
    const maxShootingStars = 2

    const createShootingStar = () => {
      if (shootingStars.length < maxShootingStars && Math.random() < 0.005) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height / 3),
          length: Math.random() * 80 + 50,
          speed: Math.random() * 10 + 10,
          angle: Math.PI / 4 + (Math.random() * Math.PI) / 4,
          opacity: 1,
        })
      }
    }

    // Animation loop
    let animationFrameId
    let frameCount = 0

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frameCount++

      // Draw nebulae
      nebulae.forEach((nebula) => {
        // Move nebulae slowly
        nebula.x += nebula.speed
        if (nebula.x > canvas.width + nebula.radius) nebula.x = -nebula.radius
        if (nebula.x < -nebula.radius) nebula.x = canvas.width + nebula.radius

        // Draw nebula
        const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius)
        gradient.addColorStop(0, nebula.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw stars
      stars.forEach((star) => {
        // Pulsing effect
        star.opacity += Math.sin(frameCount * 0.05 + star.pulse) * star.pulseFactor
        star.opacity = Math.max(0.2, Math.min(1, star.opacity))

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()

        // Add subtle glow to some stars
        if (star.radius > 1) {
          ctx.shadowColor = "rgba(255, 255, 255, 0.5)"
          ctx.shadowBlur = 5
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Draw dust particles
      particles.forEach((particle) => {
        // Move particles
        particle.x += Math.cos(particle.angle) * particle.speed
        particle.y += Math.sin(particle.angle) * particle.speed

        // Wrap around screen
        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        // Occasionally change direction slightly
        if (Math.random() < 0.01) {
          particle.angle += (Math.random() - 0.5) * 0.2
        }

        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Create and draw shooting stars
      createShootingStar()

      shootingStars.forEach((star, index) => {
        star.x += Math.cos(star.angle) * star.speed
        star.y += Math.sin(star.angle) * star.speed
        star.opacity -= 0.01

        if (star.opacity <= 0) {
          shootingStars.splice(index, 1)
          return
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(star.x - Math.cos(star.angle) * star.length, star.y - Math.sin(star.angle) * star.length)
        ctx.stroke()

        // Add glow effect
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)"
        ctx.shadowBlur = 10
        ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity * 0.5})`
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(
          star.x - Math.cos(star.angle) * (star.length * 0.7),
          star.y - Math.sin(star.angle) * (star.length * 0.7),
        )
        ctx.stroke()
        ctx.shadowBlur = 0
      })

      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-70" />
}

