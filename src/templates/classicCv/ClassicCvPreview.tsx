import React from 'react'
import {
  documentFontStacks,
  documentPageDimensions,
  documentTypographyCssVars,
  getDocumentFontStylesheet,
} from '../../lib/documents'
import type { ResumeData, ResumeEntry, ResumeSectionId } from '../../lib/documents'

export const classicCvStyles = `
:root {
  color-scheme: light;
}

.classic-cv-page {
  --heading-color: rgb(0, 51, 153);
  --text-color: #000;
  --rule-color: rgb(0, 51, 153);
  --base-font-size: 10pt;
  --page-width: 8.27in;
  --page-height: 11.69in;
  --page-padding-top: 0.52in;
  --page-padding-right: 0.52in;
  --page-padding-bottom: 0.46in;
  --page-padding-left: 0.6in;
  --page-font-family: "Charter", "Charter BT", "Bitstream Charter", "Sitka Text", "Cambria", "Georgia", serif;
  width: var(--page-width);
  min-height: var(--page-height);
  margin: 0 auto;
  background: #fff;
  color: var(--text-color);
  font-family: var(--page-font-family);
  font-size: var(--body-font-size, 10pt);
  font-weight: var(--body-font-weight, 400);
  line-height: 1.35;
  padding:
    var(--page-padding-top)
    var(--page-padding-right)
    var(--page-padding-bottom)
    var(--page-padding-left);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
}

.classic-cv-page * {
  box-sizing: border-box;
}

.classic-cv-page a {
  color: inherit;
  text-decoration: underline;
}

.classic-cv-page a:hover {
  color: var(--heading-color);
}

.classic-cv-page .contact a {
  text-decoration: none;
}

.classic-cv-page .contact a:hover {
  text-decoration: none;
}

.classic-cv-page .cv-header {
  text-align: center;
  margin-bottom: 6pt;
  break-inside: avoid-page;
  page-break-inside: avoid;
}

.classic-cv-page .name {
  font-size: var(--name-font-size, 16pt);
  font-variant: small-caps;
  font-weight: var(--name-font-weight, 700);
  letter-spacing: 0.5px;
  line-height: 1.2;
  margin: 0;
}

.classic-cv-page .designation,
.classic-cv-page .contact {
  font-size: var(--header-text-font-size, 10pt);
  font-weight: var(--header-text-font-weight, 400);
  margin: 4pt 0 0;
}

.classic-cv-page .sep {
  margin: 0 4px;
}

.classic-cv-page .cv-section {
  margin-top: 8pt;
  break-inside: auto;
  page-break-inside: auto;
}

.classic-cv-page .entry,
.classic-cv-page .education-row,
.classic-cv-page .entry-header {
  break-inside: avoid-page;
  page-break-inside: avoid;
}

.classic-cv-page .section-title {
  font-size: var(--section-title-font-size, 12pt);
  font-weight: var(--section-title-font-weight, 700);
  font-variant: small-caps;
  color: var(--heading-color);
  border-bottom: 1px solid var(--rule-color);
  padding-bottom: 1pt;
  margin: 0 0 4pt;
  letter-spacing: 0.3px;
  break-after: avoid-page;
  page-break-after: avoid;
}

.classic-cv-page .summary,
.classic-cv-page .bullets li {
  font-size: var(--body-font-size, 10pt);
  font-weight: var(--body-font-weight, 400);
  text-align: justify;
  orphans: 3;
  widows: 3;
}

.classic-cv-page .summary,
.classic-cv-page .skill-line {
  margin-top: 2pt;
}

.classic-cv-page .tag-section {
  display: grid;
  gap: 8pt;
}

.classic-cv-page .tag-line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6pt 3pt;
}

.classic-cv-page .tag-line > strong {
  flex-shrink: 0;
  font-size: var(--subheading-font-size, 10pt);
  font-weight: var(--subheading-font-weight, 700);
}

.classic-cv-page .tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 3pt;
}

.classic-cv-page .tag-pill {
  display: inline-flex;
  align-items: center;
  padding: 1.5pt 5pt;
  border: 0.8pt solid color-mix(in srgb, var(--heading-color) 22%, white);
  border-radius: 5pt;
  background: color-mix(in srgb, var(--heading-color) 8%, white);
  font-size: var(--tag-font-size, 8.5pt);
  font-weight: var(--tag-font-weight, 400);
  line-height: 1.2;
}

.classic-cv-page .entry {
  margin-top: 4pt;
  padding-left: 0.15in;
}

.classic-cv-page .entry + .entry {
  margin-top: 6pt;
}

.classic-cv-page .entry-header,
.classic-cv-page .education-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 12px;
  width: 100%;
}

.classic-cv-page .entry-header > span:first-child {
  min-width: 0;
}

.classic-cv-page .entry-header strong,
.classic-cv-page .education-row strong {
  font-size: var(--subheading-font-size, 10pt);
  font-weight: var(--subheading-font-weight, 700);
}

.classic-cv-page .company {
  font-size: calc(var(--subheading-font-size, 10pt) * 0.95);
}

.classic-cv-page .date {
  font-style: italic;
  white-space: nowrap;
}

.classic-cv-page .bullets {
  list-style: disc;
  padding-left: 0.2in;
  margin-top: 2pt;
}

.classic-cv-page .bullets li {
  margin-bottom: 1pt;
}

.classic-cv-page .education-row {
  padding-left: 0.15in;
  margin-top: 2pt;
}

.classic-cv-page .education-mid {
  flex: 1;
  text-align: center;
}

@media print {
  body {
    background: #fff;
  }

  .classic-cv-page {
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
  .classic-cv-page {
    width: 100%;
    min-height: auto;
    box-shadow: none;
    padding: 24px 18px;
  }

  .classic-cv-page .entry-header,
  .classic-cv-page .education-row {
    grid-template-columns: 1fr;
    align-items: flex-start;
    gap: 2px;
  }

  .classic-cv-page .education-mid {
    text-align: left;
  }
}
`

type ClassicCvPreviewProps = {
  resume: ResumeData
  includeStyles?: boolean
}

function renderEntry(entry: ResumeEntry) {
  return (
    <div className="entry" key={entry.id}>
      <div className="entry-header">
        <span>
          <strong>{entry.title}</strong>{' '}
          {entry.subtitle ? <span className="company">{entry.subtitle}</span> : null}
        </span>
        <span className="date">{entry.date}</span>
      </div>
      <ul className="bullets">
        {entry.bullets.map((bullet, index) => (
          <li key={`${entry.id}-${index}`}>{bullet}</li>
        ))}
      </ul>
    </div>
  )
}

export function ClassicCvPreview({
  resume,
  includeStyles = false,
}: ClassicCvPreviewProps) {
  const pageSize = documentPageDimensions[resume.styleSettings.pageSize]
  const gutterSplit = resume.styleSettings.gutter / 2
  const pageStyle = {
    '--heading-color': resume.styleSettings.accentColor,
    '--rule-color': resume.styleSettings.accentColor,
    '--page-width': `${pageSize.width}in`,
    '--page-height': `${pageSize.height}in`,
    '--page-padding-top': `${resume.styleSettings.margins.top}in`,
    '--page-padding-right': `${resume.styleSettings.margins.right + gutterSplit}in`,
    '--page-padding-bottom': `${resume.styleSettings.margins.bottom}in`,
    '--page-padding-left': `${resume.styleSettings.margins.left + gutterSplit}in`,
    '--page-font-family': documentFontStacks[resume.styleSettings.fontFamily],
    ...documentTypographyCssVars(resume.styleSettings.typography),
  } as React.CSSProperties

  const sectionContent: Record<ResumeSectionId, React.ReactNode> = {
    summary: (
      <section className="cv-section" key="summary">
        <h2 className="section-title">{resume.sectionTitles.summary}</h2>
        <p className="summary">{resume.summary}</p>
      </section>
    ),
    workExperience: (
      <section className="cv-section" key="workExperience">
        <h2 className="section-title">{resume.sectionTitles.workExperience}</h2>
        {resume.workExperience.map(renderEntry)}
      </section>
    ),
    selectedProjects: (
      <section className="cv-section" key="selectedProjects">
        <h2 className="section-title">{resume.sectionTitles.selectedProjects}</h2>
        {resume.selectedProjects.map(renderEntry)}
      </section>
    ),
    achievements: (
      <section className="cv-section" key="achievements">
        <h2 className="section-title">{resume.sectionTitles.achievements}</h2>
        {resume.achievements.map(renderEntry)}
      </section>
    ),
    skills: (
      <section className="cv-section" key="skills">
        <h2 className="section-title">{resume.sectionTitles.skills}</h2>
        <div className="tag-section">
          <div className="tag-line">
            <strong>Technical skills:</strong>
            {resume.skills.technical.map((skill) => (
              <span className="tag-pill" key={skill}>
                {skill}
              </span>
            ))}
          </div>
          <div className="tag-line">
            <strong>Soft skills:</strong>
            {resume.skills.soft.map((skill) => (
              <span className="tag-pill" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
    ),
    tools: (
      <section className="cv-section" key="tools">
        <h2 className="section-title">{resume.sectionTitles.tools}</h2>
        <div className="tag-row">
          {resume.tools.map((tool) => (
            <span className="tag-pill" key={tool}>
              {tool}
            </span>
          ))}
        </div>
      </section>
    ),
    education: (
      <section className="cv-section" key="education">
        <h2 className="section-title">{resume.sectionTitles.education}</h2>
        <div className="education-row">
          <span>
            <strong>{resume.education.degree}</strong>
          </span>
          <span className="education-mid">
            {resume.education.institution} ({resume.education.date})
          </span>
        </div>
      </section>
    ),
  }

  const visibleSections = resume.sectionOrder.filter(
    (sectionId) => !resume.hiddenSections.includes(sectionId),
  )
  const fontStylesheet = getDocumentFontStylesheet(resume.styleSettings.fontFamily)

  return (
    <>
      {fontStylesheet ? <link rel="stylesheet" href={fontStylesheet} /> : null}
      {includeStyles ? <style>{classicCvStyles}</style> : null}
      <main className="classic-cv-page" style={pageStyle}>
        <header className="cv-header">
          <h1 className="name">{resume.personal.fullName}</h1>
          <p className="designation">{resume.personal.headline}</p>
          <p className="contact">
            {resume.personal.location}
            <span className="sep">|</span>
            <a href={`tel:${resume.personal.phone}`}>{resume.personal.phone}</a>
            <span className="sep">|</span>
            <a href={`mailto:${resume.personal.email}`}>{resume.personal.email}</a>
            {resume.personal.links.map((link) => (
              <span key={link.id}>
                <span className="sep">|</span>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </span>
            ))}
          </p>
        </header>

        {visibleSections.map((sectionId) => sectionContent[sectionId])}
      </main>
    </>
  )
}
