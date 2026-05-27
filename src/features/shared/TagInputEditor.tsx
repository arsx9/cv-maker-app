import { useState, type KeyboardEvent } from 'react'

type TagInputEditorProps = {
  label: string
  tags: string[]
  placeholder?: string
  onChange: (tags: string[]) => void
}

export function TagInputEditor({
  label,
  tags,
  placeholder = 'Type a tag and press Enter',
  onChange,
}: TagInputEditorProps) {
  const [draft, setDraft] = useState('')

  function commitTag(value: string) {
    const nextTag = value.trim()

    if (!nextTag || tags.includes(nextTag)) {
      setDraft('')
      return
    }

    onChange([...tags, nextTag])
    setDraft('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      commitTag(draft)
    }

    if (event.key === 'Backspace' && !draft && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <label className="field-block">
      <span>{label}</span>
      <div className="tag-editor">
        <div className="tag-list">
          {tags.map((tag) => (
            <span className="tag-chip" key={tag}>
              {tag}
              <button
                type="button"
                className="tag-chip-remove"
                aria-label={`Remove ${tag}`}
                onClick={() => onChange(tags.filter((currentTag) => currentTag !== tag))}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <input
          className="form-control"
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => commitTag(draft)}
        />
      </div>
    </label>
  )
}
