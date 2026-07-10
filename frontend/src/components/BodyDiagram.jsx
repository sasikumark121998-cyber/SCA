import { MapPin } from 'lucide-react'

export default function BodyDiagram() {
  return (
    <div className="relative flex justify-center pt-2">
      <svg viewBox="0 0 200 400" className="w-full max-w-[230px]">
        <circle cx="100" cy="35" r="24" fill="#e7c9b0" />
        <path d="M75 55 Q100 70 125 55 L128 90 Q100 105 72 90 Z" fill="#e7c9b0" />
        <path d="M60 90 Q100 110 140 90 L150 200 Q100 220 50 200 Z" fill="#d7a980" />
        <path d="M60 90 L35 180 L45 185 L65 105 Z" fill="#d7a980" />
        <path d="M140 90 L165 180 L155 185 L135 105 Z" fill="#d7a980" />
        <path d="M35 180 L28 260 L42 262 L48 185 Z" fill="#e7c9b0" />
        <path d="M165 180 L172 260 L158 262 L152 185 Z" fill="#e7c9b0" />
        <path d="M65 200 L60 300 L85 300 L90 215 Z" fill="#d7a980" />
        <path d="M135 200 L140 300 L115 300 L110 215 Z" fill="#d7a980" />
        <path d="M60 300 L55 380 L75 380 L82 305 Z" fill="#e7c9b0" />
        <path d="M140 300 L145 380 L125 380 L118 305 Z" fill="#e7c9b0" />
        <circle cx="100" cy="95" r="4" fill="#332a8c" />
      </svg>
      <div className="absolute top-3 left-[calc(50%+8px)] w-[26px] h-[26px] rounded-full bg-indigo-light flex items-center justify-center shadow-lg">
        <MapPin className="w-[13px] h-[13px] text-white" fill="white" />
      </div>
    </div>
  )
}
