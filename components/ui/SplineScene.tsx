'use client'

import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="w-24 h-24 rounded-2xl animate-pulse"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
