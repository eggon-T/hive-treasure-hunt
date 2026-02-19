'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Fingerprint, Scan, ShieldAlert } from 'lucide-react';
import { StaticBackground } from '@/components/static-background';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center">
      <StaticBackground />
      
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-black to-black opacity-80" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />

      <div className="relative z-10 w-full max-w-5xl px-4 text-center">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">System Online</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold font-orbitron tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-900 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-2">
            HYVE
          </h1>
          <h2 className="text-2xl md:text-4xl font-light font-rajdhani text-cyan-500 tracking-[0.5em] uppercase text-glow">
            Treasure Hunt
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 font-rajdhani text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Decipher the code. Follow the signal. <br />
          The ultimate test of logic and exploration awaits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            href="/login"
            className="group relative px-8 py-4 bg-cyan-600 text-white font-orbitron font-bold tracking-wider hover:bg-cyan-500 transition-all duration-300 clip-path-polygon shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
          >
            ENTER THE HUNT
            <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/instruction" 
            className="px-8 py-4 border border-cyan-500/30 text-cyan-400 font-orbitron font-bold tracking-wider hover:bg-cyan-500/10 transition-all duration-300 backdrop-blur-sm"
          >
            MISSION BRIEF
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left"
        >
          <div className="p-6 border border-cyan-900/30 bg-black/40 backdrop-blur hover:border-cyan-500/50 transition-colors group">
            <Scan className="w-8 h-8 text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-orbitron text-lg mb-2">Scan & Decode</h3>
            <p className="text-gray-400 text-sm font-rajdhani">Locate hidden QR codes across the sector. Intercept the transmission.</p>
          </div>
          <div className="p-6 border border-cyan-900/30 bg-black/40 backdrop-blur hover:border-cyan-500/50 transition-colors group">
            <Fingerprint className="w-8 h-8 text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-orbitron text-lg mb-2">Secure Access</h3>
            <p className="text-gray-400 text-sm font-rajdhani">Login with your operative credentials to track your progress.</p>
          </div>
          <div className="p-6 border border-cyan-900/30 bg-black/40 backdrop-blur hover:border-cyan-500/50 transition-colors group">
            <ShieldAlert className="w-8 h-8 text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-orbitron text-lg mb-2">Race Against Time</h3>
            <p className="text-gray-400 text-sm font-rajdhani">Compete against other squads. Speed is your only ally.</p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 w-full text-center">
        <p className="text-[10px] font-mono text-cyan-900 uppercase tracking-widest">
          System v2.0.4 | Secure Connection Established
        </p>
      </div>
    </main>
  );
}
