"use client"

import { motion } from "framer-motion"
import { Check, Lock, Radio } from "lucide-react"

export function ProgressTimeline({ currentLevel, totalLevels = 6 }) {
  // Create an array of levels based on totalLevels
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1)

  return (
    <div className="relative flex flex-col items-start gap-0 w-full max-w-[200px] ml-4">
      {levels.map((level, index) => {
        const isCompleted = level < currentLevel
        const isCurrent = level === currentLevel
        const isLocked = level > currentLevel

        return (
          <div key={level} className="relative flex items-center gap-4 h-16 sm:h-20">
            {/* Connecting Line */}
            {index !== levels.length - 1 && (
              <div
                className={`absolute left-[15px] top-[40px] sm:top-[50px] w-[2px] h-[calc(100%-20px)] sm:h-[calc(100%-30px)] -translate-x-1/2 transition-colors duration-500 ${
                  isCompleted ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-white/10"
                }`}
              />
            )}

            {/* Node */}
            <div className="relative z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  borderColor: isCompleted
                    ? "rgba(6,182,212,1)"
                    : isCurrent
                      ? "rgba(6,182,212,1)"
                      : "rgba(255,255,255,0.1)",
                  backgroundColor: isCompleted
                    ? "rgba(6,182,212,0.2)"
                    : isCurrent
                      ? "rgba(6,182,212,0.1)"
                      : "transparent",
                }}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  isCompleted
                    ? "shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                    : isCurrent
                      ? "shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-pulse-glow"
                      : ""
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-cyan-500" />
                ) : isCurrent ? (
                  <Radio className="w-4 h-4 text-cyan-500 animate-spin-slow" />
                ) : (
                  <Lock className="w-3 h-3 text-white/30" />
                )}
              </motion.div>
            </div>

            {/* Label */}
            <div className="flex flex-col">
              <span
                className={`text-xs font-orbitron tracking-widest transition-colors duration-300 ${
                  isCompleted
                    ? "text-cyan-500 text-glow"
                    : isCurrent
                      ? "text-cyan-400 text-glow-subtle font-bold"
                      : "text-white/30"
                }`}
              >
                SIGNAL {level}
              </span>
              <span
                className={`text-[10px] font-mono transition-colors duration-300 ${
                  isCompleted
                    ? "text-gray-400"
                    : isCurrent
                      ? "text-cyan-500/70"
                      : "text-white/10"
                }`}
              >
                {isCompleted ? "DECRYPTED" : isCurrent ? "TARGET" : "LOCKED"}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
