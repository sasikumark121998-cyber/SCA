import { useState } from 'react'
import Auth from './components/Auth.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import CreatePatient from './components/CreatePatient.jsx'
import Results from './components/Results.jsx'
import History from './components/History.jsx'
import Prescription from './components/Prescription.jsx'
import Placeholder from './components/Placeholder.jsx'

const TITLES = {
  create: 'Welcome !!!',
  results: 'Smart Clinical Advisor',
  prescription: 'Smart Clinical Advisor',
  history: 'Smart Clinical Advisor',
  ai: 'AI Analysis',
  help: 'Help',
}

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [view, setView] = useState('create')
  const [patient, setPatient] = useState(null)

  const handleSave = (formData) => {
    setPatient({
      ...formData,
      patientId: 'ID:PT-' + Math.floor(2000000 + Math.random() * 7999999),
    })
    setView('results')
  }

  const handleLogout = () => {
    setIsAuthed(false)
    setView('create')
    setPatient(null)
  }

  if (!isAuthed) {
    return <Auth onAuthenticated={() => setIsAuthed(true)} />
  }

  return (
    <div className="flex min-h-screen bg-appbg">
      <Sidebar view={view} setView={setView} onLogout={handleLogout} />

      <div className="flex-1 min-w-0 p-8 lg:p-10">
        <Topbar title={TITLES[view]} />

        {view === 'create' && <CreatePatient onSave={handleSave} />}
        {view === 'results' && <Results patient={patient} />}
        {view === 'history' && <History />}
        {view === 'prescription' && <Prescription />}
        {!['create', 'results', 'history', 'prescription'].includes(view) && (
          <Placeholder label={TITLES[view]} />
        )}
      </div>
    </div>
  )
}
