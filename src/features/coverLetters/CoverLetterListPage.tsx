import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { filterCoverLettersByQuery } from '../../lib/coverLetterSearch'
import type { CoverLetterListItem } from '../../lib/documents'

export function CoverLetterListPage() {
  const navigate = useNavigate()
  const [letters, setLetters] = useState<CoverLetterListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  const filteredLetters = useMemo(
    () => filterCoverLettersByQuery(letters, searchQuery),
    [letters, searchQuery],
  )

  useEffect(() => {
    let ignore = false

    async function loadLetters() {
      try {
        setIsLoading(true)
        const nextLetters = await api.getCoverLetters()
        if (!ignore) {
          setLetters(
            nextLetters.map((letter) => ({
              ...letter,
              tags: letter.tags ?? [],
            })),
          )
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

      {!isLoading && letters.length > 0 ? (
        <label className="document-search-bar field-block">
          <span>Search cover letters</span>
          <input
            type="search"
            className="form-control"
            value={searchQuery}
            placeholder="Search by name or tag (e.g. Primary, WordPress)"
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
      ) : null}

      {isLoading ? (
        <div className="empty-card">Loading cover letters...</div>
      ) : letters.length === 0 ? (
        <div className="empty-card">
          No cover letters yet. Create one to start writing.
        </div>
      ) : filteredLetters.length === 0 ? (
        <div className="empty-card">
          No cover letters match &quot;{searchQuery.trim()}&quot;. Try another name or
          tag.
        </div>
      ) : (
        <div className="document-grid">
          {filteredLetters.map((letter) => (
            <article className="document-card" key={letter.id}>
              <div>
                <p className="document-card-eyebrow">
                  {letter.linkedResumeId ? 'Linked to resume' : 'Standalone'}
                </p>
                <h3>{letter.title}</h3>
                {letter.tags.length > 0 ? (
                  <div className="document-tag-list">
                    {letter.tags.map((tag) => (
                      <span className="document-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
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
