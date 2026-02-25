'use client'

import { useState, useEffect } from 'react'

export function useCounter(
  targetValue: number,
  duration: number = 2000,
  shouldStart: boolean = true
) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldStart) return

    const steps = Math.ceil(duration / 16) // 60fps
    const stepValue = targetValue / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const newValue = Math.min(stepValue * currentStep, targetValue)
      setCount(Math.floor(newValue))

      if (currentStep >= steps) {
        clearInterval(interval)
        setCount(targetValue)
      }
    }, 16)

    return () => clearInterval(interval)
  }, [targetValue, duration, shouldStart])

  return count
}
