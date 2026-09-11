import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/authContext.js'

export default function AuthPage() {
  const isRegister = useLocation().pathname === '/register'
  const navigate = useNavigate()
  const { authenticate } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '', organization: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  let submitLabel = 'Sign in'
  if (submitting) submitLabel = 'Connecting...'
  else if (isRegister) submitLabel = 'Create account'

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      let endpoint = '/auth/login'
      if (isRegister) endpoint = '/auth/register'
      const { data } = await api.post(endpoint, form)
      authenticate(data)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to connect to the server.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-intro">
        <p className="eyebrow">INREM / WATER QUALITY CHAMPIONS</p>
        <h1>Knowledge becomes action when champions move together.</h1>
        <p>Keep your learning journey, field work, and community connections in one place.</p>
      </section>
      <section className="auth-panel">
        <p className="eyebrow">{isRegister ? 'Create your account' : 'Welcome back'}</p>
        <h2>{isRegister ? 'Join the champion network' : 'Sign in to your journey'}</h2>
        <form onSubmit={submit}>
          {isRegister && <label>Name<input name="name" value={form.name} onChange={updateField} required autoComplete="name" /></label>}
          <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={updateField} required minLength="8" autoComplete={isRegister ? 'new-password' : 'current-password'} /></label>
          {isRegister && <>
            <label>Location<input name="location" value={form.location} onChange={updateField} autoComplete="address-level2" /></label>
            <label>Organization<input name="organization" value={form.organization} onChange={updateField} /></label>
          </>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" type="submit" disabled={submitting}>{submitLabel}</button>
        </form>
        <p className="auth-switch">{isRegister ? 'Already a champion?' : 'New to the network?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
      </section>
    </main>
  )
}
