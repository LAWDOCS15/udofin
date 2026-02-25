'use client'

import { useState, useCallback } from 'react'

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => boolean | string
  errorMessage?: string
}

interface FormErrors {
  [field: string]: string | null
}

export function useFormValidation(rules: Record<string, ValidationRule>) {
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validate = useCallback((name: string, value: string): string | null => {
    const rule = rules[name]
    if (!rule) return null

    if (rule.required && !value.trim()) {
      return rule.errorMessage || `${name} is required`
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      return `Minimum ${rule.minLength} characters required`
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      return `Maximum ${rule.maxLength} characters allowed`
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      return rule.errorMessage || `Invalid ${name}`
    }

    if (value && rule.custom) {
      const result = rule.custom(value)
      if (typeof result === 'string') return result
      if (!result) return rule.errorMessage || `Invalid ${name}`
    }

    return null
  }, [rules])

  const validateField = useCallback((name: string, value: string) => {
    const error = validate(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
    return error
  }, [validate])

  const validateAll = useCallback((formData: Record<string, string>): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(rules).forEach((field) => {
      const error = validate(field, formData[field] || '')
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [rules, validate])

  const markTouched = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  const reset = useCallback(() => {
    setErrors({})
    setTouched({})
  }, [])

  return {
    errors,
    touched,
    validateField,
    validateAll,
    markTouched,
    reset,
    isFieldError: (field: string) => touched[field] && errors[field],
  }
}
