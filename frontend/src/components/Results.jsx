import { useState } from 'react'
import { Send, Stethoscope, FileText, ScanLine, History, Scissors, ClipboardList, BookOpen } from 'lucide-react'
import VitalCard from './VitalCard.jsx'
import { vitalDefs } from '../data/vitals.js'
import bodyDiagram from "../assets/b.png";

const inputSummaryItems = (symptoms) => [
  { icon: Stethoscope, title: 'Symptoms', sub: symptoms || 'Fever, Headache, Fatigue, Dry cough' },
  { icon: FileText, title: 'Lab Reports', sub: 'CBC, CRP, Liver Function, etc.' },
  { icon: ScanLine, title: 'X-ray / CT / MRI images', sub: 'X-ray / CT / MRI images' },
  { icon: History, title: 'Medical History', sub: 'Hypertension (5 yrs), No diabetes' },
  { icon: Scissors, title: 'Surgery notes', sub: symptoms || 'Fever, Headache, Fatigue, Dry cough' },
  { icon: ClipboardList, title: 'Doctor notes', sub: symptoms || 'Fever, Headache, Fatigue, Dry cough' },
  { icon: BookOpen, title: 'Clinical Guidelines', sub: 'IDSA Guidelines, WHO Protocols' },
]

export default function Results({ patient }) {
  const [query, setQuery] = useState('')

  const p = patient || {
    name: 'Hudson Dylan',
    gender: 'Male',
    age: '49',
    height: '175',
    weight: '72',
    bmi: '23.5',
    bloodGroup: 'O+',
    allergies: 'Penicillin',
    smoking: 'No',
    symptoms: 'Fever, Headache, Fatigue, Dry cough',
    avatar: 'https://i.pravatar.cc/100?img=32',
  }

  const ai = p.aiResult

  const problemStatement = `"${p.name}" presents with: ${
    p.symptoms || 'reported symptoms'
  }. Reported allergies: ${
    p.allergies || 'none reported'
  }. Clinical correlation with lab and imaging data is recommended before finalizing management.`

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_200px] gap-2 mb-4 items-start">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-[4px]">
          <div className="bg-white rounded-xl2 shadow-soft p-4 ">
            <h3 className="text-[15.5px] font-bold mb-4">Patient Summary</h3>
            <div className="flex gap-3.5 mb-4">
              <img
                src={p.avatar || 'https://i.pravatar.cc/100?img=32'}
                alt={p.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div>
                <div className="text-[15px] font-bold">{p.name}</div>
                <div className="text-[11.5px] text-faint my-0.5">
                  {p.gender || '--'} - {p.age || '--'} years
                </div>
                <div className="text-[11px] text-faint">{p.patientId || 'ID:PT-2025-08127'}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-line pt-3.5">
              <SummaryField label="Height" value={p.height ? `${p.height} cm` : '--'} />
              <SummaryField label="Weight" value={p.weight ? `${p.weight}kg` : '--'} />
              <SummaryField label="BMI" value={p.bmi || '--'} />
              <SummaryField label="Blood Group" value={p.bloodGroup || '--'} />
              <SummaryField label="Allergies" value={p.allergies || 'None'} />
              <SummaryField label="Smoking" value={p.smoking || 'No'} />
            </div>
          </div>

          <div className="bg-white rounded-xl2 shadow-soft p-3">
            <h3 className="text-[15.5px] font-bold mb-4">Input Summary</h3>
            <div className="flex flex-col gap-2">
              {inputSummaryItems(p.symptoms).map((item) => (
                <div key={item.title} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                  <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                    <item.icon className="w-[17px] h-[17px] text-indigo-light" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-bold text-ink">{item.title}</div>
                    <div className="text-[10.5px] text-faint truncate">{item.sub}</div>
                  </div>
                  <button className="text-[11.5px] font-bold text-indigo-light shrink-0">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN */}
        <div className="bg-white rounded-xl2 shadow-soft p-5 flex flex-col gap-3.5 min-h-[730px]">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-faint">Write the patient query....</span>
            <button className="text-xs font-bold text-indigo-light">Note</button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Write the patient query...."
              className="w-full px-4 py-3 pr-12 border-[1.5px] border-line rounded-xl text-[13.5px] outline-none"
            />
            <button className="absolute right-2 top-1.5 w-[34px] h-[34px] rounded-full bg-indigo-light flex items-center justify-center">
              <Send className="w-[15px] h-[15px] text-white" fill="white" />
            </button>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl p-4 text-[14.5px] font-normal leading-relaxed text-ink whitespace-pre-wrap overflow-y-auto thin-scroll">
            {ai ? ai.diagnosis : 'AI clinical insights and recommendations will appear here once the query is submitted...'}
          </div>
        </div>

        
        {/* RIGHT COLUMN */}
          <div className="bg-white rounded-xl2 shadow-soft p-4 w-full max-w-[220px] ml-auto min-h-[720px] ">
            <h3 className="text-[14px] font-bold mb-3">
              Problem Statement/
            </h3>

            <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-muted italic leading-relaxed">
              {problemStatement}
            </div>

            <div className="mt-4 flex justify-center">
              <img
                src={bodyDiagram}
                alt="Body Diagram"
                className="w-[170px] h-[409px] object-contain"
              />
            </div>

            <button className="mt-3 mx-auto flex gap-10 px-4 py-8 rounded-full bg-slate-50 text-xs font-bold text-indigo-light">
              &lsaquo; Rotate &rsaquo;
            </button>
          </div>
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
        {vitalDefs.map((def) => (
          <VitalCard
            key={def.key}
            def={def}
            gender={p.gender}
            value={p.vitals?.[def.key]}
            num={p.vitals?.[`${def.key}_num`]}
          />
        ))}
      </div>
    </div>
  )
}

function SummaryField({ label, value }) {
  return (
    <div>
      <span className="block text-[11px] text-faint mb-0.5">{label}</span>
      <span className="block text-[12.5px] font-bold text-ink">{value}</span>
    </div>
  )
}