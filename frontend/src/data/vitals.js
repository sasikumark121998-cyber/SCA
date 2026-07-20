import { Droplet, Heart, Activity, Zap, } from 'lucide-react'

export const vitalDefs = [
  { key: 'bp', label: 'Blood Pressure', unit: 'mmHg', icon: Droplet, color: 'text-sky-500' },
  { key: 'hr', label: 'Heart Rate', unit: 'bpm', icon: Heart, color: 'text-rose-500' },
  { key: 'bc', label: 'Blood Count', unit: 'g/dl', icon: Activity, color: 'text-emerald-500' },
  { key: 'gl', label: 'Glucose Level', unit: 'mg/dl', icon: Zap, color: 'text-sky-500' },
]

export const emptyVitals = {}

export const sampleResultVitals = {
  bp: '116/70', bp_num: '116',
  hr: '80-90', hr_num: '116',
  bc: '116/70', bc_num: '116',
  gl: '230', gl_num: '116',
}

// Real-life reference ranges by gender.
// bp uses systolic (first number) for status checks.
export const NORMAL_RANGES = {
  bp: {
    Male:   { low: 90,   normalMax: 120,  highMin: 130 }, // systolic mmHg
    Female: { low: 90,   normalMax: 120,  highMin: 130 },
    Others: { low: 90,   normalMax: 120,  highMin: 130 },
  },
  hr: {
    Male:   { low: 60,  normalMax: 100, highMin: 101 }, // bpm
    Female: { low: 60,  normalMax: 100, highMin: 101 },
    Others: { low: 60,  normalMax: 100, highMin: 101 },
  },
  bc: {
    Male:   { low: 13.5, normalMax: 17.5, highMin: 17.6 }, // hemoglobin g/dl
    Female: { low: 12.0, normalMax: 15.5, highMin: 15.6 },
    Others: { low: 12.0, normalMax: 17.5, highMin: 17.6 },
  },
  gl: {
    Male:   { low: 70, normalMax: 99, highMin: 126 }, // fasting mg/dl
    Female: { low: 70, normalMax: 99, highMin: 126 },
    Others: { low: 70, normalMax: 99, highMin: 126 },
  },
}

// Returns 'Low' | 'Normal' | 'Medium' | 'High'
export function getVitalStatus(key, numericValue, gender) {
  if (numericValue === '' || numericValue === null || numericValue === undefined || isNaN(numericValue)) {
    return null
  }
  const genderKey = gender === 'Male' || gender === 'Female' ? gender : 'Others'
  const range = NORMAL_RANGES[key]?.[genderKey]
  if (!range) return null

  const v = parseFloat(numericValue)
  if (v < range.low) return 'Low'
  if (v <= range.normalMax) return 'Normal'
  if (v < range.highMin) return 'Medium'
  return 'High'
}