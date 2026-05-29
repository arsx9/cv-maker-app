import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, getCoverLetterPdfUrl } from '../../lib/api'
import {
  createCoverLetterFromResume,
  defaultCoverLetterData,
  normalizeCoverLetterData,
} from '../../lib/defaults'
import type {
  CoverLetterData,
  CoverLetterRecord,
  ResumeListItem,
} from '../../lib/documents'
import { DocumentStyleEditor } from '../shared/DocumentStyleEditor'
import { TagInputEditor } from '../shared/TagInputEditor'
import { ClassicCoverLetterPreview } from '../../templates/classicCv/ClassicCoverLetterPreview'

export function CoverLetterEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [coverLetter, setCoverLetter] = useState<CoverLetterRecord | null>(null)
  const [resumes, setResumes] = useState<ResumeListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }

    let ignore = false

    async function loadData() {
      try {
        setIsLoading(true)
        const [nextLetter, nextResumes] = await Promise.all([
          api.getCoverLetter(id),
          api.getResumes(),
        ])

        if (!ignore) {
          setCoverLetter({
            ...nextLetter,
            tags: nextLetter.tags ?? [],
          })
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
            loadError instanceof Error
              ? loadError.message
              : 'Failed to load cover letter.',
          )
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      ignore = true
    }
  }, [id])

  function updateDraft(nextData: CoverLetterData) {
    setCoverLetter((current) => (current ? { ...current, data: nextData } : current))
    setStatus(null)
  }

  async function handlePrefill(resumeId: string) {
    if (!coverLetter || !resumeId) {
      return
    }

    try {
      const resume = await api.getResume(resumeId)
      updateDraft(createCoverLetterFromResume(resume.data))
      setCoverLetter((current) =>
        current ? { ...current, linkedResumeId: resumeId } : current,
      )
    } catch (prefillError) {
      setError(
        prefillError instanceof Error
          ? prefillError.message
          : 'Failed to prefill from resume.',
      )
    }
  }

  async function handleSave() {
    if (!coverLetter) {
      return
    }

    try {
      setIsSaving(true)
      const savedLetter = await api.updateCoverLetter(coverLetter.id, {
        title: coverLetter.title,
        tags: coverLetter.tags,
        linkedResumeId: coverLetter.linkedResumeId,
        data: coverLetter.data,
      })
      setCoverLetter(savedLetter)
      setStatus('Saved.')
      setError(null)
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Failed to save cover letter.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!coverLetter) {
      return
    }

    const confirmed = window.confirm('Delete this cover letter?')

    if (!confirmed) {
      return
    }

    try {
      setIsDeleting(true)
      await api.deleteCoverLetter(coverLetter.id)
      navigate('/cover-letters')
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Failed to delete cover letter.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <div className="empty-card">Loading cover letter editor...</div>
  }

  if (!coverLetter) {
    return <div className="alert alert-danger">Cover letter not found.</div>
  }

  const activeData = normalizeCoverLetterData(
    coverLetter.data || defaultCoverLetterData,
  )

  return (
    <section className="editor-page">
      <div className="page-panel-header">
        <div>
          <p className="eyebrow">Cover Letter Editor</p>
          <h2 className="page-title">{coverLetter.title}</h2>
          <p className="page-copy">
            Tailor a letter, optionally prefill sender details from a resume,
            and export the result as a PDF.
          </p>
        </div>

        <div className="toolbar-actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/cover-letters')}
          >
            Back
          </button>
          <a
            className="btn btn-outline-primary"
            href={getCoverLetterPdfUrl(coverLetter.id)}
            target="_blank"
            rel="noreferrer"
          >
            Download PDF
          </a>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void handleSave()}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Letter'}
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => void handleDelete()}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}
      {status ? <div className="alert alert-success">{status}</div> : null}

      <div className="editor-layout">
        <div className="editor-pane">
          <section className="editor-card">
            <h3>Document Details</h3>
            <div className="form-grid two-col">
              <label className="field-block">
                <span>Title</span>
                <input
                  className="form-control"
                  value={coverLetter.title}
                  onChange={(event) =>
                    setCoverLetter({ ...coverLetter, title: event.target.value })
                  }
                />
              </label>
              <label className="field-block">
                <span>Prefill From Resume</span>
                <select
                  className="form-select"
                  value={coverLetter.linkedResumeId || ''}
                  onChange={(event) => {
                    const nextResumeId = event.target.value
                    setCoverLetter({
                      ...coverLetter,
                      linkedResumeId: nextResumeId || null,
                    })

                    if (nextResumeId) {
                      void handlePrefill(nextResumeId)
                    }
                  }}
                >
                  <option value="">Select a resume</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <TagInputEditor
              label="Cover Letter Tags"
              placeholder="e.g. Primary, WordPress, Remote"
              tags={coverLetter.tags}
              onChange={(tags) => {
                setCoverLetter({ ...coverLetter, tags })
                setStatus(null)
              }}
            />
            <p className="editor-copy">
              Use tags to organize saved cover letters in your library. Tags are not
              included on the exported PDF.
            </p>
          </section>

          <DocumentStyleEditor
            title="Cover Letter Styling"
            value={activeData.styleSettings}
            onChange={(styleSettings) =>
              updateDraft({
                ...activeData,
                styleSettings,
              })
            }
          />

          <section className="editor-card">
            <h3>Sender</h3>
            <div className="form-grid two-col">
              <label className="field-block">
                <span>Name</span>
                <input
                  className="form-control"
                  value={activeData.senderName}
                  onChange={(event) =>
                    updateDraft({ ...activeData, senderName: event.target.value })
                  }
                />
              </label>
              <label className="field-block">
                <span>Location</span>
                <input
                  className="form-control"
                  value={activeData.senderLocation}
                  onChange={(event) =>
                    updateDraft({ ...activeData, senderLocation: event.target.value })
                  }
                />
              </label>
              <label className="field-block">
                <span>Phone</span>
                <input
                  className="form-control"
                  value={activeData.senderPhone}
                  onChange={(event) =>
                    updateDraft({ ...activeData, senderPhone: event.target.value })
                  }
                />
              </label>
              <label className="field-block">
                <span>Email</span>
                <input
                  className="form-control"
                  value={activeData.senderEmail}
                  onChange={(event) =>
                    updateDraft({ ...activeData, senderEmail: event.target.value })
                  }
                />
              </label>
            </div>
          </section>

          <section className="editor-card">
            <h3>Recipient</h3>
            <div className="form-grid two-col">
              <label className="field-block">
                <span>Recipient Name</span>
                <input
                  className="form-control"
                  value={activeData.recipientName}
                  onChange={(event) =>
                    updateDraft({ ...activeData, recipientName: event.target.value })
                  }
                />
              </label>
              <label className="field-block">
                <span>Recipient Title</span>
                <input
                  className="form-control"
                  value={activeData.recipientTitle}
                  onChange={(event) =>
                    updateDraft({ ...activeData, recipientTitle: event.target.value })
                  }
                />
              </label>
              <label className="field-block">
                <span>Company</span>
                <input
                  className="form-control"
                  value={activeData.recipientCompany}
                  onChange={(event) =>
                    updateDraft({ ...activeData, recipientCompany: event.target.value })
                  }
                />
              </label>
              <label className="field-block field-block-full">
                <span>Address</span>
                <textarea
                  className="form-control"
                  rows={3}
                  value={activeData.recipientAddress}
                  onChange={(event) =>
                    updateDraft({ ...activeData, recipientAddress: event.target.value })
                  }
                />
              </label>
            </div>
          </section>

          <section className="editor-card">
            <h3>Letter Content</h3>
            <div className="form-grid two-col">
              <label className="field-block">
                <span>Date</span>
                <input
                  className="form-control"
                  value={activeData.date}
                  onChange={(event) => updateDraft({ ...activeData, date: event.target.value })}
                />
              </label>
              <label className="field-block">
                <span>Subject</span>
                <input
                  className="form-control"
                  value={activeData.subject}
                  onChange={(event) =>
                    updateDraft({ ...activeData, subject: event.target.value })
                  }
                />
              </label>
              <label className="field-block field-block-full">
                <span>Greeting</span>
                <input
                  className="form-control"
                  value={activeData.greeting}
                  onChange={(event) =>
                    updateDraft({ ...activeData, greeting: event.target.value })
                  }
                />
              </label>
            </div>

            <div className="stack-gap">
              {activeData.paragraphs.map((paragraph, index) => (
                <div className="bullet-row" key={`paragraph-${index}`}>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={paragraph}
                    onChange={(event) =>
                      updateDraft({
                        ...activeData,
                        paragraphs: activeData.paragraphs.map((currentParagraph, paragraphIndex) =>
                          paragraphIndex === index
                            ? event.target.value
                            : currentParagraph,
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      updateDraft({
                        ...activeData,
                        paragraphs: activeData.paragraphs.filter(
                          (_, paragraphIndex) => paragraphIndex !== index,
                        ),
                      })
                    }
                    disabled={activeData.paragraphs.length === 1}
                  >
                    Remove paragraph
                  </button>
                </div>
              ))}
            </div>

            <div className="toolbar-actions">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() =>
                  updateDraft({
                    ...activeData,
                    paragraphs: [...activeData.paragraphs, ''],
                  })
                }
              >
                Add Paragraph
              </button>
            </div>

            <div className="form-grid two-col mt-3">
              <label className="field-block">
                <span>Closing</span>
                <input
                  className="form-control"
                  value={activeData.closing}
                  onChange={(event) =>
                    updateDraft({ ...activeData, closing: event.target.value })
                  }
                />
              </label>
              <label className="field-block">
                <span>Signature</span>
                <input
                  className="form-control"
                  value={activeData.signature}
                  onChange={(event) =>
                    updateDraft({ ...activeData, signature: event.target.value })
                  }
                />
              </label>
            </div>
          </section>
        </div>

        <div className="preview-pane">
          <div className="preview-card">
            <div className="preview-card-header">
              <div>
                <p className="eyebrow">Live Preview</p>
                <h3>Classic cover letter template</h3>
              </div>
              <p className="preview-copy">
                Exported PDFs use this same printable layout.
              </p>
            </div>
            <div className="preview-scroll">
              <ClassicCoverLetterPreview
                coverLetter={activeData}
                includeStyles
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
