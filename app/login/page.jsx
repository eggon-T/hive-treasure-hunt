"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/config"
import { StaticBackground } from "@/components/static-background"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAttempts((prev) => prev + 1)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/instruction")
    } catch (error) {
       alert("Access Denied: Invalid Credentials") // Simple alert for now, can be improved
       setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden font-rajdhani">
      <StaticBackground />

      <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

      <div className="relative z-20 min-h-screen flex flex-col items-center p-4 sm:p-6">
        <div className="w-full max-w-md flex justify-between items-center mb-8 sm:mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 min-h-[44px] font-mono text-xs tracking-wider text-muted-foreground hover:text-cyan-400 active:text-cyan-600 transition-colors group"
          >
            <span className="text-cyan-500 group-hover:text-glow transition-all duration-200">←</span>
            <span>RETURN</span>
          </Link>

          <div className="font-mono text-[10px] sm:text-xs tracking-wider text-muted-foreground">
            <span className="hidden sm:inline">ACCESS ATTEMPTS: </span>
            <span className="sm:hidden">ATT: </span>
            <span className="text-cyan-500 signal-pulse">{attempts.toString().padStart(3, "0")}</span>
          </div>
        </div>

        <div className="max-w-md w-full space-y-6 sm:space-y-8 fade-in-interference">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-cyan-500 signal-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <h2 className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-500 text-glow uppercase">
                Secure Terminal
              </h2>
              <div className="w-2 h-2 rounded-full bg-cyan-500 signal-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-orbitron font-bold text-white">
              ACCESS
            </h1>
            <p className="text-xs sm:text-sm font-mono text-muted-foreground tracking-wide">
              Enter credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="static-overlay border border-cyan-500/30 p-6 sm:p-8 bg-black/40 backdrop-blur-md space-y-5 sm:space-y-6 hover:border-cyan-500/50 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              {/* Email field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="input-label text-cyan-400/70"
                >
                  User ID
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input border-cyan-900 focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] text-white"
                  placeholder="user@hyve.net"
                  autoComplete="email"
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="input-label text-cyan-400/70"
                >
                  Access Code
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input border-cyan-900 focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] text-white"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] sm:min-h-[52px] p-4 bg-cyan-600 text-white font-orbitron font-bold text-sm tracking-widest uppercase border border-cyan-400 hover:bg-cyan-500 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </span>
                ) : (
                  <span className="relative z-10">AUTHENTICATE</span>
                )}
                {!loading && (
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-300" />
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/signup"
                className="inline-block min-h-[44px] flex items-center justify-center text-xs font-mono tracking-wide text-gray-400 hover:text-cyan-400 active:text-cyan-600 transition-colors"
              >
                <span className="text-cyan-500">[</span> Request new credentials{" "}
                <span className="text-cyan-500">]</span>
              </Link>
            </div>
          </form>

          {/* Security notice */}
          <div className="pt-2 sm:pt-4 text-center animate-fade-in">
            <p className="text-[10px] font-mono text-cyan-900/60 tracking-wide leading-relaxed uppercase">
              All access is monitored and logged.
              <br />
              Unauthorized attempts will be traced.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
