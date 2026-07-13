import { useState } from 'react'
import { Eye, EyeOff, Check } from 'lucide-react'
import medicalBg from '../assets/c.jpg'
import { loginUser, registerUser } from '../api/client'

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState('signin') // 'signup' | 'signin'
  const isSignUp = mode === 'signup'

  const [mobileOrEmail, setMobileOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saveDetails, setSaveDetails] = useState(true)
  const [error, setError] = useState('')

  const handleMobileOrEmailChange = (e) => {
    const val = e.target.value
    // if it's purely numeric, cap at 10 digits (mobile number)
    if (/^\d*$/.test(val)) {
      if (val.length <= 10) setMobileOrEmail(val)
    } else {
      setMobileOrEmail(val)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mobileOrEmail)
    const isMobile = /^\d{10}$/.test(mobileOrEmail)

    if (!isEmail && !isMobile) {
      setError('Enter a valid 10-digit mobile number or email address')
      return
    }

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          return
        }
        await registerUser({ username: mobileOrEmail, email: mobileOrEmail, password })
        setMode('signin')
        return
      }
      const data = await loginUser({ email: mobileOrEmail, password })
      localStorage.setItem('token', data.access_token)
      onAuthenticated?.({ mode, mobileOrEmail })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-appbg flex items-center justify-center p-6">
      <div className="relative w-full max-w-[1170px] aspect-[16/7.4] rounded-[28px] overflow-hidden shadow-2xl">
        {/* Background photo — drop your own image path into the src below */}
        <img
          src={medicalBg}
          alt="medical background"
          className="absolute inset-0 w-full h-full object-cover bg-slate-200"
        />

        {/* Centered glass card */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="w-full max-w-[415px] bg-gradient-to-b from-white/50 via-cyan-50/40 to-cyan-100/30 backdrop-blur-md border border-indigo/50 rounded-2xl shadow-xl px-10 py-9 flex flex-col">
            <h1 className="text-[22px] font-bold tracking-[0.12em] text-indigo mb-1.5">
              {isSignUp ? 'GET STARTED' : "LET'S GET STARTED"}
            </h1>
            <div className="w-[200px] h-[2px]  mb-7" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={mobileOrEmail}
                onChange={handleMobileOrEmailChange}
                placeholder={isSignUp ? 'Mobile No / Mail ID' : 'Mobile NO / Mail ID'}
                className="w-full px-4 py-3 rounded-lg bg-white/90 border border-slate-200 text-[13px] text-ink placeholder:text-faint outline-none focus:border-indigo-light transition-colors"
              />

              <div>
                <PasswordField
                  value={password}
                  onChange={setPassword}
                  show={showPassword}
                  setShow={setShowPassword}
                  placeholder={isSignUp ? 'Create Password' : 'Password'}
                />
                {!isSignUp && (
                  <div className="text-right mt-1.5">
                    <button type="button" className="text-[11px] text-indigo underline underline-offset-2">
                      Forget Password
                    </button>
                  </div>
                )}
              </div>

              {isSignUp && (
                <PasswordField
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showConfirm}
                  setShow={setShowConfirm}
                  placeholder="Comfirm Password"
                />
              )}

              {isSignUp && (
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <span
                    onClick={(e) => {
                      e.preventDefault()
                      setSaveDetails((s) => !s)
                    }}
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      saveDetails ? 'bg-indigo' : 'bg-slate-300'
                    }`}
                  >
                    {saveDetails && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </span>
                  <span className="text-[12px] text-ink">Save Details</span>
                </label>
              )}

              {error && (
                <p className="text-[12px] text-red-600 text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-indigo text-white text-[13px] font-bold tracking-[0.15em] shadow-lg hover:bg-indigo-light transition-colors mt-1"
              >
                {isSignUp ? 'SIGN UP' : 'SIGN IN'}
              </button>
            </form>

            {/* toggle row at the bottom of the card */}
            <div className="flex items-center justify-center gap-3.5 mt-9">
              <span
                onClick={() => setMode('signup')}
                className={`cursor-pointer tracking-wide transition-all ${
                  isSignUp ? 'text-indigo text-[17px] font-extrabold' : 'text-indigo/70 text-[13px] font-bold'
                }`}
              >
                SIGN UP
              </span>

              <button
                type="button"
                onClick={() => setMode(isSignUp ? 'signin' : 'signup')}
                className="w-[52px] h-[26px] rounded-full bg-indigo flex items-center px-1 transition-colors shrink-0"
              >
                <span
                  className={`w-[18px] h-[18px] rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                    isSignUp ? 'translate-x-0' : 'translate-x-[26px]'
                  }`}
                />
              </button>

              <span
                onClick={() => setMode('signin')}
                className={`cursor-pointer tracking-wide transition-all ${
                  !isSignUp ? 'text-indigo text-[17px] font-extrabold' : 'text-indigo/70 text-[13px] font-bold'
                }`}
              >
                SIGN IN
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PasswordField({ value, onChange, show, setShow, placeholder }) {
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-11 rounded-lg bg-white/90 border border-slate-200 text-[13px] text-ink placeholder:text-faint outline-none focus:border-indigo-light transition-colors"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-indigo-light"
      >
        {show ? <Eye className="w-[16px] h-[16px]" /> : <EyeOff className="w-[16px] h-[16px]" />}
      </button>
    </div>
  )
}