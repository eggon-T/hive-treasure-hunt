"use client"

import { useEffect, useState, useCallback } from "react"
import { handleData, handleQuestionSubmit } from "../functions"
import { useAuth } from "@/firebase/auth"
import { useRouter } from "next/navigation"
import QrScanner from "@/components/qr-scanner"
import { StaticBackground } from "@/components/static-background"
import { SignalScanner } from "@/components/signal-scanner"
import { ProgressTimeline } from "@/components/progress-timeline"
import { GAME_CONFIG } from "../game-config"

// QR Code hints mapping
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
  const [currentHint, setCurrentHint] = useState("") // The hint text to display (active level)
  const [allHints, setAllHints] = useState([]) // History of all hints
  const [expectedQR, setExpectedQR] = useState("") // Expected QR code value
  const [level, setLevel] = useState(1)
  const [userName, setUserName] = useState("")
  const [userPath, setUserPath] = useState("") // User's QR scanning path/order
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [signalStrength, setSignalStrength] = useState(0)
  const [errorMessage, setErrorMessage] = useState("") // Error message for wrong QR scan

  // Load level data from Firebase
  const loadLevelData = useCallback(async () => {
    if (!User?.email) return

    try {
      setLoading(true)
      const data = await handleData(User.email)

      if (data?.StartTime) {
        // Game completed
        router.push("/completion")
        return
      }

      if (data) {
        const currentLevel = data.level || 1
        setLevel(currentLevel)
        setUserName(data.userName || "")
        // Set expected QR to match numbered order (qr1, qr2, etc.)
        // Set expected QR to match numbered order (qr1, qr2, etc.)
        setExpectedQR(`qr${currentLevel}`)
        setUserPath(data.path || "")
        
        // Update all hints history
        if (data.allHints) {
          setAllHints(data.allHints)
        }

        // Do NOT set currentHint here. We only show it AFTER scanning.
        // setCurrentHint(...) 
      }
    } catch (error) {
      console.error("Error loading level data:", error)
    } finally {
      setLoading(false)
    }
  }, [User, router])

  // Handle QR code scan - match hint and update status automatically
  const handleQRScan = useCallback((scannedText) => {
    console.log("QR scanned:", scannedText, "Current level:", level)
    
    // First, try to extract QR number from scanned text (qr1, qr2, clue1, etc.)
    const qrMatch = scannedText.toLowerCase().match(/(?:qr|clue)(\d+)/)
    let matchedQR = null
    let matchedHint = null
    
    if (qrMatch) {
      const qrNumber = qrMatch[1]
      const qrKey = `qr${qrNumber}`
      matchedQR = qrNumber
      matchedHint = QR_HINTS[qrKey]
    } else {
      // If no QR number, try to match the scanned text to one of our hints
      const scannedLower = scannedText.toLowerCase().trim()
      for (const [qrKey, hintText] of Object.entries(QR_HINTS)) {
        const hintLower = hintText.toLowerCase().trim()
        // Match if scanned text contains key parts of the hint
        if (scannedLower === hintLower || 
            scannedLower.includes(hintLower.substring(0, 30)) ||
            hintLower.includes(scannedLower.substring(0, 30))) {
          matchedQR = qrKey.replace('qr', '')
          matchedHint = hintText
          break
        }
      }
    }
    
    // Display the hint immediately
    if (matchedHint) {
      console.log("Matched QR", matchedQR, "Setting hint:", matchedHint)
      
      // Check if this is the correct QR for the current level
      const expectedQRNumber = String(level)
      if (matchedQR === expectedQRNumber) {
        console.log("✅ Correct QR scanned! Advancing level automatically...")
        setCurrentHint(matchedHint) // ONLY set hint if it matches the current level

        // Automatically advance to next level after a delay
        setTimeout(async () => {
          try {
            setProcessing(true)
            await handleQuestionSubmit(User)
            setCurrentHint("")
            await loadLevelData()
            setProcessing(false)
          } catch (error) {
            alert(error.message || "Error processing scan")
            setProcessing(false)
          }
        }, 4000) // 4 second delay to allow user to read the hint/confirmation
      } else {
        console.log("❌ Wrong QR - Expected:", expectedQRNumber, "Got:", matchedQR)
        setErrorMessage("PROTOCOL VIOLATION: OUT OF SEQUENCE SCAN DETECTED")
        
        // Clear error after 3 seconds
        setTimeout(() => {
          setErrorMessage("")
        }, 3000)
      }
    } else {
      // Fallback: display scanned text
      console.log("No match found, displaying scanned text")
      setCurrentHint(scannedText)
    }
  }, [level, User, loadLevelData])

  // Handle correct QR match - advance to next level (used by QR scanner component)
  const handleCorrectQR = useCallback(async () => {
    try {
      setProcessing(true)
      await handleQuestionSubmit(User)
      // Clear current hint for next level
      setCurrentHint("")
      // Load next level
      await loadLevelData()
    } catch (error) {
      alert(error.message || "Error processing scan")
    } finally {
      setProcessing(false)
    }
  }, [User, loadLevelData])

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
      <SignalScanner />
      <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

      <div className="relative z-20 min-h-screen flex flex-col p-4 sm:p-6">
        {/* Header with GTA-style Timeline */}
        <div className="mb-6 sm:mb-8 space-y-4">
          {/* GTA-style Progress Timeline Bar */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-500/80 uppercase">
                PROGRESS
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-cyan-400">
                {level - 1} / {GAME_CONFIG.TOTAL_LEVELS}
              </span>
            </div>
            {/* Progress Bar Container */}
            <div className="relative w-full h-6 sm:h-8 bg-black/60 border-2 border-cyan-500/50 overflow-hidden">
              {/* Progress Fill */}
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 transition-all duration-500 ease-out shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                style={{ width: `${((level - 1) / GAME_CONFIG.TOTAL_LEVELS) * 100}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
              
              {/* Level Markers */}
              <div className="absolute inset-0 flex items-center justify-between px-1">
                {Array.from({ length: GAME_CONFIG.TOTAL_LEVELS }, (_, i) => {
                  const isCompleted = i < level - 1
                  const isCurrent = i === level - 1
                  return (
                    <div
                      key={i}
                      className={`relative z-10 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                        isCompleted
                          ? "bg-cyan-300 shadow-[0_0_8px_rgba(6,182,212,1)]"
                          : isCurrent
                            ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,1)] animate-pulse"
                            : "bg-cyan-500/30"
                      }`}
                    />
                  )
                })}
              </div>
              
              {/* Level Numbers Below */}
              <div className="absolute -bottom-5 left-0 right-0 flex justify-between px-0.5">
                {Array.from({ length: GAME_CONFIG.TOTAL_LEVELS }, (_, i) => (
                  <span
                    key={i}
                    className={`text-[8px] sm:text-[10px] font-mono font-bold transition-all ${
                      i < level - 1
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
          
          {/* QR Scanning Order - Show numbered order (1, 2, 3, 4, 5, 6) */}
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
                    key={`clue${qrNumber}`}
                    className={`px-2 py-1 text-[10px] sm:text-xs font-mono font-bold border transition-all ${
                      isCompleted
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

                {/* Active Hint (Intercepted Message) - Only shown AFTER scan */}
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
                    setTrigger={handleCorrectQR}
                    onScanned={handleQRScan}
                    currentLevel={level}
                  />
                </div>

                {/* Hint History Boxes (Completed Levels Only) */}
                {allHints.some(h => h.status === 'completed') && (
                  <div className="w-full space-y-4">
                    <div className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-500/50 uppercase mb-2 ml-1">
                      TRANSMISSION LOG
                    </div>
                    {allHints
                      .filter(h => h.status === 'completed') // Strictly show only completed hints
                      .reverse()
                      .map((hintObj) => { 
                      return (
                        <div 
                          key={hintObj.level}
                          className="w-full static-overlay border border-cyan-900/30 bg-black/40 backdrop-blur-md p-6 sm:p-8 opacity-70 hover:opacity-100 transition-all duration-300"
                        >
                          <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <span className="text-cyan-800 text-xs font-mono shrink-0">✓</span>
                            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-700 uppercase">
                              Log Entry: Signal {hintObj.level}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm md:text-base font-mono leading-relaxed tracking-wide text-gray-500">
                             &quot;{hintObj.h}&quot;
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

