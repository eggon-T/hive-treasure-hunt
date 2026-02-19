"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/firebase/auth"
import { handleData } from "../functions"
import Link from "next/link"
import { StaticBackground } from "@/components/static-background"
import { GAME_CONFIG } from "../game-config"

export default function Completion() {
  const User = useAuth()
  const [timeTaken, setTimeTaken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!User?.email) return
      try {
        const data = await handleData(User.email)
        if (data?.timeTaken) {
          setTimeTaken(data.timeTaken)
        }
      } catch (err) {
        console.error("Error fetching completion data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [User])

  // Format time: convert minutes to MM:SS
  const formatTime = (minutes) => {
    if (!minutes) return "--:--"
    const totalSeconds = Math.round(minutes * 60)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      <StaticBackground />

      <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-2xl w-full space-y-6 sm:space-y-8 fade-in-interference text-center">
          <div className="space-y-4 sm:space-y-6 animate-pulse-glow">
            <div className="inline-block text-6xl sm:text-8xl mb-3 sm:mb-4 flicker animate-bounce-subtle">✓</div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl title-font text-[#dc2626] text-glow flicker">
              COMPLETE
            </h1>
            <p className="text-base sm:text-lg font-mono text-foreground/70 tracking-wide uppercase">
              All Transmissions Located
            </p>
          </div>

          <div className="static-overlay border border-[#dc2626]/30 bg-card/50 backdrop-blur-sm p-6 sm:p-8 space-y-6 hover:border-glow transition-all duration-300">
            <div className="flex justify-center items-center gap-12">
              <div className="space-y-2">
                <div className="text-[10px] sm:text-xs font-mono text-muted-foreground tracking-widest uppercase">
                  Signals
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground">{GAME_CONFIG.TOTAL_LEVELS}</div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] sm:text-xs font-mono text-muted-foreground tracking-widest uppercase">
                  Time Taken
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground">
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  ) : (
                    formatTime(timeTaken)
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-border/30">
              <p className="text-xs sm:text-sm font-mono text-foreground/80 leading-relaxed tracking-wide">
                Mission accomplished. All transmission sources have been located and verified. Your performance has been
                logged.
              </p>
            </div>
          </div>

          <Link href="/" className="block">
            <button className="w-full max-w-md mx-auto min-h-[48px] sm:min-h-[52px] p-4 bg-transparent text-foreground font-mono text-sm sm:text-base tracking-widest uppercase border border-foreground/30 hover:border-[#dc2626] hover:text-[#dc2626] active:scale-[0.98] transition-all duration-200 relative overflow-hidden group">
              <span className="relative z-10">RETURN TO BASE</span>
              <div className="absolute inset-0 bg-[#dc2626]/10 translate-x-full group-hover:translate-x-0 group-active:translate-x-0 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
