import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/authContext.js'
import api from '../services/api'
import ProgressSummary from '../components/ProgressSummary.jsx'
import SessionCard from '../components/SessionCard.jsx'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [courseData, setCourseData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/progress').then(({ data }) => setCourseData(data)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load your WQM progress.'))
  }, [])

  return (
    <main className="dashboard-shell">
      <nav className="topbar"><span className="brand">WQC / FIELDNOTE</span><button className="text-button" onClick={logout}>Sign out</button></nav>
      <section className="dashboard-hero">
        <p className="eyebrow">Your champion profile</p>
        <h1>Welcome, {user.name}.</h1>
        <p>Your account is connected to the Water Quality Champions platform.</p>
      </section>
      <section className="profile-grid">
        <article><span className="card-label">Role</span><strong>{user.role}</strong><p>Access will grow as your journey progresses.</p></article>
        <article><span className="card-label">Location</span><strong>{user.location || 'Not added yet'}</strong><p>Update your profile when you are ready.</p></article>
        <article><span className="card-label">Organization</span><strong>{user.organization || 'Not added yet'}</strong><p>Your field context helps the community connect.</p></article>
      </section>
      <section className="dashboard-course-section">
        {error && <p className="form-error">{error}</p>}
        {courseData && <>
          <ProgressSummary data={courseData} />
          <div className="dashboard-section-heading"><div><p className="eyebrow">Course map</p><h2>All sessions</h2></div><Link className="secondary-button" to="/resources">View resources</Link></div>
          <div className="session-list session-list-dashboard">{courseData.sessions.map((session) => <SessionCard key={session._id} session={session} state={courseData.progress.sessionProgress.find((item) => item.sessionId === session._id)} />)}</div>
        </>}
      </section>
    </main>
  )
}
