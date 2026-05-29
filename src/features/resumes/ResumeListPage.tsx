import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import type { ResumeListItem } from '../../lib/documents'
import { filterResumesByQuery } from '../../lib/resumeSearch'
import { IconButton } from '../shared/IconButton'
import { CopyIcon, EditIcon, TrashIcon } from '../shared/icons'

export function ResumeListPage() {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState<ResumeListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  const filteredResumes = useMemo(
    () => filterResumesByQuery(resumes, searchQuery),
    [resumes, searchQuery],
  )

  useEffect(() => {
    let ignore = false

    async function loadResumes() {
      try {
        setIsLoading(true)
        const nextResumes = await api.getResumes()
        if (!ignore) {
          setResumes(
            nextResumes.map((resume) => ({
              ...resume,
              tags: resume.tags ?? [],
            })),
          )
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

  async function handleDuplicateResume(id: string) {
    try {
      setDuplicatingId(id)
      setError(null)
      const resume = await api.duplicateResume(id)
      navigate(`/resumes/${resume.id}/edit`)
    } catch (duplicateError) {
      setError(
        duplicateError instanceof Error
          ? duplicateError.message
          : 'Failed to duplicate resume.',
      )
    } finally {
      setDuplicatingId(null)
    }
  }

  async function handleDeleteResume(id: string, title: string) {
    const confirmed = window.confirm(`Delete "${title}"?`)

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(id)
      setError(null)
      await api.deleteResume(id)
      setResumes((current) => current.filter((resume) => resume.id !== id))
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Failed to delete resume.',
      )
    } finally {
      setDeletingId(null)
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

      {!isLoading && resumes.length > 0 ? (
        <label className="document-search-bar field-block">
          <span>Search CVs</span>
          <input
            type="search"
            className="form-control"
            value={searchQuery}
            placeholder="Search by name or tag (e.g. Primary CV, WordPress)"
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
      ) : null}

      {isLoading ? (
        <div className="empty-card">Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <div className="empty-card">
          No resumes yet. Create one to start editing your CV template.
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="empty-card">
          No CVs match &quot;{searchQuery.trim()}&quot;. Try another name or tag.
        </div>
      ) : (
        <div className="document-grid">
          {filteredResumes.map((resume) => (
            <article className="document-card" key={resume.id}>
              <div>
                <p className="document-card-eyebrow">{resume.templateKey}</p>
                <h3>{resume.title}</h3>
                {resume.tags.length > 0 ? (
                  <div className="document-tag-list">
                    {resume.tags.map((tag) => (
                      <span className="document-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <p className="document-card-meta">
                  Updated {new Date(resume.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="document-card-actions">
                <IconButton
                  label="Open editor"
                  variant="primary"
                  icon={<EditIcon />}
                  onClick={() => navigate(`/resumes/${resume.id}/edit`)}
                  disabled={deletingId === resume.id || duplicatingId === resume.id}
                />
                <IconButton
                  label="Duplicate resume"
                  variant="secondary"
                  icon={<CopyIcon />}
                  isLoading={duplicatingId === resume.id}
                  disabled={deletingId === resume.id}
                  onClick={() => void handleDuplicateResume(resume.id)}
                />
                <IconButton
                  label="Delete resume"
                  variant="danger"
                  icon={<TrashIcon />}
                  isLoading={deletingId === resume.id}
                  disabled={duplicatingId === resume.id}
                  onClick={() => void handleDeleteResume(resume.id, resume.title)}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
