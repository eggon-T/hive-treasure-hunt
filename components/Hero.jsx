'use client';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Gradients/Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black opacity-50" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      {/* Liquid Metal / Chrome Effect (Abstract Shapes) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-3xl"
      />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <h2 className="text-cyan-400 font-rajdhani font-bold tracking-[0.3em] text-lg md:text-xl mb-4 uppercase">
            Initiating System Sequence...
          </h2>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold font-orbitron tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-6"
        >
          HYVE
          <span className="block text-4xl md:text-6xl lg:text-7xl mt-2 text-gray-400 font-rajdhani font-light tracking-wide">
            SEASON 1
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-gray-400 font-rajdhani text-lg md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Experience the convergence of technology and adrenaline.
          <br />
          Where code meets chaos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            href="#events"
            className="group relative px-8 py-4 bg-white text-black font-orbitron font-bold tracking-wider hover:bg-cyan-400 transition-colors duration-300 clip-path-polygon"
          >
            EXPLORE EVENTS
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 transition-all duration-300" />
            <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/register" 
            className="px-8 py-4 border border-white/20 text-white font-orbitron font-bold tracking-wider hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            REGISTER NOW
          </Link>
        </motion.div>
      </div>
      
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </section>
  );
}
