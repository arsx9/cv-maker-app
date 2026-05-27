import type { DocumentStyleSettings } from '../../lib/documents'
import {
  documentFontOptions,
  documentPageSizeOptions,
} from '../../lib/documents'

type DocumentStyleEditorProps = {
  value: DocumentStyleSettings
  onChange: (value: DocumentStyleSettings) => void
  title?: string
}

function clampMargin(value: number) {
  return Math.min(Math.max(value, 0.2), 1.5)
}

function clampGutter(value: number) {
  return Math.min(Math.max(value, 0), 0.6)
}

export function DocumentStyleEditor({
  value,
  onChange,
  title = 'Document Styling',
}: DocumentStyleEditorProps) {
  function updateMargin(
    side: keyof DocumentStyleSettings['margins'],
    nextValue: number,
  ) {
    onChange({
      ...value,
      margins: {
        ...value.margins,
        [side]: clampMargin(nextValue),
      },
    })
  }

  return (
    <section className="editor-card">
      <h3>{title}</h3>
      <p className="editor-copy">
        Control accent color, typography, page size, margins, and gutter for
        both preview and PDF output.
      </p>

      <div className="form-grid two-col">
        <label className="field-block">
          <span>Accent Color</span>
          <div className="color-input-wrap">
            <input
              type="color"
              className="form-control form-control-color"
              value={value.accentColor}
              onChange={(event) =>
                onChange({ ...value, accentColor: event.target.value })
              }
            />
            <input
              className="form-control"
              value={value.accentColor}
              onChange={(event) =>
                onChange({ ...value, accentColor: event.target.value })
              }
            />
          </div>
        </label>

        <label className="field-block">
          <span>Font Family</span>
          <select
            className="form-select"
            value={value.fontFamily}
            onChange={(event) =>
              onChange({
                ...value,
                fontFamily: event.target.value as DocumentStyleSettings['fontFamily'],
              })
            }
          >
            {documentFontOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field-block">
          <span>Page Size</span>
          <select
            className="form-select"
            value={value.pageSize}
            onChange={(event) =>
              onChange({
                ...value,
                pageSize: event.target.value as DocumentStyleSettings['pageSize'],
              })
            }
          >
            {documentPageSizeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field-block">
          <span>Gutter (inches)</span>
          <input
            type="number"
            className="form-control"
            min="0"
            max="0.6"
            step="0.01"
            value={value.gutter}
            onChange={(event) =>
              onChange({
                ...value,
                gutter: clampGutter(Number(event.target.value || 0)),
              })
            }
          />
        </label>
      </div>

      <div className="form-grid four-col mt-3">
        <label className="field-block">
          <span>Top Margin</span>
          <input
            type="number"
            className="form-control"
            min="0.2"
            max="1.5"
            step="0.01"
            value={value.margins.top}
            onChange={(event) => updateMargin('top', Number(event.target.value || 0))}
          />
        </label>
        <label className="field-block">
          <span>Right Margin</span>
          <input
            type="number"
            className="form-control"
            min="0.2"
            max="1.5"
            step="0.01"
            value={value.margins.right}
            onChange={(event) =>
              updateMargin('right', Number(event.target.value || 0))
            }
          />
        </label>
        <label className="field-block">
          <span>Bottom Margin</span>
          <input
            type="number"
            className="form-control"
            min="0.2"
            max="1.5"
            step="0.01"
            value={value.margins.bottom}
            onChange={(event) =>
              updateMargin('bottom', Number(event.target.value || 0))
            }
          />
        </label>
        <label className="field-block">
          <span>Left Margin</span>
          <input
            type="number"
            className="form-control"
            min="0.2"
            max="1.5"
            step="0.01"
            value={value.margins.left}
            onChange={(event) => updateMargin('left', Number(event.target.value || 0))}
          />
        </label>
      </div>
    </section>
  )
}
