import { Droplet, Heart, Activity, Zap, } from 'lucide-react'

export const vitalDefs = [
  { key: 'bp', label: 'Blood Pressure', unit: 'mmHg', icon: Droplet, color: 'text-sky-500' },
  { key: 'hr', label: 'Heart Rate', unit: 'bpm', icon: Heart, color: 'text-rose-500' },
  { key: 'bc', label: 'Blood Count', unit: 'mmHg', icon: Activity, color: 'text-emerald-500' },
  { key: 'gl', label: 'Glucose Level', unit: 'mg/dl', icon: Zap, color: 'text-sky-500' },
]

export const emptyVitals = {}

export const sampleResultVitals = {
  bp: '116/70', bp_num: '116',
  hr: '80-90', hr_num: '116',
  bc: '116/70', bc_num: '116',
  gl: '230', gl_num: '116',
}
