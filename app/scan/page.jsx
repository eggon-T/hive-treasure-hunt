"use client"

import { useEffect, useState } from "react"
import { handleData, handleQuestionSubmit } from "../functions"
import { useAuth } from "@/firebase/auth"
import { useRouter } from "next/navigation"
import QrScanner from "@/components/qr-scanner"
import { StaticBackground } from "@/components/static-background"
import { SignalScanner } from "@/components/signal-scanner"
import { ProgressTimeline } from "@/components/progress-timeline"

export default function Scan() {
  const router = useRouter()
  const [hint, setHint] = useState({})
  const [load, setLoad] = useState(true)
  const [trigger, setTrigger] = useState(false)
  const [check, setCheck] = useState(false)
  const [signalStrength, setSignalStrength] = useState(0)
  const User = useAuth()

  const fetchData = async () => {
    try {
      setLoad(true)
      const obj = await handleData(User.email)
      console.log(obj)

      if (obj && !obj.StartTime) {
        setHint({
          hint: obj.hint?.h || "Encrypted Signal...",
          qr: obj.hint?.qr || "",
          level: obj.level,
          userName: obj.userName,
        })
      } else {
        router.push("/completion")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoad(false)
    }
  }

  useEffect(() => {
    if (trigger) {
      updateLevel()
      setTrigger(false)
    }
  }, [trigger])

  const updateLevel = async () => {
    try {
      setCheck(true)
      await handleQuestionSubmit(User)
      setCheck(false)
      fetchData()
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    if (User) {
      fetchData()
    }
  }, [User])

  useEffect(() => {
    // Simulate signal strength fluctuation
    const interval = setInterval(() => {
      setSignalStrength(Math.random() * 100)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (User) {
    return (
      <div className="relative min-h-screen w-full bg-background overflow-hidden font-rajdhani">
        <StaticBackground />
        <SignalScanner />

        <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

        <div className="relative z-20 min-h-screen flex flex-col p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 animate-fade-in">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-500 signal-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-500 text-glow uppercase">
                ACTIVE HUNT
              </span>
            </div>
            <div className="text-[10px] sm:text-xs font-mono tracking-wider text-muted-foreground">
              <span className="hidden sm:inline">SIGNAL: </span>
              <span className="text-cyan-500 signal-pulse">{Math.round(signalStrength)}%</span>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
            {load ? (
              <div className="text-center space-y-6">
                <div className="inline-block w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                <p className="text-xs sm:text-sm font-mono tracking-widest text-muted-foreground">
                  INITIALIZING SCANNER...
                </p>
              </div>
            ) : check ? (
              <div className="text-center space-y-6">
                <div className="inline-block w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                <p className="text-xs sm:text-sm font-mono tracking-widest text-muted-foreground">
                  PROCESSING TRANSMISSION...
                </p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 fade-in-interference">
                
                {/* Timeline - Hidden on mobile, visible on larger screens */}
                <div className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-30">
                  <ProgressTimeline currentLevel={hint.level} />
                </div>

                {/* Mobile Timeline - Horizontal or simplified if needed, for now hidden to save space */}

                <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
                  <div className="text-center space-y-2 mb-4 animate-pulse-glow">
                    <div className="text-5xl sm:text-7xl font-orbitron font-bold text-cyan-500 text-glow flicker">
                      SIGNAL {hint.level}
                    </div>
                    <div className="text-[10px] sm:text-xs font-mono tracking-widest text-muted-foreground uppercase">
                      Transmission Sequence
                    </div>
                  </div>

                  <div className="w-full static-overlay border border-cyan-500/30 bg-black/40 backdrop-blur-md p-6 sm:p-8 hover:border-cyan-500/50 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                    <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <span className="text-cyan-500 text-xs font-mono shrink-0 flicker">◉</span>
                      <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-500 text-glow uppercase">
                        Intercepted Message
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base font-mono leading-relaxed text-gray-200 tracking-wide">
                      &quot;{hint.hint}&quot;
                    </p>
                  </div>

                  <div className="w-full max-w-md mx-auto static-overlay border border-cyan-500/30 bg-black/40 backdrop-blur-md p-4">
                    <QrScanner qr={hint.qr} setTrigger={setTrigger} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer stats */}
          {!load && (
            <div className="mt-6 sm:mt-8 space-y-2 font-mono text-[10px] sm:text-xs text-muted-foreground animate-fade-in-up">
              <div className="flex justify-between items-center">
                <span>OPERATIVE:</span>
                <span className="text-gray-300">{hint.userName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>STATUS:</span>
                <span className="text-cyan-500 signal-pulse">HUNTING</span>
              </div>
              <div className="flex justify-between items-center">
                <span>SIGNALS FOUND:</span>
                <span className="text-gray-300">{hint.level - 1}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
