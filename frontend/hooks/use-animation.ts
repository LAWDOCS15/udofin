'use client'

import { useState, useEffect } from 'react'

export function useAnimation(trigger: boolean, delay: number = 0) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!trigger) {
      setIsAnimating(false)
      return
    }

    const timeout = setTimeout(() => setIsAnimating(true), delay)
    return () => clearTimeout(timeout)
  }, [trigger, delay])

  return isAnimating
}
