import { Link } from 'react-router-dom'

export default function ProgressSummary({ data, compact = false }) {
  const { course, progress, sessions } = data
  const currentSession = sessions.find((session) => session.sessionNumber === progress.currentSession)
  const currentState = currentSession && progress.sessionProgress.find((item) => item.sessionId === currentSession._id)

  return (
    <section className={`journey-card ${compact ? 'journey-card-compact' : ''}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your WQM Journey</p>
          <h2>{course.title}</h2>
        </div>
        <span className="progress-number">{progress.completedSessions} / {course.totalSessions}</span>
      </div>
      <p className="journey-description">{course.description}</p>
      <div className="progress-track" aria-label={`${progress.progressPercentage}% complete`}><span style={{ width: `${progress.progressPercentage}%` }} /></div>
      <div className="progress-meta"><strong>{progress.progressPercentage}% Complete</strong><span>{progress.completedSessions} sessions completed</span></div>
      {currentSession && currentState?.status !== 'completed' && <div className="current-session-row"><div><span className="card-label">Current Session</span><strong>Session {currentSession.sessionNumber}: {currentSession.title}</strong></div><Link className="primary-button small-button" to={`/course/${currentSession._id}`}>{currentState?.status === 'in-progress' ? 'Continue Session' : 'Start Session'}</Link></div>}
      {!compact && <Link className="secondary-button" to="/course">View full course</Link>}
    </section>
  )
}
