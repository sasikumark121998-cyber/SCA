import { useState } from 'react'
import { Eye, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const STATUS_STYLES = {
  Completed: 'text-good',
  'In progress': 'text-amber-500',
  Pending: 'text-orange-500',
}

const SAMPLE_PATIENTS = [
  { id: '#4355', name: 'Michael A. Miner', gender: 'Male', symptoms: 'Fever', doctor: 'Michael Miner', date: '19 Jun 25', status: 'Completed' },
  { id: '#4355', name: 'Michael A. Miner', gender: 'Female', symptoms: 'Headache', doctor: 'Miner', date: '19 Jun 25', status: 'In progress' },
  { id: '#4355', name: 'Michael A. Miner', gender: 'Male', symptoms: 'Cough', doctor: 'Michael Miner', date: '19 Jun 25', status: 'Pending' },
  { id: '#4355', name: 'Michael A. Miner', gender: 'Female', symptoms: 'Fever', doctor: 'Miner', date: '19 Jun 25', status: 'Completed' },
  { id: '#4355', name: 'Michael A. Miner', gender: 'Male', symptoms: 'Cough', doctor: 'Miner', date: '19 Jun 25', status: 'In progress' },
  { id: '#4355', name: 'Michael A. Miner', gender: 'Female', symptoms: 'Headache', doctor: 'Miner', date: '19 Jun 25', status: 'Completed' },
  { id: '#4355', name: 'Michael A. Miner', gender: 'Male', symptoms: 'Fever', doctor: 'Michael Miner', date: '19 Jun 25', status: 'In progress' },
  { id: '#4355', name: 'Michael A. Miner', gender: 'Female', symptoms: 'Cough', doctor: 'Miner', date: '19 Jun 25', status: 'Pending' },
  { id: '#4355', name: 'Michael A. Miner', gender: 'Male', symptoms: 'Headache', doctor: 'Miner', date: '19 Jun 25', status: 'Completed' },
  { id: '#4355', name: 'Michael A. Miner', gender: 'Female', symptoms: 'Fever', doctor: 'Miner', date: '19 Jun 25', status: 'In progress' },
  { id: '#4355', name: 'Michael A. Miner', gender: 'Male', symptoms: 'Cough', doctor: 'Miner', date: '19 Jun 25', status: 'In progress' },
]

const COLUMNS = ['ID', 'Name', 'Gender', 'Symptoms', 'Doctor', 'Date', 'Status', 'Action']

export default function History() {
  const [patients, setPatients] = useState(SAMPLE_PATIENTS.map((p, i) => ({ ...p, key: i })))
  const [page, setPage] = useState(3)
  const totalPages = 45

  const handleDelete = (key) => {
    setPatients((rows) => rows.filter((r) => r.key !== key))
  }

  const handleView = (row) => {
    // hook this up to navigate to the Results view for this patient
    console.log('view patient', row)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[22px] font-bold text-ink">Patient list</h2>
        <button className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center">
          <Calendar className="w-[18px] h-[18px] text-indigo-light" />
        </button>
      </div>

      <div className="bg-transparent">
        {/* header row */}
        <div className="hidden md:grid grid-cols-[90px_1.4fr_0.9fr_1fr_1.2fr_1fr_1fr_0.9fr] gap-2 px-6 pb-3 text-[13px] font-bold text-ink">
          {COLUMNS.map((col) => (
            <div key={col} className={col === 'Action' ? 'text-center' : ''}>
              {col}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {patients.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-2 md:grid-cols-[90px_1.4fr_0.9fr_1fr_1.2fr_1fr_1fr_0.9fr] gap-2 items-center bg-white rounded-2xl shadow-soft px-6 py-4 text-[13.5px] text-ink"
            >
              <div className="font-medium">{row.id}</div>
              <div>{row.name}</div>
              <div>{row.gender}</div>
              <div>{row.symptoms}</div>
              <div>{row.doctor}</div>
              <div>{row.date}</div>
              <div className={`font-semibold ${STATUS_STYLES[row.status]}`}>{row.status}</div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleView(row)}
                  className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center hover:bg-indigo-100 transition-colors"
                  title="View"
                >
                  <Eye className="w-[15px] h-[15px] text-indigo-light" />
                </button>
                <button
                  onClick={() => handleDelete(row.key)}
                  className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center hover:bg-rose-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-[15px] h-[15px] text-indigo-light" />
                </button>
              </div>
            </div>
          ))}

          {patients.length === 0 && (
            <div className="bg-white rounded-2xl shadow-soft px-6 py-10 text-center text-faint text-sm">
              No patient records on this page.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-slate-50"
        >
          <ChevronLeft className="w-4 h-4 text-indigo-light" />
        </button>
        <span className="text-[13px] font-semibold text-ink">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-slate-50"
        >
          <ChevronRight className="w-4 h-4 text-indigo-light" />
        </button>
      </div>
    </div>
  )
}
