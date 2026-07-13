import { useState, useMemo } from 'react'
import { Send } from 'lucide-react'
import UploadCard from './UploadCard.jsx'
import ScanImagesMenu from './ScanImagesMenu.jsx'
import VitalCard from './VitalCard.jsx'
import { vitalDefs } from '../data/vitals.js'
import { createDiagnosis } from '../api/client'

const DOC_TILES = [
  'Lab Reports',
  'Scan Images',
  'Medical History',
  'Surgery notes',
  'Doctor notes',
  'Clinical Guidelines',
]

export default function CreatePatient({ onSave }) {
  const [form, setForm] = useState({
    name: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    bloodGroup: '',
    allergies: '',
    smoking: 'No',
    drinking: 'No',
    problem: '',
    symptoms: '',

  })
  const [avatar, setAvatar] = useState(null)
  const [saving, setSaving] = useState(false)

  const bmi = useMemo(() => {
    const h = parseFloat(form.height)
    const w = parseFloat(form.weight)
    if (h && w) return (w / Math.pow(h / 100, 2)).toFixed(1)
    return ''
  }, [form.height, form.weight])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatar(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      const aiResult = await createDiagnosis({
        symptoms: form.symptoms,
        medical_history: form.problem || 'None reported',
        patient_name: form.name || 'Unknown',
      })
      onSave({ ...form, bmi, avatar, aiResult })
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Patient details + symptoms */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-5 mb-5 items-start">
        <div className="bg-white rounded-xl2 shadow-soft p-5">
          <h3 className="text-[15.5px] font-bold mb-4">Patient Details</h3>
          <div className="grid grid-cols-[110px_1fr] gap-x-5 gap-y-4">
            <label className="row-span-2 w-[100px] h-[100px] rounded-2xl bg-slate-100 flex items-center justify-center cursor-pointer text-faint text-3xl overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="patient" className="w-full h-full object-cover" />
              ) : (
                '+'
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </label>

            <div>
              <label className="block text-[13px] font-bold mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                className="w-full px-3.5 py-2.5 border-[1.5px] border-line rounded-lg text-[13.5px] outline-none focus:border-indigo-light bg-slate-50/40"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold mb-2">Gender</label>
              <div className="flex gap-5 mt-0.5">
                {['Male', 'Female', 'Others'].map((g) => (
                  <label key={g} className="flex items-center gap-1.5 text-[13.5px] text-muted font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={set('gender')}
                      className="accent-indigo-light w-[15px] h-[15px]"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <div className="col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-4 mt-1">
              <Field label="Age" value={form.age} onChange={set('age')} type="number" />
              <Field label="Height" value={form.height} onChange={set('height')} placeholder="cm" />
              <Field label="Weight" value={form.weight} onChange={set('weight')} placeholder="kg" />
              <Field label="BMI" value={bmi} readOnly />

              <Field label="Blood Group" value={form.bloodGroup} onChange={set('bloodGroup')} placeholder="e.g. O+" />
              <div className="col-span-3">
                <label className="block text-[13px] font-bold mb-2">Allergies</label>
                <input
                  type="text"
                  value={form.allergies}
                  onChange={set('allergies')}
                  placeholder="e.g. Penicillin"
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-line rounded-lg text-[13.5px] outline-none focus:border-indigo-light bg-slate-50/40"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[13px] font-bold mb-2">Smoking</label>
                <div className="flex gap-5">
                  {['Yes', 'No'].map((v) => (
                    <label key={v} className="flex items-center gap-1.5 text-[13.5px] text-muted font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="smoking"
                        value={v}
                        checked={form.smoking === v}
                        onChange={set('smoking')}
                        className="accent-indigo-light w-[15px] h-[15px]"
                      />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-[13px] font-bold mb-2">Drinking</label>
                <div className="flex gap-5">
                  {['Yes', 'No'].map((v) => (
                    <label key={v} className="flex items-center gap-1.5 text-[13.5px] text-muted font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="drinking"
                        value={v}
                        checked={form.drinking === v}
                        onChange={set('drinking')}
                        className="accent-indigo-light w-[15px] h-[15px]"
                      />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl2 shadow-soft p-5 flex flex-col gap-5  h-[450px]">

        {/* Problem */}
        <div>
          <h3 className="text-[15.5px] font-bold mb-4">
            Problem
          </h3>

          <div className="relative min-h-[140px] border-[1.5px] border-line rounded-xl p-3.5 bg-slate-50/40">
            <textarea
              value={form.problem}
              onChange={set('problem')}
              placeholder="Enter patient problem..."
              className="w-full h-full border-none outline-none resize-none bg-transparent text-[13.5px]"
            />

            <button className="absolute bottom-3.5 right-3.5 w-[34px] h-[34px] rounded-full bg-indigo-light flex items-center justify-center">
              <Send className="w-[15px] h-[15px] text-white" fill="white" />
            </button>
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <h3 className="text-[15.5px] font-bold mb-4">
            Symptoms
          </h3>

          <div className="relative min-h-[160px] border-[1.5px] border-line rounded-xl p-3.5 bg-slate-50/40">
            <textarea
              value={form.symptoms}
              onChange={set('symptoms')}
              placeholder="Type symptoms..."
              className="w-full h-full border-none outline-none resize-none bg-transparent text-[13.5px]"
            />

            <button className="absolute bottom-3.5 right-3.5 w-[34px] h-[34px] rounded-full bg-indigo-light flex items-center justify-center">
              <Send className="w-[15px] h-[15px] text-white" fill="white" />
            </button>
          </div>
        </div>

      </div>
        
      </div>

      {/* Upload tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] mb-5">
        {DOC_TILES.map((label) =>
          label === 'Scan Images' ? (
            <ScanImagesMenu key={label} />
          ) : (
            <UploadCard key={label} label={label} />
          )
        )}
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px] mb-6">
        {vitalDefs.map((def) => (
          <VitalCard key={def.key} def={def} />
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 rounded-2xl bg-indigo-light text-white text-[15px] font-bold tracking-wide shadow-soft hover:bg-indigo transition-colors disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, readOnly }) {
  return (
    <div>
      <label className="block text-[13px] font-bold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full px-3.5 py-2.5 border-[1.5px] border-line rounded-lg text-[13.5px] outline-none focus:border-indigo-light bg-slate-50/40"
      />
    </div>
  )
}