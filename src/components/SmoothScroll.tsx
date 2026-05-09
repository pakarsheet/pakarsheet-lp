"use client"

import { ReactLenis } from 'lenis/react'
import { ReactNode } from 'react'

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ 
      lerp: 0.08,       // lebih responsif (default 0.1)
      duration: 1.0,    // lebih ringan (sebelumnya 1.5)
      smoothWheel: true,
    }}>
      {children}
    </ReactLenis>
  )
}
