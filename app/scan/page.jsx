"use client"

import { useEffect, useState, useCallback } from "react"
import { handleData, markQRScanned } from "../functions"
import { useAuth } from "@/firebase/auth"
import { useRouter } from "next/navigation"
import QrScanner from "@/components/qr-scanner"
import { StaticBackground } from "@/components/static-background"
import { ProgressTimeline } from "@/components/progress-timeline"
import { GAME_CONFIG } from "../game-config"

// QR Code hints mapping (all frontend, no DB needed)
const QR_HINTS = {
  qr1: "Where silence lives among knowledge infinite, Find the place where books illuminate minds.",
  qr2: "Where minds recharge and conversations flow, Find the place where hunger disappears.",
  qr3: "Where competition meets teamwork. Find the court where baskets decide victory.",
  qr4: "Where the ball flies above the net. Find the court of spikes and serves.",
  qr5: "Where protection and observation never rest. Find the room that guards everything.",
  qr6: "The final destination stands tall and wide, Find the structure beneath the open sky.",
}

export default function Scan() {
  const router = useRouter()
  const User = useAuth()

  // Core state
  const [currentHint, setCurrentHint] = useState("")
  const [expectedQR, setExpectedQR] = useState("")
  const [level, setLevel] = useState(1)
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [signalStrength, setSignalStrength] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [matchedQRInfo, setMatchedQRInfo] = useState(null)

  // Load level data from Firebase
  const loadLevelData = useCallback(async () => {
    if (!User?.email) return

    try {
      setLoading(true)
      const data = await handleData(User.email)

      if (!data) return

      if (data.completed) {
        router.push("/completion")
        return
      }

      setLevel(data.level)
      setUserName(data.userName)
      setExpectedQR(`qr${data.level}`)
    } catch (error) {
      console.error("Error loading level data:", error)
    } finally {
      setLoading(false)
    }
  }, [User, router])

  // Handle QR code scan
  const handleQRScan = useCallback((scannedText) => {
    console.log("QR scanned:", scannedText, "Current level:", level)

    // Extract QR number from scanned text (qr1, qr2, clue1, etc.)
    const qrMatch = scannedText.toLowerCase().match(/(?:qr|clue)(\d+)/)
    let matchedQR = null
    let matchedHint = null

    if (qrMatch) {
      const qrNumber = qrMatch[1]
      const qrKey = `qr${qrNumber}`
      matchedQR = qrNumber
      matchedHint = QR_HINTS[qrKey]
    } else {
      // Try to match scanned text to one of our hints
      const scannedLower = scannedText.toLowerCase().trim()
      for (const [qrKey, hintText] of Object.entries(QR_HINTS)) {
        const hintLower = hintText.toLowerCase().trim()
        if (scannedLower === hintLower ||
          scannedLower.includes(hintLower.substring(0, 30)) ||
          hintLower.includes(scannedLower.substring(0, 30))) {
          matchedQR = qrKey.replace('qr', '')
          matchedHint = hintText
          break
        }
      }
    }

    if (matchedHint) {
      const expectedQRNumber = String(level)

      if (matchedQR === expectedQRNumber) {
        if (processing) return

        console.log("✅ Correct QR scanned!")
        setCurrentHint(matchedHint)
        setMatchedQRInfo({ qrNumber: matchedQR, isCorrect: true, hint: matchedHint })
        setProcessing(true)

        // Advance after a delay
        setTimeout(async () => {
          try {
            await markQRScanned(User.email, Number(matchedQR))
            setCurrentHint("")
            setMatchedQRInfo(null)
            await loadLevelData()
          } catch (error) {
            alert(error.message || "Error processing scan")
          } finally {
            setProcessing(false)
          }
        }, 4000)
      } else {
        // Wrong sequence — just show error, nothing else
        console.log("❌ Wrong QR - Expected:", expectedQRNumber, "Got:", matchedQR)
        setErrorMessage("Wrong sequence! Find the correct QR code.")
        setTimeout(() => {
          setErrorMessage("")
        }, 3000)
      }
    } else {
      console.log("No match found for scanned text")
    }
  }, [level, User, loadLevelData, processing])

  // Initial load
  useEffect(() => {
    if (User) {
      loadLevelData()
    }
  }, [User])

  // Signal strength animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSignalStrength(Math.random() * 100)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!User) {
    return null
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden font-rajdhani">
      <StaticBackground />
      <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

      <div className="relative z-20 min-h-screen flex flex-col p-4 sm:p-6">
        {/* Header with Progress */}
        <div className="mb-6 sm:mb-8 space-y-4">
          {/* Progress Bar */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-500/80 uppercase">
                PROGRESS
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-cyan-400">
                {level - 1} / {GAME_CONFIG.TOTAL_LEVELS}
              </span>
            </div>
            <div className="relative w-full h-6 sm:h-8 bg-black/60 border-2 border-cyan-500/50 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 transition-all duration-500 ease-out shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                style={{ width: `${((level - 1) / GAME_CONFIG.TOTAL_LEVELS) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>

              <div className="absolute inset-0 flex items-center justify-between px-1">
                {Array.from({ length: GAME_CONFIG.TOTAL_LEVELS }, (_, i) => {
                  const isCompleted = i < level - 1
                  const isCurrent = i === level - 1
                  return (
                    <div
                      key={i}
                      className={`relative z-10 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${isCompleted
                          ? "bg-cyan-300 shadow-[0_0_8px_rgba(6,182,212,1)]"
                          : isCurrent
                            ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,1)] animate-pulse"
                            : "bg-cyan-500/30"
                        }`}
                    />
                  )
                })}
              </div>

              <div className="absolute -bottom-5 left-0 right-0 flex justify-between px-0.5">
                {Array.from({ length: GAME_CONFIG.TOTAL_LEVELS }, (_, i) => (
                  <span
                    key={i}
                    className={`text-[8px] sm:text-[10px] font-mono font-bold transition-all ${i < level - 1
                        ? "text-cyan-400"
                        : i === level - 1
                          ? "text-cyan-300"
                          : "text-cyan-500/40"
                      }`}
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Status Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-500 signal-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-500 text-glow uppercase">
                ACTIVE HUNT
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-[10px] sm:text-xs font-mono tracking-wider text-muted-foreground">
                <span className="hidden sm:inline">SIGNAL: </span>
                <span className="text-cyan-500 signal-pulse">{Math.round(signalStrength)}%</span>
              </div>
            </div>
          </div>

          {/* QR Scanning Order */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-500/70 uppercase">
              SCAN ORDER:
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {Array.from({ length: GAME_CONFIG.TOTAL_LEVELS }, (_, index) => {
                const qrNumber = index + 1
                const isCompleted = index < level - 1
                const isCurrent = index === level - 1
                return (
                  <div
                    key={`qr${qrNumber}`}
                    className={`px-2 py-1 text-[10px] sm:text-xs font-mono font-bold border transition-all ${isCompleted
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                        : isCurrent
                          ? "bg-cyan-500/30 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                          : "bg-black/40 border-cyan-500/30 text-cyan-500/50"
                      }`}
                  >
                    {qrNumber}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
          {loading ? (
            <div className="text-center space-y-6">
              <div className="inline-block w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              <p className="text-xs sm:text-sm font-mono tracking-widest text-muted-foreground">
                INITIALIZING SCANNER...
              </p>
            </div>
          ) : processing ? (
            <div className="text-center space-y-6">
              <div className="inline-block w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              <p className="text-xs sm:text-sm font-mono tracking-widest text-muted-foreground">
                PROCESSING TRANSMISSION...
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 relative">
              {/* Error Message Overlay */}
              {errorMessage && (
                <div className="absolute top-0 left-0 right-0 z-50 flex justify-center animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="bg-red-500/10 border border-red-500/50 backdrop-blur-md px-6 py-4 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-red-500 font-mono font-bold tracking-widest text-sm sm:text-base">
                        {errorMessage}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline - Desktop */}
              <div className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-30">
                <ProgressTimeline
                  currentLevel={level}
                  totalLevels={GAME_CONFIG.TOTAL_LEVELS}
                />
              </div>

              {/* Content */}
              <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
                {/* Signal Title */}
                <div className="text-center space-y-2 mb-4 animate-pulse-glow">
                  <div className="text-5xl sm:text-7xl font-orbitron font-bold text-cyan-500 text-glow flicker">
                    SIGNAL {level}
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono tracking-widest text-muted-foreground uppercase">
                    Transmission Sequence
                  </div>
                </div>

                {/* Matched QR Indicator */}
                {matchedQRInfo && matchedQRInfo.isCorrect && (
                  <div className="w-full border border-green-500/50 bg-green-500/10 backdrop-blur-md p-4 sm:p-6 transition-all duration-300 animate-in fade-in zoom-in-95 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="w-3 h-3 rounded-full animate-pulse bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                      <span className="text-sm sm:text-base font-orbitron font-bold tracking-widest uppercase text-green-400">
                        ✓ SIGNAL MATCHED
                      </span>
                      <div className="w-3 h-3 rounded-full animate-pulse bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-4xl sm:text-5xl font-orbitron font-bold text-green-400 text-glow">
                        QR {matchedQRInfo.qrNumber}
                      </div>
                    </div>
                  </div>
                )}

                {/* Active Hint - Only shown AFTER correct scan */}
                {currentHint && (
                  <div className="w-full static-overlay border border-cyan-500/30 bg-black/40 backdrop-blur-md p-6 sm:p-8 hover:border-cyan-500/50 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                    <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <span className="text-cyan-500 text-xs font-mono shrink-0 flicker">◉</span>
                      <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-500 text-glow uppercase">
                        Message Decoded
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base font-mono leading-relaxed text-gray-200 tracking-wide">
                      &quot;{currentHint}&quot;
                    </p>
                  </div>
                )}

                {/* QR Scanner */}
                <div className="w-full max-w-md mx-auto static-overlay border border-cyan-500/30 bg-black/40 backdrop-blur-md p-4">
                  <QrScanner
                    qr={expectedQR}
                    setTrigger={() => { }}
                    onScanned={handleQRScan}
                    currentLevel={level}
                  />
                </div>

                {/* Completed QRs Log */}
                {level > 1 && (
                  <div className="w-full space-y-4">
                    <div className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-500/50 uppercase mb-2 ml-1">
                      TRANSMISSION LOG
                    </div>
                    {Array.from({ length: level - 1 }, (_, i) => {
                      const qrNum = level - 1 - i // reverse order
                      const qrKey = `qr${qrNum}`
                      return (
                        <div
                          key={qrKey}
                          className="w-full static-overlay border border-cyan-900/30 bg-black/40 backdrop-blur-md p-6 sm:p-8 opacity-70 hover:opacity-100 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="text-cyan-800 text-xs font-mono shrink-0">✓</span>
                              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-700 uppercase">
                                Log Entry: Signal {qrNum}
                              </span>
                            </div>
                            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-green-500/80 bg-green-500/10 border border-green-500/30 px-2 py-0.5 uppercase">
                              ✓ {qrKey}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm md:text-base font-mono leading-relaxed tracking-wide text-gray-500">
                            &quot;{QR_HINTS[qrKey]}&quot;
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="mt-6 sm:mt-8 space-y-2 font-mono text-[10px] sm:text-xs text-muted-foreground">
            <div className="flex justify-between items-center">
              <span>OPERATIVE:</span>
              <span className="text-gray-300">{userName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>STATUS:</span>
              <span className="text-cyan-500 signal-pulse">HUNTING</span>
            </div>
            <div className="flex justify-between items-center">
              <span>SIGNALS FOUND:</span>
              <span className="text-gray-300">{level - 1}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
