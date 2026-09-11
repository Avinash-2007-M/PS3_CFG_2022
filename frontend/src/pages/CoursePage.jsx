import { useEffect, useState } from 'react'
import api from '../services/api'
import SessionCard from '../components/SessionCard.jsx'

export default function CoursePage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/progress').then(({ data: response }) => setData(response)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load your course.'))
  }, [])

  if (error) return <main className="page-shell"><p className="form-error">{error}</p></main>
  if (!data) return <main className="loading-screen">Loading your WQM course...</main>

  return <main className="page-shell"><header className="page-header"><p className="eyebrow">Learning path</p><h1>{data.course.title}</h1><p>{data.course.description}</p></header><section className="course-progress-strip"><strong>{data.progress.completedSessions} / {data.course.totalSessions} sessions completed</strong><span>{data.progress.progressPercentage}% complete</span><div className="progress-track"><span style={{ width: `${data.progress.progressPercentage}%` }} /></div></section><section className="session-list">{data.sessions.map((session) => <SessionCard key={session._id} session={session} state={data.progress.sessionProgress.find((item) => item.sessionId === session._id)} />)}</section></main>
}
