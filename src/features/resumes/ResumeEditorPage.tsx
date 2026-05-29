import { useEffect, useState } from 'react'
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate, useParams } from 'react-router-dom'
import { api, getResumePdfUrl } from '../../lib/api'
import { defaultResumeData, normalizeResumeData } from '../../lib/defaults'
import type {
  ResumeData,
  ResumeEntry,
  ResumeRecord,
  ResumeSectionId,
} from '../../lib/documents'
import { resumeSectionOptions } from '../../lib/documents'
import { DocumentStyleEditor } from '../shared/DocumentStyleEditor'
import { TagInputEditor } from '../shared/TagInputEditor'
import { ClassicCvPreview } from '../../templates/classicCv/ClassicCvPreview'

type EntrySectionKey = 'workExperience' | 'selectedProjects' | 'achievements'

type SortableSectionItemProps = {
  sectionId: ResumeSectionId
  label: string
  isVisible: boolean
  onToggle: (sectionId: ResumeSectionId) => void
}

type EntrySectionEditorProps = {
  title: string
  entries: ResumeEntry[]
  onChange: (entries: ResumeEntry[]) => void
  prefix: string
  prependNewEntries?: boolean
}

function createEmptyEntry(prefix: string): ResumeEntry {
  return {
    id: `${prefix}-${crypto.randomUUID()}`,
    title: '',
    subtitle: '',
    date: '',
    bullets: [''],
  }
}

function SortableSectionItem({
  sectionId,
  label,
  isVisible,
  onToggle,
}: SortableSectionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sectionId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div className="sortable-row" ref={setNodeRef} style={style}>
      <button
        type="button"
        className="drag-handle"
        aria-label={`Drag ${label}`}
        {...attributes}
        {...listeners}
      >
        ::
      </button>
      <span>{label}</span>
      <label className="toggle-field">
        <input
          type="checkbox"
          checked={isVisible}
          onChange={() => onToggle(sectionId)}
        />
        Show
      </label>
    </div>
  )
}

function EntrySectionEditor({
  title,
  entries,
  onChange,
  prefix,
  prependNewEntries = false,
}: EntrySectionEditorProps) {
  function updateEntry(index: number, nextEntry: ResumeEntry) {
    onChange(entries.map((entry, entryIndex) => (entryIndex === index ? nextEntry : entry)))
  }

  function updateBullet(entryIndex: number, bulletIndex: number, value: string) {
    const nextEntry = entries[entryIndex]
    updateEntry(entryIndex, {
      ...nextEntry,
      bullets: nextEntry.bullets.map((bullet, currentIndex) =>
        currentIndex === bulletIndex ? value : bullet,
      ),
    })
  }

  function addEntry() {
    const nextEntry = createEmptyEntry(prefix)
    onChange(prependNewEntries ? [nextEntry, ...entries] : [...entries, nextEntry])
  }

  function removeEntry(index: number) {
    onChange(entries.filter((_, entryIndex) => entryIndex !== index))
  }

  function addBullet(entryIndex: number) {
    const nextEntry = entries[entryIndex]
    updateEntry(entryIndex, {
      ...nextEntry,
      bullets: [...nextEntry.bullets, ''],
    })
  }

  function removeBullet(entryIndex: number, bulletIndex: number) {
    const nextEntry = entries[entryIndex]
    updateEntry(entryIndex, {
      ...nextEntry,
      bullets: nextEntry.bullets.filter((_, index) => index !== bulletIndex),
    })
  }

  return (
    <section className="editor-card">
      <div className="editor-card-header">
        <h3>{title}</h3>
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={addEntry}>
          Add Item
        </button>
      </div>

      <div className="stack-gap">
        {entries.map((entry, index) => (
          <div className="nested-card" key={entry.id}>
            <div className="editor-card-header">
              <h4 className="nested-card-title">
                {title} #{index + 1}
              </h4>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeEntry(index)}
              >
                Remove
              </button>
            </div>

            <div className="form-grid two-col">
              <label className="field-block">
                <span>Title</span>
                <input
                  className="form-control"
                  value={entry.title}
                  onChange={(event) =>
                    updateEntry(index, { ...entry, title: event.target.value })
                  }
                />
              </label>
              <label className="field-block">
                <span>Subtitle</span>
                <input
                  className="form-control"
                  value={entry.subtitle || ''}
                  onChange={(event) =>
                    updateEntry(index, { ...entry, subtitle: event.target.value })
                  }
                />
              </label>
              <label className="field-block">
                <span>Date / Right label</span>
                <input
                  className="form-control"
                  value={entry.date}
                  onChange={(event) =>
                    updateEntry(index, { ...entry, date: event.target.value })
                  }
                />
              </label>
            </div>

            <div className="stack-gap">
              {entry.bullets.map((bullet, bulletIndex) => (
                <div className="bullet-row" key={`${entry.id}-bullet-${bulletIndex}`}>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={bullet}
                    onChange={(event) =>
                      updateBullet(index, bulletIndex, event.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeBullet(index, bulletIndex)}
                    disabled={entry.bullets.length === 1}
                  >
                    Remove bullet
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => addBullet(index)}
            >
              Add Bullet
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ResumeEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const sensors = useSensors(useSensor(PointerSensor))
  const [draft, setDraft] = useState<ResumeRecord | null>(null)
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

    async function loadResume() {
      try {
        setIsLoading(true)
        const nextResume = await api.getResume(id)
        if (!ignore) {
          setDraft(nextResume)
          setError(null)
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load resume.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void loadResume()

    return () => {
      ignore = true
    }
  }, [id])

  function updateDraft(nextData: ResumeData) {
    setDraft((current) => (current ? { ...current, data: nextData } : current))
    setStatus(null)
  }

  function updateEntrySection(section: EntrySectionKey, nextEntries: ResumeEntry[]) {
    if (!draft) {
      return
    }

    updateDraft({
      ...draft.data,
      [section]: nextEntries,
    })
  }

  function toggleSection(sectionId: ResumeSectionId) {
    if (!draft) {
      return
    }

    const isHidden = draft.data.hiddenSections.includes(sectionId)

    updateDraft({
      ...draft.data,
      hiddenSections: isHidden
        ? draft.data.hiddenSections.filter((section) => section !== sectionId)
        : [...draft.data.hiddenSections, sectionId],
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!draft || !event.over || event.active.id === event.over.id) {
      return
    }

    const currentIndex = draft.data.sectionOrder.indexOf(
      event.active.id as ResumeSectionId,
    )
    const nextIndex = draft.data.sectionOrder.indexOf(event.over.id as ResumeSectionId)

    updateDraft({
      ...draft.data,
      sectionOrder: arrayMove(draft.data.sectionOrder, currentIndex, nextIndex),
    })
  }

  async function handleSave() {
    if (!draft) {
      return
    }

    try {
      setIsSaving(true)
      const savedResume = await api.updateResume(draft.id, {
        title: draft.title,
        templateKey: draft.templateKey,
        data: draft.data,
      })
      setDraft(savedResume)
      setStatus('Saved.')
      setError(null)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save resume.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!draft) {
      return
    }

    const confirmed = window.confirm('Delete this resume?')

    if (!confirmed) {
      return
    }

    try {
      setIsDeleting(true)
      await api.deleteResume(draft.id)
      navigate('/resumes')
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Failed to delete resume.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <div className="empty-card">Loading resume editor...</div>
  }

  if (!draft) {
    return <div className="alert alert-danger">Resume not found.</div>
  }

  const activeData = normalizeResumeData(draft.data || defaultResumeData)

  return (
    <section className="editor-page">
      <div className="page-panel-header">
        <div>
          <p className="eyebrow">Resume Editor</p>
          <h2 className="page-title">{draft.title}</h2>
          <p className="page-copy">
            Update your content, drag sections into a new order, and export a
            PDF that matches the live preview.
          </p>
        </div>

        <div className="toolbar-actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/resumes')}
          >
            Back
          </button>
          <a
            className="btn btn-outline-primary"
            href={getResumePdfUrl(draft.id)}
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
            {isSaving ? 'Saving...' : 'Save Resume'}
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
            <h3>Resume Details</h3>
            <div className="form-grid two-col">
              <label className="field-block">
                <span>Document Title</span>
                <input
                  className="form-control"
                  value={draft.title}
                  onChange={(event) => {
                    setDraft({ ...draft, title: event.target.value })
                    setStatus(null)
                  }}
                />
              </label>
              <label className="field-block">
                <span>Full Name</span>
                <input
                  className="form-control"
                  value={activeData.personal.fullName}
                  onChange={(event) =>
                    updateDraft({
                      ...activeData,
                      personal: {
                        ...activeData.personal,
                        fullName: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <label className="field-block">
                <span>Headline</span>
                <input
                  className="form-control"
                  value={activeData.personal.headline}
                  onChange={(event) =>
                    updateDraft({
                      ...activeData,
                      personal: {
                        ...activeData.personal,
                        headline: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <label className="field-block">
                <span>Location</span>
                <input
                  className="form-control"
                  value={activeData.personal.location}
                  onChange={(event) =>
                    updateDraft({
                      ...activeData,
                      personal: {
                        ...activeData.personal,
                        location: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <label className="field-block">
                <span>Phone</span>
                <input
                  className="form-control"
                  value={activeData.personal.phone}
                  onChange={(event) =>
                    updateDraft({
                      ...activeData,
                      personal: {
                        ...activeData.personal,
                        phone: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <label className="field-block">
                <span>Email</span>
                <input
                  className="form-control"
                  value={activeData.personal.email}
                  onChange={(event) =>
                    updateDraft({
                      ...activeData,
                      personal: {
                        ...activeData.personal,
                        email: event.target.value,
                      },
                    })
                  }
                />
              </label>
            </div>

            <div className="stack-gap">
              {activeData.personal.links.map((link, index) => (
                <div className="nested-card" key={link.id}>
                  <div className="form-grid two-col">
                    <label className="field-block">
                      <span>Link Label</span>
                      <input
                        className="form-control"
                        value={link.label}
                        onChange={(event) =>
                          updateDraft({
                            ...activeData,
                            personal: {
                              ...activeData.personal,
                              links: activeData.personal.links.map((currentLink, linkIndex) =>
                                linkIndex === index
                                  ? { ...currentLink, label: event.target.value }
                                  : currentLink,
                              ),
                            },
                          })
                        }
                      />
                    </label>
                    <label className="field-block">
                      <span>Link URL</span>
                      <input
                        className="form-control"
                        value={link.url}
                        onChange={(event) =>
                          updateDraft({
                            ...activeData,
                            personal: {
                              ...activeData.personal,
                              links: activeData.personal.links.map((currentLink, linkIndex) =>
                                linkIndex === index
                                  ? { ...currentLink, url: event.target.value }
                                  : currentLink,
                              ),
                            },
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <DocumentStyleEditor
            title="CV Styling"
            value={activeData.styleSettings}
            onChange={(styleSettings) =>
              updateDraft({
                ...activeData,
                styleSettings,
              })
            }
          />

          <section className="editor-card">
            <h3>Section Order</h3>
            <p className="editor-copy">
              Drag to change layout order and toggle sections on or off.
            </p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={activeData.sectionOrder}
                strategy={verticalListSortingStrategy}
              >
                <div className="stack-gap">
                  {activeData.sectionOrder.map((sectionId) => {
                    const section = resumeSectionOptions.find(
                      (option) => option.id === sectionId,
                    )

                    if (!section) {
                      return null
                    }

                    return (
                      <SortableSectionItem
                        key={section.id}
                        sectionId={section.id}
                        label={section.label}
                        isVisible={!activeData.hiddenSections.includes(section.id)}
                        onToggle={toggleSection}
                      />
                    )
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </section>

          <section className="editor-card">
            <h3>Professional Summary</h3>
            <label className="field-block">
              <span>Summary</span>
              <textarea
                className="form-control"
                rows={7}
                value={activeData.summary}
                onChange={(event) =>
                  updateDraft({
                    ...activeData,
                    summary: event.target.value,
                  })
                }
              />
            </label>
          </section>

          <EntrySectionEditor
            title="Work Experience"
            entries={activeData.workExperience}
            prefix="work"
            prependNewEntries
            onChange={(entries) => updateEntrySection('workExperience', entries)}
          />

          <EntrySectionEditor
            title="Selected Projects"
            entries={activeData.selectedProjects}
            prefix="project"
            prependNewEntries
            onChange={(entries) => updateEntrySection('selectedProjects', entries)}
          />

          <EntrySectionEditor
            title="Achievements"
            entries={activeData.achievements}
            prefix="achievement"
            onChange={(entries) => updateEntrySection('achievements', entries)}
          />

          <section className="editor-card">
            <h3>Skills</h3>
            <div className="stack-gap">
              <TagInputEditor
                label="Technical Skills"
                tags={activeData.skills.technical}
                onChange={(technical) =>
                  updateDraft({
                    ...activeData,
                    skills: {
                      ...activeData.skills,
                      technical,
                    },
                  })
                }
              />
              <TagInputEditor
                label="Soft Skills"
                tags={activeData.skills.soft}
                onChange={(soft) =>
                  updateDraft({
                    ...activeData,
                    skills: {
                      ...activeData.skills,
                      soft,
                    },
                  })
                }
              />
              <TagInputEditor
                label="Tools"
                tags={activeData.tools}
                onChange={(tools) =>
                  updateDraft({
                    ...activeData,
                    tools,
                  })
                }
              />
            </div>
          </section>

          <section className="editor-card">
            <h3>Education</h3>
            <div className="form-grid two-col">
              <label className="field-block">
                <span>Degree</span>
                <input
                  className="form-control"
                  value={activeData.education.degree}
                  onChange={(event) =>
                    updateDraft({
                      ...activeData,
                      education: {
                        ...activeData.education,
                        degree: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <label className="field-block">
                <span>Education Date</span>
                <input
                  className="form-control"
                  value={activeData.education.date}
                  onChange={(event) =>
                    updateDraft({
                      ...activeData,
                      education: {
                        ...activeData.education,
                        date: event.target.value,
                      },
                    })
                  }
                />
              </label>
              <label className="field-block field-block-full">
                <span>Institution</span>
                <input
                  className="form-control"
                  value={activeData.education.institution}
                  onChange={(event) =>
                    updateDraft({
                      ...activeData,
                      education: {
                        ...activeData.education,
                        institution: event.target.value,
                      },
                    })
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
                <h3>Classic CV template</h3>
              </div>
              <p className="preview-copy">
                The PDF export uses the same document component.
              </p>
            </div>
            <div className="preview-scroll">
              <ClassicCvPreview resume={activeData} includeStyles />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
