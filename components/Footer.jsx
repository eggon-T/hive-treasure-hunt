export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 py-12 relative overflow-hidden">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
       
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="space-y-4">
             <h3 className="text-2xl font-orbitron font-bold text-white">
               HYVE<span className="text-cyan-400">.S1</span>
             </h3>
             <p className="text-gray-400 font-rajdhani text-sm">
               The ultimate convergence of tech, gaming, and innovation. 
               Join us for Season 1.
             </p>
           </div>
           
           <div className="space-y-4">
             <h4 className="text-lg font-orbitron font-semibold text-white">QUICK LINKS</h4>
             <ul className="space-y-2 font-rajdhani text-gray-400">
               <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
               <li><a href="#" className="hover:text-cyan-400 transition-colors">Events</a></li>
               <li><a href="#" className="hover:text-cyan-400 transition-colors">Schedule</a></li>
               <li><a href="#" className="hover:text-cyan-400 transition-colors">Register</a></li>
             </ul>
           </div>
           
           <div className="space-y-4">
             <h4 className="text-lg font-orbitron font-semibold text-white">CONTACT</h4>
             <ul className="space-y-2 font-rajdhani text-gray-400">
               <li>techfest@hyve.com</li>
               <li>+1 234 567 890</li>
               <li>Campus Arena, Tech City</li>
             </ul>
           </div>
         </div>
         
         <div className="border-t border-zinc-900 mt-12 pt-8 text-center sm:flex sm:justify-between items-center">
           <p className="text-gray-600 font-mono text-xs">
             © 2024 HYVE SEASON 1. ALL RIGHTS RESERVED.
           </p>
           <p className="text-gray-600 font-mono text-xs mt-4 sm:mt-0">
             INITIALIZING PROTOCOL V1.0
           </p>
         </div>
       </div>
    </footer>
  );
}
