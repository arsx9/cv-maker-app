import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import type { ResumeListItem } from '../../lib/documents'

export function ResumeListPage() {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState<ResumeListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadResumes() {
      try {
        setIsLoading(true)
        const nextResumes = await api.getResumes()
        if (!ignore) {
          setResumes(nextResumes)
          setError(null)
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error ? loadError.message : 'Failed to load resumes.',
          )
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void loadResumes()

    return () => {
      ignore = true
    }
  }, [])

  async function handleCreateResume() {
    try {
      setIsCreating(true)
      const resume = await api.createResume()
      navigate(`/resumes/${resume.id}/edit`)
    } catch (createError) {
      setError(
        createError instanceof Error ? createError.message : 'Failed to create resume.',
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <section className="page-panel">
      <div className="page-panel-header">
        <div>
          <p className="eyebrow">Resumes</p>
          <h2 className="page-title">Saved CVs</h2>
          <p className="page-copy">
            Start a new CV from your existing template and continue editing any
            saved version.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => void handleCreateResume()}
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Resume'}
        </button>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {isLoading ? (
        <div className="empty-card">Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <div className="empty-card">
          No resumes yet. Create one to start editing your CV template.
        </div>
      ) : (
        <div className="document-grid">
          {resumes.map((resume) => (
            <article className="document-card" key={resume.id}>
              <div>
                <p className="document-card-eyebrow">{resume.templateKey}</p>
                <h3>{resume.title}</h3>
                <p className="document-card-meta">
                  Updated {new Date(resume.updatedAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => navigate(`/resumes/${resume.id}/edit`)}
              >
                Open Editor
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
