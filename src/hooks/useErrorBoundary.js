"use client"

import { useState, useEffect } from "react"

export const useErrorBoundary = () => {
  const [error, setError] = useState(null)

  const resetError = () => {
    setError(null)
  }

  const captureError = (error) => {
    console.error("Error captured by useErrorBoundary:", error)
    setError(error)
  }

  useEffect(() => {
    const handleError = (event) => {
      captureError(event.error)
    }

    const handleUnhandledRejection = (event) => {
      captureError(event.reason)
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return {
    error,
    resetError,
    captureError,
  }
}
