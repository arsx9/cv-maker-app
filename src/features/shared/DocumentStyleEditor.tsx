import type { DocumentStyleSettings } from '../../lib/documents'
import {
  documentFontOptions,
  documentPageSizeOptions,
  documentTypographyFieldOptions,
} from '../../lib/documents'
import { CollapsibleEditorSection } from './CollapsibleEditorSection'

type DocumentStyleEditorProps = {
  value: DocumentStyleSettings
  onChange: (value: DocumentStyleSettings) => void
  title?: string
}

type TypographyFieldKey = (typeof documentTypographyFieldOptions)[number]['key']

function clampMargin(value: number) {
  return Math.min(Math.max(value, 0.2), 1.5)
}

function clampGutter(value: number) {
  return Math.min(Math.max(value, 0), 0.6)
}

function clampFontSize(value: number) {
  return Math.min(Math.max(value, 7), 24)
}

function typographySizeKey(key: TypographyFieldKey) {
  return `${key}Size` as keyof DocumentStyleSettings['typography']
}

function typographyBoldKey(key: TypographyFieldKey) {
  return `${key}Bold` as keyof DocumentStyleSettings['typography']
}

function TypographyControlRow({
  label,
  size,
  bold,
  onSizeChange,
  onBoldChange,
}: {
  label: string
  size: number
  bold: boolean
  onSizeChange: (size: number) => void
  onBoldChange: (bold: boolean) => void
}) {
  return (
    <div className="typography-row">
      <span className="typography-row-label">{label}</span>
      <label className="field-block typography-size-field">
        <span>Size (pt)</span>
        <input
          type="number"
          className="form-control"
          min="7"
          max="24"
          step="0.5"
          value={size}
          onChange={(event) =>
            onSizeChange(clampFontSize(Number(event.target.value || size)))
          }
        />
      </label>
      <label className="toggle-field typography-bold-field">
        <input
          type="checkbox"
          checked={bold}
          onChange={(event) => onBoldChange(event.target.checked)}
        />
        Bold
      </label>
    </div>
  )
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

  function updateTypographySize(key: TypographyFieldKey, size: number) {
    onChange({
      ...value,
      typography: {
        ...value.typography,
        [typographySizeKey(key)]: clampFontSize(size),
      },
    })
  }

  function updateTypographyBold(key: TypographyFieldKey, bold: boolean) {
    onChange({
      ...value,
      typography: {
        ...value.typography,
        [typographyBoldKey(key)]: bold,
      },
    })
  }

  return (
    <CollapsibleEditorSection title={title}>
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

      <div className="typography-section">
        <h4 className="typography-section-title">Typography</h4>
        <p className="editor-copy">
          Adjust font sizes and bold styling for each part of the document.
        </p>
        <div className="typography-grid">
          {documentTypographyFieldOptions.map(({ key, label }) => (
            <TypographyControlRow
              key={key}
              label={label}
              size={value.typography[typographySizeKey(key)] as number}
              bold={value.typography[typographyBoldKey(key)] as boolean}
              onSizeChange={(size) => updateTypographySize(key, size)}
              onBoldChange={(bold) => updateTypographyBold(key, bold)}
            />
          ))}
        </div>
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
    </CollapsibleEditorSection>
  )
}
