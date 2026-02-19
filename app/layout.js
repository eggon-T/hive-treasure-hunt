import { Orbitron, Rajdhani } from 'next/font/google'
import './globals.css'
import { UserDetails } from './context'

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const rajdhani = Rajdhani({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

export const metadata = {
  title: 'HYVE SEASON 1 | Tech Fest',
  description: 'The ultimate tech fest experience.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${rajdhani.variable} antialiased`}>
        <UserDetails>
          {children}
        </UserDetails>
      </body>
    </html>
  )
}
