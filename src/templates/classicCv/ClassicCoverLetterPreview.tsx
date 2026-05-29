import React from 'react'
import {
  documentFontStacks,
  documentPageDimensions,
  documentTypographyCssVars,
  getDocumentFontStylesheet,
} from '../../lib/documents'
import type { CoverLetterData } from '../../lib/documents'

export const classicCoverLetterStyles = `
.classic-cover-letter {
  --page-width: 8.27in;
  --page-height: 11.69in;
  --page-padding-top: 0.72in;
  --page-padding-right: 0.72in;
  --page-padding-bottom: 0.72in;
  --page-padding-left: 0.8in;
  --page-font-family: "Cambria", "Georgia", serif;
  --accent-color: #2b5fb8;
  width: var(--page-width);
  min-height: var(--page-height);
  margin: 0 auto;
  background: #fff;
  color: #1b1f24;
  font-family: var(--page-font-family);
  line-height: 1.7;
  padding:
    var(--page-padding-top)
    var(--page-padding-right)
    var(--page-padding-bottom)
    var(--page-padding-left);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  border-top: 6px solid var(--accent-color);
  border-radius: 8px;
}

.classic-cover-letter * {
  box-sizing: border-box;
}

.classic-cover-letter .letter-header {
  display: block;
  padding-top: 16px;
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(43, 95, 184, 0.18);
}

.classic-cover-letter .sender {
  break-inside: avoid-page;
  page-break-inside: avoid;
}

.classic-cover-letter .sender-name,
.classic-cover-letter .subject-line,
.classic-cover-letter .date-line {
  color: var(--accent-color);
}

.classic-cover-letter .sender-name {
  margin: 0 0 10px;
  font-size: var(--name-font-size, 16pt);
  font-weight: var(--name-font-weight, 700);
  line-height: 1.2;
  letter-spacing: 0.01em;
}

.classic-cover-letter .sender-contact-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--header-text-font-size, 10pt);
  font-weight: var(--header-text-font-weight, 400);
  color: #475467;
}

.classic-cover-letter .sender-contact-item a {
  color: inherit;
  text-decoration: none;
}

.classic-cover-letter .sender-contact-item a:hover {
  color: var(--accent-color);
  text-decoration: underline;
}

.classic-cover-letter .date-line {
  margin: 0 0 18px;
  text-align: right;
  font-size: var(--header-text-font-size, 10pt);
  font-weight: var(--header-text-font-weight, 600);
}

.classic-cover-letter .recipient {
  margin-bottom: 22px;
  break-inside: avoid-page;
  page-break-inside: avoid;
  padding: 14px 16px;
  border-left: 4px solid var(--accent-color);
  border-radius: 0 12px 12px 0;
  background: rgba(43, 95, 184, 0.045);
  white-space: pre-line;
}

.classic-cover-letter .subject-line {
  display: inline-block;
  font-size: var(--section-title-font-size, 12pt);
  font-weight: var(--section-title-font-weight, 700);
  margin-bottom: 18px;
  padding-bottom: 4px;
  border-bottom: 2px solid rgba(43, 95, 184, 0.22);
  break-after: avoid-page;
  page-break-after: avoid;
}

.classic-cover-letter .greeting {
  margin-bottom: 18px;
  font-size: var(--subheading-font-size, 10pt);
  font-weight: var(--subheading-font-weight, 600);
}

.classic-cover-letter .paragraph {
  margin: 0 0 16px;
  font-size: var(--body-font-size, 10pt);
  font-weight: var(--body-font-weight, 400);
  text-align: justify;
  orphans: 3;
  widows: 3;
  color: #1f2937;
}

.classic-cover-letter .closing-block {
  margin-top: 34px;
  break-inside: avoid-page;
  page-break-inside: avoid;
  white-space: pre-line;
}

.classic-cover-letter .signature-name {
  display: inline-block;
  margin-top: 10px;
  font-size: var(--subheading-font-size, 10pt);
  font-weight: var(--subheading-font-weight, 700);
  color: var(--accent-color);
}

@media print {
  body {
    background: #fff;
  }

  .classic-cover-letter {
    width: 100%;
    max-width: 100%;
    min-height: auto;
    margin: 0;
    padding: 0;
    box-shadow: none;
    border-radius: 0;
  }
}

@media screen and (max-width: 820px) {
  .classic-cover-letter {
    width: 100%;
    min-height: auto;
    padding: 24px 18px;
    box-shadow: none;
  }

  .classic-cover-letter .date-line {
    text-align: left;
  }
}
`

type ClassicCoverLetterPreviewProps = {
  coverLetter: CoverLetterData
  includeStyles?: boolean
}

export function ClassicCoverLetterPreview({
  coverLetter,
  includeStyles = false,
}: ClassicCoverLetterPreviewProps) {
  const pageSize = documentPageDimensions[coverLetter.styleSettings.pageSize]
  const gutterSplit = coverLetter.styleSettings.gutter / 2
  const pageStyle = {
    '--page-width': `${pageSize.width}in`,
    '--page-height': `${pageSize.height}in`,
    '--page-padding-top': `${coverLetter.styleSettings.margins.top}in`,
    '--page-padding-right': `${coverLetter.styleSettings.margins.right + gutterSplit}in`,
    '--page-padding-bottom': `${coverLetter.styleSettings.margins.bottom}in`,
    '--page-padding-left': `${coverLetter.styleSettings.margins.left + gutterSplit}in`,
    '--page-font-family': documentFontStacks[coverLetter.styleSettings.fontFamily],
    '--accent-color': coverLetter.styleSettings.accentColor,
    ...documentTypographyCssVars(coverLetter.styleSettings.typography),
  } as React.CSSProperties

  const senderLines = [
    coverLetter.senderLocation,
    coverLetter.senderPhone,
    coverLetter.senderEmail,
    ...coverLetter.senderLinks
      .filter((link) => link.url.trim().length > 0)
      .map((link) => `${link.label}: ${link.url}`),
  ]
    .filter(Boolean)
    .join('\n')

  const recipientLines = [
    coverLetter.recipientName,
    coverLetter.recipientTitle,
    coverLetter.recipientCompany,
    coverLetter.recipientAddress,
  ]
    .filter(Boolean)
    .join('\n')
  const fontStylesheet = getDocumentFontStylesheet(
    coverLetter.styleSettings.fontFamily,
  )

  return (
    <>
      {fontStylesheet ? <link rel="stylesheet" href={fontStylesheet} /> : null}
      {includeStyles ? <style>{classicCoverLetterStyles}</style> : null}
      <main className="classic-cover-letter" style={pageStyle}>
        <header className="letter-header">
          <div className="sender">
            <h1 className="sender-name">{coverLetter.senderName}</h1>
            <ul className="sender-contact-list">
              {senderLines
                .split('\n')
                .filter(Boolean)
                .map((line, index) => (
                  <li className="sender-contact-item" key={`contact-${index}`}>
                    {line}
                  </li>
                ))}
            </ul>
          </div>
        </header>

        <div className="date-line">{coverLetter.date}</div>
        <div className="recipient">{recipientLines}</div>
        <div className="subject-line">Subject: {coverLetter.subject}</div>
        <div className="greeting">{coverLetter.greeting}</div>
        {coverLetter.paragraphs.map((paragraph, index) => (
          <p className="paragraph" key={`paragraph-${index}`}>
            {paragraph}
          </p>
        ))}
        <div className="closing-block">
          {coverLetter.closing}
          {'\n'}
          {'\n'}
          <span className="signature-name">{coverLetter.signature}</span>
        </div>
      </main>
    </>
  )
}
