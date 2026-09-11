import { useEffect, useState } from 'react'
import api from '../services/api'
import ResourceCard from '../components/ResourceCard.jsx'

export default function ResourcesPage() {
  const [resources, setResources] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { api.get('/resources').then(({ data }) => setResources(data.resources)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load resources.')) }, [])
  if (error) return <main className="page-shell"><p className="form-error">{error}</p></main>
  if (!resources) return <main className="loading-screen">Loading resources...</main>
  return <main className="page-shell"><header className="page-header"><p className="eyebrow">Learning library</p><h1>WQM Resources</h1><p>Resources unlock as you complete the relevant sessions.</p></header><section className="resource-list">{resources.length ? resources.map((resource) => <ResourceCard key={resource._id} resource={resource} />) : <p>No resources are available yet.</p>}</section></main>
}
