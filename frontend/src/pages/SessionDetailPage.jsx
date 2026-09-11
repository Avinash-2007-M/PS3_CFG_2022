import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api'

export default function SessionDetailPage() {
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [state, setState] = useState(null)
  const [attestation, setAttestation] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    try {
      const [{ data: sessionResponse }, { data: progressResponse }, { data: attestationResponse }] = await Promise.all([api.get(`/sessions/${sessionId}`), api.get('/progress'), api.get('/attestations')])
      setSession(sessionResponse.session)
      setState(progressResponse.progress.sessionProgress.find((item) => item.sessionId === sessionId))
      setAttestation(attestationResponse.attestations.find((item) => item.sessionId?._id === sessionId || item.sessionId === sessionId) || null)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load this session.')
    }
  }

  useEffect(() => {
    let cancelled = false
    Promise.all([api.get(`/sessions/${sessionId}`), api.get('/progress'), api.get('/attestations')])
      .then(([sessionResponse, progressResponse, attestationResponse]) => {
        if (cancelled) return
        setSession(sessionResponse.data.session)
        setState(progressResponse.data.progress.sessionProgress.find((item) => item.sessionId === sessionId))
        setAttestation(attestationResponse.data.attestations.find((item) => item.sessionId?._id === sessionId || item.sessionId === sessionId) || null)
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.response?.data?.message || 'Unable to load this session.')
      })
    return () => { cancelled = true }
  }, [sessionId])

  const perform = async (action) => {
    setBusy(true)
    setError('')
    try {
      const { data } = await api.post(action)
      if (data.attestation) setAttestation(data.attestation)
      await load()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'That action could not be completed.')
    } finally { setBusy(false) }
  }

  if (error && !session) return <main className="page-shell"><p className="form-error">{error}</p></main>
  if (!session || !state) return <main className="loading-screen">Loading session...</main>
  const locked = state.status === 'locked'
  const completed = state.status === 'completed'
  const attendanceConfirmed = attestation?.attendanceConfirmed
  const completionConfirmed = attestation?.completionConfirmed
  let accessLabel = 'Available'
  if (locked) accessLabel = 'Locked'
  else if (completed) accessLabel = 'Completed'

  return <main className="page-shell"><Link className="back-link" to="/course">← Back to course</Link><article className="session-detail"><div className="session-detail-top"><p className="eyebrow">Session {session.sessionNumber} / WQM</p><span className={`status-badge status-${state.status}`}>{state.status}</span></div><h1>{session.title}</h1><p className="session-lead">{session.description}</p><div className="session-facts"><span>Duration<strong>{session.duration}</strong></span><span>Access<strong>{accessLabel}</strong></span></div>{locked ? <div className="locked-message">🔒 This session is locked. Complete the previous session to unlock it.</div> : <><div className="session-content"><h2>Session content</h2><p>{session.content}</p></div>{completed ? <div className="success-message">✓ Session completed. Trainer verification remains pending.</div> : <div className="attestation-flow">{state.status === 'available' && !attendanceConfirmed && <><p>Attest that you are beginning this WQM session.</p><button className="primary-button" disabled={busy} onClick={() => perform(`/sessions/${sessionId}/start`)}>Start Session</button></>}{state.status === 'in-progress' && !attendanceConfirmed && <><p>I confirm that I am beginning this session.</p><button className="primary-button" disabled={busy} onClick={() => perform(`/attestations/${sessionId}/attendance`)}>I confirm my attendance</button></>}{state.status === 'in-progress' && attendanceConfirmed && !completionConfirmed && <><p>I confirm that I completed this session.</p><button className="primary-button" disabled={busy} onClick={() => perform(`/attestations/${sessionId}/completion`)}>Confirm completion</button></>}{state.status === 'in-progress' && attendanceConfirmed && completionConfirmed && <button className="primary-button" disabled={busy} onClick={() => perform(`/sessions/${sessionId}/complete`)}>Complete Session</button>}{error && <p className="form-error">{error}</p>}</div>}</>}</article></main>
}
