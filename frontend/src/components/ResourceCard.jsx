export default function ResourceCard({ resource }) {
  return (
    <article className={`resource-card ${resource.unlocked ? '' : 'resource-card-locked'}`}>
      <div className="resource-icon">{resource.unlocked ? '🔓' : '🔒'}</div>
      <div><span className="session-kicker">{resource.type}</span><h3>{resource.title}</h3><p>{resource.description}</p><span className="resource-status">{resource.unlocked ? `Unlocked after Session ${resource.requiredSession}` : `Unlock after Session ${resource.requiredSession}`}</span></div>
      {resource.unlocked && resource.url && <a className="secondary-button" href={resource.url} target="_blank" rel="noreferrer">Open resource</a>}
    </article>
  )
}
