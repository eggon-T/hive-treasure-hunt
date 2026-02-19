'use client';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy } from 'lucide-react';

const events = [
  {
    id: 1,
    title: "RC Stunt Show & Expo",
    category: "Motorsports",
    image: "https://images.unsplash.com/photo-1541843058-29472dc0308c?q=80&w=1000&auto=format&fit=crop", // Placeholder
    description: "Witness high-octane RC car stunts and cutting-edge remote control technology.",
    date: "Day 1 - 10:00 AM",
    venue: "Main Arena"
  },
  {
    id: 2,
    title: "Vintage Bike Comp",
    category: "Exhibition",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84f3d?q=80&w=1000&auto=format&fit=crop",
    description: "A showcase of classic engineering and timeless design.",
    date: "Day 1 - 02:00 PM",
    venue: "Expo Grounds"
  },
  {
    id: 3,
    title: "EV Car Expo",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000&auto=format&fit=crop",
    description: "The future of mobility is here. Explore the latest in EV tech.",
    date: "Day 2 - 11:00 AM",
    venue: "Tech Hall"
  },
  {
    id: 4,
    title: "Robotics Expo",
    category: "Robotics",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop",
    description: "Autonomous machines, battle bots, and AI demonstrations.",
    date: "Day 2 - 01:00 PM",
    venue: "Robotics Lab"
  },
    {
    id: 5,
    title: "Esports Arena",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
    description: "Competitive gaming tournaments featuring Valorant, CS:GO, and more.",
    date: "All Days",
    venue: "Gaming Hub"
  },
    {
    id: 6,
    title: "Tech Workshops",
    category: "Learning",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
    description: "Hands-on sessions on AI, Blockchain, and IoT.",
    date: "Day 3",
    venue: "Seminar Hall"
  }
];

export default function EventList() {
  return (
    <section id="events" className="py-24 bg-zinc-950 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-4">
            EVENT <span className="text-cyan-400">PROTOCOL</span>
          </h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                />
                <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur px-3 py-1 border border-white/20 text-xs font-rajdhani font-bold text-cyan-400 uppercase tracking-wider">
                  {event.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-orbitron font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-400 text-sm font-rajdhani mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <div className="flex items-center justify-between text-xs font-mono text-gray-500 border-t border-zinc-800 pt-4 mt-4">
                   <div className="flex items-center gap-1">
                     <Calendar className="w-4 h-4 text-cyan-500" />
                     <span>{event.date}</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <MapPin className="w-4 h-4 text-cyan-500" />
                     <span>{event.venue}</span>
                   </div>
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
