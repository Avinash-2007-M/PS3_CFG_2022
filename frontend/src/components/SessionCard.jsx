import { Link } from 'react-router-dom'

const statusDetails = {
  completed: { icon: '✓', label: 'Completed' },
  'in-progress': { icon: '→', label: 'In progress' },
  available: { icon: '→', label: 'Available' },
  locked: { icon: '🔒', label: 'Locked' },
}

export default function SessionCard({ session, state }) {
  const details = statusDetails[state?.status || 'locked']
  const canOpen = ['available', 'in-progress', 'completed'].includes(state?.status)
  const content = <><span className={`session-icon status-${state?.status}`}>{details.icon}</span><div><span className="session-kicker">Session {session.sessionNumber}</span><strong>{session.title}</strong><span className="session-status">{details.label}</span></div></>

  return canOpen ? <Link className="session-card" to={`/course/${session._id}`}>{content}</Link> : <div className="session-card session-card-locked">{content}<small>Complete the previous session to unlock</small></div>
}
