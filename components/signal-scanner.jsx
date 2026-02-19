"use client"

import { useEffect, useState } from "react"

export function SignalScanner() {
  const [scanning, setScanning] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setScanning((prev) => !prev)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 pointer-events-none z-[9996]">
      <div
        className={`h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent transition-transform duration-[3000ms] ease-linear ${
          scanning ? "translate-y-[100vh]" : "translate-y-0"
        }`}
        style={{
          boxShadow: "0 0 20px #06b6d4, 0 0 40px #06b6d4",
          opacity: 0.3,
        }}
      />
    </div>
  )
}
