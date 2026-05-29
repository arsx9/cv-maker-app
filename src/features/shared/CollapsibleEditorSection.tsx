import { useState, type ReactNode } from 'react'
import { ChevronDownIcon } from './icons'

type CollapsibleEditorSectionProps = {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function CollapsibleEditorSection({
  title,
  children,
  defaultOpen = true,
}: CollapsibleEditorSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <section
      className={`editor-card collapsible-editor-section${isOpen ? ' is-open' : ' is-collapsed'}`}
    >
      <button
        type="button"
        className="collapsible-editor-header"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <h3>{title}</h3>
        <ChevronDownIcon className="collapsible-editor-chevron" />
      </button>

      {isOpen ? <div className="collapsible-editor-body">{children}</div> : null}
    </section>
  )
}
