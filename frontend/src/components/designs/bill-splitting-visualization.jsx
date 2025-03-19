"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function BillSplittingVisualization() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    // For high-resolution displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Animation variables
    let animationFrameId
    let frameCount = 0
    let animationStage = 0
    let stageProgress = 0
    let fadeInOpacity = 0 // New variable for fade-in effect

    // Define CliquePay brand colors
    const brandPurple = "#8b5cf6"
    const darkPurple = "#6d28d9"

    // Friends data - adjust the payment amounts to total $96 exactly
    const friends = [
      { name: "Alex", color: "#9333EA", position: 0, paid: false, amount: "$25", icon: "🍕" },
      { name: "You", color: "#4F46E5", position: 1, paid: true, amount: "$24", totalPaid: true, icon: "💰" },
      { name: "Taylor", color: "#EC4899", position: 2, paid: false, amount: "$24", icon: "🍷" },
      { name: "Jordan", color: "#10B981", position: 3, paid: false, amount: "$47", icon: "🍝" },
    ]

    // Money particles for animations
    const moneyParticles = []

    // Keep track of your balance as it increases
    let currentBalance = 0
    // const targetBalance = 96 // Starting with what you paid

    // Update the drawPhone function to create a more generic smartphone appearance
    const drawPhone = () => {
      // Simple subtle shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 15
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 5

      // Phone frame - clean rectangle with rounded corners
      ctx.beginPath()
      ctx.roundRect(width * 0.1, height * 0.05, width * 0.8, height * 0.9, 20)
      
      // Simple phone body color - clean dark gray
      ctx.fillStyle = "#222222"
      ctx.fill()
      
      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // Thin silver edge
      ctx.strokeStyle = "rgba(200, 200, 200, 0.5)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(width * 0.1, height * 0.05, width * 0.8, height * 0.9, 20)
      ctx.stroke()

      // Clean screen with thin bezels
      ctx.fillStyle = "#111111"
      ctx.beginPath()
      ctx.roundRect(width * 0.11, height * 0.07, width * 0.78, height * 0.86, 15)
      ctx.fill()

      // Minimal status bar
      ctx.fillStyle = "#111111"
      ctx.beginPath()
      ctx.rect(width * 0.11, height * 0.07, width * 0.78, height * 0.03)
      ctx.fill()

      // Simple punch-hole camera
      ctx.fillStyle = "#000000"
      ctx.beginPath()
      ctx.arc(width * 0.5, height * 0.085, width * 0.01, 0, Math.PI * 2)
      ctx.fill()

      // Camera lens reflection
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.beginPath()
      ctx.arc(width * 0.498, height * 0.083, width * 0.003, 0, Math.PI * 2)
      ctx.fill()

      // Subtle home indicator
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
      ctx.beginPath()
      ctx.roundRect(width * 0.4, height * 0.91, width * 0.2, height * 0.003, 1.5)
      ctx.fill()
    }

    // Draw CliquePay app interface
    const drawAppInterface = () => {
      // App header bar with gradient
      const headerGradient = ctx.createLinearGradient(
        width * 0.12,
        height * 0.1,
        width * 0.88,
        height * 0.1 + height * 0.07,
      )
      headerGradient.addColorStop(0, "rgba(109, 40, 217, 0.8)") // Dark purple
      headerGradient.addColorStop(1, "rgba(139, 92, 246, 0.8)") // Brand purple

      ctx.fillStyle = headerGradient
      ctx.beginPath()
      ctx.roundRect(width * 0.12, height * 0.1, width * 0.76, height * 0.07, 15, 15, 0, 0)
      ctx.fill()

      // CliquePay logo
      ctx.font = `bold ${width * 0.04}px Arial`
      ctx.fillStyle = "white"
      ctx.textAlign = "left"
      ctx.fillText("CliquePay", width * 0.18, height * 0.135)

      // Small credit card icon
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.roundRect(width * 0.15, height * 0.125, width * 0.02, width * 0.015, 1)
      ctx.fill()

      // Status icons
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = `${width * 0.025}px Arial`
      ctx.textAlign = "right"
      ctx.fillText("9:41", width * 0.84, height * 0.135)

      // App subtitle - make it explicit about the bill splitting concept
      if (animationStage >= 1) {
        ctx.font = `${width * 0.03}px Arial`
        ctx.fillStyle = "white"
        ctx.textAlign = "center"

        if (animationStage === 1) {
          ctx.fillText("You paid the bill upfront", width * 0.5, height * 0.19)
        } else if (animationStage === 2) {
          ctx.fillText("Friends are paying you back", width * 0.5, height * 0.19)
        } else if (animationStage >= 3) {
          ctx.fillText("Everyone has paid their share", width * 0.5, height * 0.19)
        }
      }
    }

    // Draw avatar with initial and emoji
    const drawAvatar = (x, y, size, color, name, highlight = false, emoji = null) => {
      // Shadow for depth
      if (highlight) {
        ctx.shadowColor = "rgba(139, 92, 246, 0.5)"
        ctx.shadowBlur = 15
      }

      // Avatar circle
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // White border for highlighted avatar
      if (highlight) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Initial
      ctx.fillStyle = "white"
      ctx.font = `bold ${size * 0.7}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(name.charAt(0), x, y)

      // Emoji if provided
      if (emoji) {
        ctx.font = `${size * 0.5}px Arial`
        ctx.fillText(emoji, x + size * 1.3, y)
      }
    }

    // Draw bill receipt with clearer user-paid-first indication
    const drawBillReceipt = (progress) => {
      const cardWidth = width * 0.7
      const cardHeight = height * 0.6 // Increased from 0.55 to 0.6
      const cardX = width * 0.15
      const cardY = height * 0.2 // Slightly higher starting position (was 0.22)

      // Card background with receipt-like appearance
      ctx.fillStyle = "#1a1a1a"
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 15
      ctx.shadowOffsetY = 5
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 15)
      ctx.fill()
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // Receipt edge - zigzag pattern at top
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
      ctx.lineWidth = 1
      ctx.beginPath()
      const zigWidth = width * 0.02
      for (let x = cardX; x < cardX + cardWidth; x += zigWidth) {
        ctx.lineTo(x + zigWidth / 2, cardY - 3)
        ctx.lineTo(x + zigWidth, cardY)
      }
      ctx.stroke()

      // Card header
      ctx.fillStyle = "rgba(139, 92, 246, 0.2)"
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardWidth, height * 0.08, 15, 15, 0, 0)
      ctx.fill()

      // Restaurant logo - small icon
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = `${width * 0.03}px Arial`
      ctx.textAlign = "center"
      ctx.fillText("🍽️", cardX + width * 0.06, cardY + height * 0.04)

      // Restaurant name
      ctx.font = `bold ${width * 0.035}px Arial`
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.textAlign = "left"
      ctx.fillText("Olive Garden", cardX + width * 0.12, cardY + height * 0.035)

      // Date
      ctx.font = `${width * 0.025}px Arial`
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
      ctx.fillText("Today at 8:30 PM", cardX + width * 0.12, cardY + height * 0.065)

      // "You paid" label - make it explicit
      ctx.font = `bold ${width * 0.03}px Arial`
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.textAlign = "center"
      ctx.fillText("You paid for everyone", width * 0.5, cardY + height * 0.1)

      // Total amount
      ctx.font = `bold ${width * 0.06}px Arial`
      ctx.fillStyle = "rgba(139, 92, 246, 0.9)"
      ctx.textAlign = "center"
      ctx.fillText("$96.00", width * 0.5, cardY + height * 0.165)

      // "Your balance" section - shows money coming back to you
      ctx.fillStyle = "rgba(20, 20, 20, 0.8)"
      ctx.beginPath()
      ctx.roundRect(cardX + width * 0.05, cardY + height * 0.2, cardWidth - width * 0.1, height * 0.07, 10)
      ctx.fill()

      // Balance label
      ctx.font = `${width * 0.025}px Arial`
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.textAlign = "left"
      ctx.fillText("Your friends owe:", cardX + width * 0.08, cardY + height * 0.23)

      // Animate balance amount increasing as friends pay
      if (animationStage >= 1) {
        // Only show initial amount in first stage
        if (animationStage === 1) {
          currentBalance = -96 // You paid, so negative balance
        }
        // Start receiving money in stage 2
        else if (animationStage === 2) {
          if (frameCount < 180) {
            // First payment comes in
            currentBalance = Math.min(-72, -96 + frameCount * 0.5) // $24 coming in
          } else if (frameCount < 240) {
            // Second payment comes in
            currentBalance = Math.min(-40, -72 + (frameCount - 180) * 0.5) // $32 coming in
          } else if (frameCount < 300) {
            // Third payment comes in
            currentBalance = Math.min(0, -40 + (frameCount - 240) * 0.5) // $40 coming in
          }
        }
        // All settled in stage 3
        else if (animationStage === 3) {
          currentBalance = 0 // Everything is balanced
        }

        // Display balance
        ctx.font = `bold ${width * 0.035}px Arial`
        ctx.textAlign = "right"

        if (currentBalance < 0) {
          ctx.fillStyle = "rgba(239, 68, 68, 0.9)" // Red for negative
          ctx.fillText(
            `-$${Math.abs(currentBalance).toFixed(2)}`,
            cardX + cardWidth - width * 0.08,
            cardY + height * 0.23,
          )
        } else if (currentBalance > 0) {
          ctx.fillStyle = "rgba(34, 197, 94, 0.9)" // Green for positive
          ctx.fillText(`+$${currentBalance.toFixed(2)}`, cardX + cardWidth - width * 0.08, cardY + height * 0.23)
        } else {
          ctx.fillStyle = "rgba(34, 197, 94, 0.9)" // Green for zero/balanced
          ctx.fillText(`$0.00`, cardX + cardWidth - width * 0.08, cardY + height * 0.23)
        }
      }

      // Divider
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cardX + width * 0.05, cardY + height * 0.29)
      ctx.lineTo(cardX + cardWidth - width * 0.05, cardY + height * 0.29)
      ctx.stroke()

      // "Split details" heading
      ctx.font = `bold ${width * 0.03}px Arial`
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.textAlign = "left"
      ctx.fillText("Split Details", cardX + width * 0.05, cardY + height * 0.32)

      // Split details
      const itemY = cardY + height * 0.35 // Moved up slightly (was 0.37)
      const itemHeight = height * 0.07 // Increased item height (was 0.065)

      // Draw each friend's portion with clearer indicators
      friends.forEach((friend, index) => {
        const y = itemY + itemHeight * index

        // Highlight the current user
        const isHighlighted = friend.name === "You"
        const isPaidIndicator =
          friend.name === "You"
            ? "Paid full bill"
            : animationStage >= 2 && progress > index * 0.2 && friend.name !== "You"
              ? "Paid you back"
              : "Owes you"

        // Row background
        if (isHighlighted) {
          ctx.fillStyle = "rgba(139, 92, 246, 0.1)"
        } else if (animationStage >= 2 && progress > index * 0.2 && friend.name !== "You") {
          ctx.fillStyle = "rgba(34, 197, 94, 0.1)" // Green tint for paid
        } else if (friend.name !== "You") {
          ctx.fillStyle = "rgba(239, 68, 68, 0.05)" // Red tint for unpaid
        }

        ctx.beginPath()
        ctx.roundRect(cardX + width * 0.02, y - itemHeight / 2, cardWidth - width * 0.04, itemHeight, 5)
        ctx.fill()

        // Avatar
        drawAvatar(cardX + width * 0.08, y, width * 0.03, friend.color, friend.name, isHighlighted, friend.icon)

        // Name
        ctx.font = `${width * 0.03}px Arial`
        ctx.fillStyle = isHighlighted ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.7)"
        ctx.textAlign = "left"
        ctx.fillText(friend.name, cardX + width * 0.15, y - height * 0.01)

        // Status
        ctx.font = `${width * 0.02}px Arial`
        ctx.fillStyle =
          isPaidIndicator === "Paid full bill"
            ? "rgba(139, 92, 246, 0.9)"
            : isPaidIndicator === "Paid you back"
              ? "rgba(34, 197, 94, 0.9)"
              : "rgba(239, 68, 68, 0.9)"
        ctx.fillText(isPaidIndicator, cardX + width * 0.15, y + height * 0.015)

        // Amount
        ctx.font = `${width * 0.035}px Arial`
        ctx.fillStyle = isHighlighted ? "rgba(139, 92, 246, 0.9)" : "rgba(255, 255, 255, 0.7)"
        ctx.textAlign = "right"
        ctx.fillText(friend.amount, cardX + cardWidth - width * 0.08, y)

        // Payment status indicators
        if (friend.name === "You") {
          // For "You", show a different indicator - "You paid" check
          const checkX = cardX + cardWidth - width * 0.04

          // Purple circle for you
          ctx.fillStyle = brandPurple
          ctx.beginPath()
          ctx.arc(checkX, y, width * 0.015, 0, Math.PI * 2)
          ctx.fill()

          // Checkmark
          ctx.strokeStyle = "white"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(checkX - width * 0.008, y)
          ctx.lineTo(checkX - width * 0.002, y + width * 0.008)
          ctx.lineTo(checkX + width * 0.008, y - width * 0.008)
          ctx.stroke()
        } else if (animationStage >= 2 && progress > index * 0.2) {
          // Show paid indicator for friends
          const checkX = cardX + cardWidth - width * 0.04

          // Green circle
          ctx.fillStyle = "#10B981"
          ctx.beginPath()
          ctx.arc(checkX, y, width * 0.015, 0, Math.PI * 2)
          ctx.fill()

          // Checkmark
          ctx.strokeStyle = "white"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(checkX - width * 0.008, y)
          ctx.lineTo(checkX - width * 0.002, y + width * 0.008)
          ctx.lineTo(checkX + width * 0.008, y - width * 0.008)
          ctx.stroke()
        } else if (friend.name !== "You") {
          // Pending indicator for unpaid friends
          const pendingX = cardX + cardWidth - width * 0.04

          // Gray circle
          ctx.fillStyle = "#6B7280"
          ctx.beginPath()
          ctx.arc(pendingX, y, width * 0.015, 0, Math.PI * 2)
          ctx.fill()

          // Clock icon
          ctx.strokeStyle = "white"
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(pendingX, y, width * 0.008, 0, Math.PI * 2)
          ctx.moveTo(pendingX, y)
          ctx.lineTo(pendingX, y - width * 0.006)
          ctx.moveTo(pendingX, y)
          ctx.lineTo(pendingX + width * 0.005, y + width * 0.002)
          ctx.stroke()
        }
      })

      // All settled button - adjust position based on new card height
      if (animationStage >= 3) {
        const buttonWidth = cardWidth * 0.6
        const buttonX = cardX + (cardWidth - buttonWidth) / 2
        const buttonY = cardY + cardHeight - height * 0.09 // Adjust button position

        const buttonGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY)
        buttonGradient.addColorStop(0, darkPurple)
        buttonGradient.addColorStop(1, brandPurple)

        ctx.fillStyle = buttonGradient
        ctx.beginPath()
        ctx.roundRect(buttonX, buttonY, buttonWidth, height * 0.05, 25)
        ctx.fill()

        ctx.font = `bold ${width * 0.03}px Arial`
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.fillText("All Settled Up! 🎉", width * 0.5, buttonY + height * 0.03)
      }
    }

    // Create money particles
    const createMoneyParticles = (fromX, fromY, toX, toY, count, color) => {
      for (let i = 0; i < count; i++) {
        moneyParticles.push({
          x: fromX,
          y: fromY,
          targetX: toX,
          targetY: toY,
          size: Math.random() * 5 + 5,
          progress: 0,
          speed: 0.01 + Math.random() * 0.02,
          opacity: 0.9,
          color: color || "rgba(139, 92, 246, 0.9)",
        })
      }
    }

    // Update and draw money particles
    const updateMoneyParticles = () => {
      for (let i = moneyParticles.length - 1; i >= 0; i--) {
        const particle = moneyParticles[i]

        // Update progress
        particle.progress += particle.speed

        // Calculate current position with easing
        const easeOutQuad = (t) => t * (2 - t)
        const easedProgress = easeOutQuad(particle.progress)

        particle.x = particle.x + (particle.targetX - particle.x) * easedProgress
        particle.y = particle.y + (particle.targetY - particle.y) * easedProgress

        // Fade out near the end
        if (particle.progress > 0.7) {
          particle.opacity = 0.9 - ((particle.progress - 0.7) / 0.3) * 0.9
        }

        // Draw particle
        ctx.font = `${particle.size}px Arial`
        ctx.fillStyle = particle.color.replace("0.9", particle.opacity)
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // Remove completed particles
        if (particle.progress >= 1) {
          moneyParticles.splice(i, 1)
        }
      }
    }

    // Animation render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      frameCount++
      
      // Increase fade-in opacity gradually in the first ~0.3 seconds
      fadeInOpacity = Math.min(1, frameCount / 18) // 18 frames ≈ 0.3s at 60fps
      
      // Set global opacity for everything drawn on canvas
      ctx.globalAlpha = fadeInOpacity
      
      // Update animation stage - fast initial appearance but after fade-in
      if (animationStage === 0 && frameCount > 10) {
        animationStage = 1 // Show bill
        stageProgress = 0
      } else if (animationStage === 1 && frameCount > 90) {
        animationStage = 2 // Friends paying
        stageProgress = 0
        
        // Create money particles from first friend to you
        const yourAvatarX = width * 0.23
        const yourAvatarY = height * 0.22 + height * 0.37 + height * 0.065
        
        createMoneyParticles(
          width * 0.23, // First friend avatar X
          height * 0.22 + height * 0.37, // First friend avatar Y
          yourAvatarX,
          yourAvatarY,
          15,
          "rgba(147, 51, 234, 0.9)", // Match friend's color
        )
      } else if (animationStage === 2 && frameCount > 180) {
        // Create money particles from second friend
        const yourAvatarX = width * 0.23
        const yourAvatarY = height * 0.22 + height * 0.37 + height * 0.065

        createMoneyParticles(
          width * 0.23, // Third friend avatar X
          height * 0.22 + height * 0.37 + height * 0.065 * 2, // Third friend avatar Y
          yourAvatarX,
          yourAvatarY,
          15,
          "rgba(236, 72, 153, 0.9)", // Match friend's color
        )
      } else if (animationStage === 2 && frameCount > 270) {
        // Create money particles from third friend
        const yourAvatarX = width * 0.23
        const yourAvatarY = height * 0.22 + height * 0.37 + height * 0.065

        createMoneyParticles(
          width * 0.23, // Fourth friend avatar X
          height * 0.22 + height * 0.37 + height * 0.065 * 3, // Fourth friend avatar Y
          yourAvatarX,
          yourAvatarY,
          15,
          "rgba(16, 185, 129, 0.9)", // Match friend's color
        )

        animationStage = 3 // All settled
      }

      // Update stage progress
      stageProgress = Math.min(1, stageProgress + 0.01)

      // Draw custom phone frame and app interface
      drawPhone()
      drawAppInterface()

      // Draw bill receipt based on animation stage
      if (animationStage >= 1) {
        drawBillReceipt(stageProgress)
      }

      // Update and draw money particles
      updateMoneyParticles()

      // Loop animation after completion
      if (frameCount > 500) {
        frameCount = 0
        animationStage = 0
        stageProgress = 0
        moneyParticles.length = 0 // Clear particles
        currentBalance = 0
      }

      // Reset global alpha at the end of the render function
      ctx.globalAlpha = 1
      
      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <canvas ref={canvasRef} width={400} height={600} className="w-full h-auto" style={{ maxWidth: "100%" }} />
      </motion.div>

      {/* Ambient glow effect */}
      <div className="absolute -inset-4 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
    </div>
  )
}

