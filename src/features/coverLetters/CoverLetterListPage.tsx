import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import type { CoverLetterListItem } from '../../lib/documents'

export function CoverLetterListPage() {
  const navigate = useNavigate()
  const [letters, setLetters] = useState<CoverLetterListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadLetters() {
      try {
        setIsLoading(true)
        const nextLetters = await api.getCoverLetters()
        if (!ignore) {
          setLetters(nextLetters)
          setError(null)
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Failed to load cover letters.',
          )
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void loadLetters()

    return () => {
      ignore = true
    }
  }, [])

  async function handleCreateLetter() {
    try {
      setIsCreating(true)
      const letter = await api.createCoverLetter()
      navigate(`/cover-letters/${letter.id}/edit`)
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : 'Failed to create cover letter.',
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <section className="page-panel">
      <div className="page-panel-header">
        <div>
          <p className="eyebrow">Cover Letters</p>
          <h2 className="page-title">Saved cover letters</h2>
          <p className="page-copy">
            Create tailored letters, prefill sender details from a resume, and
            export them as PDFs.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => void handleCreateLetter()}
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Cover Letter'}
        </button>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {isLoading ? (
        <div className="empty-card">Loading cover letters...</div>
      ) : letters.length === 0 ? (
        <div className="empty-card">
          No cover letters yet. Create one to start writing.
        </div>
      ) : (
        <div className="document-grid">
          {letters.map((letter) => (
            <article className="document-card" key={letter.id}>
              <div>
                <p className="document-card-eyebrow">
                  {letter.linkedResumeId ? 'Linked to resume' : 'Standalone'}
                </p>
                <h3>{letter.title}</h3>
                <p className="document-card-meta">
                  Updated {new Date(letter.updatedAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => navigate(`/cover-letters/${letter.id}/edit`)}
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
