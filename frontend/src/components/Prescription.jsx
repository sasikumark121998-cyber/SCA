import { useState } from 'react'
import { Calendar } from 'lucide-react'

const PATIENT = {
  name: 'Hudson Dylan',
  gender: 'Male',
  age: '49',
  patientId: 'ID:PT-2025-08127',
  height: '175 cm',
  weight: '72kg',
  bmi: '23.5',
  bloodGroup: '0+',
  allergies: 'Penicillin',
  smoking: 'No',
  avatar: 'https://i.pravatar.cc/100?img=32',
}

const HISTORY_ROWS = Array.from({ length: 13 }, (_, i) => ({
  id: '#4355',
  name: 'Michael A. Miner',
  key: i,
}))

const DEFAULT_RX_ROWS = [
  { number: '1', text: 'Lorem Ipsum is simply', m: 1, a: '', e: '', n: '' },
  { number: '2', text: 'Lorem Ipsum is simply', m: '', a: 1, e: '', n: '' },
  { number: '3', text: 'Lorem Ipsum is simply', m: '', a: '', e: 1, n: '' },
  { number: '4', text: 'Lorem Ipsum is simply', m: '', a: '', e: '', n: 1 },
  { number: '5', text: 'Lorem Ipsum is simply', m: '', a: 1, e: '', n: '' },
  { number: '6', text: 'Lorem Ipsum is simply', m: '', a: '', e: 1, n: '' },
]

export default function Prescription() {
  const [rxRows, setRxRows] = useState(DEFAULT_RX_ROWS)

  const updateText = (index, value) => {
    setRxRows((rows) => rows.map((row, i) => (i === index ? { ...row, text: value } : row)))
  }

  const updateNumber = (index, value) => {
    setRxRows((rows) => rows.map((row, i) => (i === index ? { ...row, number: value } : row)))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 items-start">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-5">
        {/* Patient Summary */}
        <div className="bg-white rounded-xl2 shadow-soft p-5">
          <h3 className="text-[15.5px] font-bold mb-4">Patient Summary</h3>
          <div className="flex gap-3.5 mb-4">
            <img
              src={PATIENT.avatar}
              alt={PATIENT.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div>
              <div className="text-[15px] font-bold">{PATIENT.name}</div>
              <div className="text-[11.5px] text-faint my-0.5">
                {PATIENT.gender} - {PATIENT.age} years
              </div>
              <div className="text-[11px] text-faint">{PATIENT.patientId}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 border-t border-line pt-3.5">
            <SummaryField label="Height" value={PATIENT.height} />
            <SummaryField label="Weight" value={PATIENT.weight} />
            <SummaryField label="BMI" value={PATIENT.bmi} />
            <SummaryField label="Blood Group" value={PATIENT.bloodGroup} />
            <SummaryField label="Allergies" value={PATIENT.allergies} />
            <SummaryField label="Smoking" value={PATIENT.smoking} />
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-xl2 shadow-soft p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[15.5px] font-bold">History</h3>
            <button className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center">
              <Calendar className="w-[16px] h-[16px] text-indigo-light" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 px-2 pb-2 text-[13px] font-bold text-ink">
            <div>ID</div>
            <div>Name</div>
          </div>
          <div className="flex flex-col gap-1 max-h-[380px] overflow-y-auto thin-scroll">
            {HISTORY_ROWS.map((row, i) => (
              <div
                key={row.key}
                className={`grid grid-cols-2 gap-2 px-2 py-2.5 rounded-lg text-[13px] text-ink ${
                  i % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                }`}
              >
                <div>{row.id}</div>
                <div>{row.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN — Prescription list */}
      <div className="bg-white rounded-xl2 shadow-soft p-7 min-h-[780px]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[26px] font-bold text-ink">Prescription</h2>
          <button className="text-[15px] font-semibold text-indigo-light">View</button>
        </div>

        <div className="relative">
          {/* column headers */}
          <div className="flex justify-end gap-10 pr-0 mb-6 text-[15px] font-semibold text-ink">
            <span className="w-4 text-center">M</span>
            <span className="w-4 text-center">A</span>
            <span className="w-4 text-center">E</span>
            <span className="w-4 text-center">N</span>
          </div>

          {/* vertical divider lines */}
          {/* <div className="pointer-events-none absolute top-0 right-2 bottom-0 flex justify-end gap-10 pr-0">
            <span className="w-px bg-line" />
            <span className="w-px bg-line" />
            <span className="w-px bg-line" />
            <span className="w-px bg-line" />
          </div> */}

          <div className="flex flex-col gap-8">
            {rxRows.map((row, i) => (
              <div key={i} className="flex justify-between items-center gap-4">
                <div className="flex items-baseline gap-2 flex-1 min-w-0">
                  <div className="flex items-baseline shrink-0">
                    <input
                      type="text"
                      value={row.number}
                      onChange={(e) => updateNumber(i, e.target.value)}
                      className="text-[17px] text-ink bg-transparent border-none outline-none focus:border-b focus:border-indigo-light w-6 text-right"
                    />
                    <span className="text-[17px] text-ink">.</span>
                  </div>
                  <input
                    type="text"
                    value={row.text}
                    onChange={(e) => updateText(i, e.target.value)}
                    className="text-[17px] text-ink bg-transparent border-none outline-none focus:border-b focus:border-indigo-light w-full min-w-0"
                  />
                </div>
                <div className="flex gap-10 pr-2 text-[16px] font-medium text-ink shrink-0">
                  <span className="w-4 text-center">{row.m}</span>
                  <span className="w-4 text-center">{row.a}</span>
                  <span className="w-4 text-center">{row.e}</span>
                  <span className="w-4 text-center">{row.n}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
