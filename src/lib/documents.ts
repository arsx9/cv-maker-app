export type ResumeSectionId =
  | 'summary'
  | 'workExperience'
  | 'selectedProjects'
  | 'achievements'
  | 'skills'
  | 'tools'
  | 'education'

export type ResumeLink = {
  id: string
  label: string
  url: string
}

export type ResumeEntry = {
  id: string
  title: string
  subtitle?: string
  date: string
  bullets: string[]
}

export type ResumeSkills = {
  technical: string[]
  soft: string[]
}

export type DocumentFontKey = 'charter' | 'inter' | 'georgia' | 'garamond' | 'lato'

export type DocumentPageSizeKey = 'a4' | 'letter'

export type DocumentMargins = {
  top: number
  right: number
  bottom: number
  left: number
}

export type DocumentTypography = {
  nameSize: number
  nameBold: boolean
  headerTextSize: number
  headerTextBold: boolean
  sectionTitleSize: number
  sectionTitleBold: boolean
  subheadingSize: number
  subheadingBold: boolean
  bodySize: number
  bodyBold: boolean
  tagSize: number
  tagBold: boolean
}

export type DocumentStyleSettings = {
  accentColor: string
  fontFamily: DocumentFontKey
  pageSize: DocumentPageSizeKey
  gutter: number
  margins: DocumentMargins
  typography: DocumentTypography
}

export type ResumeSectionTitles = Record<ResumeSectionId, string>

export type ResumeEducation = {
  degree: string
  institution: string
  date: string
}

export type ResumePersonalInfo = {
  fullName: string
  headline: string
  location: string
  phone: string
  email: string
  links: ResumeLink[]
}

export type ResumeData = {
  personal: ResumePersonalInfo
  styleSettings: DocumentStyleSettings
  summary: string
  sectionOrder: ResumeSectionId[]
  sectionTitles: ResumeSectionTitles
  hiddenSections: ResumeSectionId[]
  workExperience: ResumeEntry[]
  selectedProjects: ResumeEntry[]
  achievements: ResumeEntry[]
  skills: ResumeSkills
  tools: string[]
  education: ResumeEducation
}

export type ResumeRecord = {
  id: string
  title: string
  templateKey: string
  tags: string[]
  data: ResumeData
  createdAt: string
  updatedAt: string
}

export type ResumeListItem = Pick<
  ResumeRecord,
  'id' | 'title' | 'templateKey' | 'tags' | 'updatedAt'
>

export type CoverLetterData = {
  senderName: string
  senderLocation: string
  senderPhone: string
  senderEmail: string
  senderLinks: ResumeLink[]
  styleSettings: DocumentStyleSettings
  recipientName: string
  recipientTitle: string
  recipientCompany: string
  recipientAddress: string
  date: string
  subject: string
  greeting: string
  paragraphs: string[]
  closing: string
  signature: string
}

export type CoverLetterRecord = {
  id: string
  title: string
  tags: string[]
  linkedResumeId: string | null
  data: CoverLetterData
  createdAt: string
  updatedAt: string
}

export type CoverLetterListItem = Pick<
  CoverLetterRecord,
  'id' | 'title' | 'tags' | 'linkedResumeId' | 'updatedAt'
>

export const resumeSectionOptions: Array<{
  id: ResumeSectionId
  label: string
}> = [
  { id: 'summary', label: 'Professional Summary' },
  { id: 'workExperience', label: 'Work Experience' },
  { id: 'selectedProjects', label: 'Selected Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'skills', label: 'Skills' },
  { id: 'tools', label: 'Tools' },
  { id: 'education', label: 'Education' },
]

export const defaultResumeSectionTitles: ResumeSectionTitles = Object.fromEntries(
  resumeSectionOptions.map(({ id, label }) => [id, label]),
) as ResumeSectionTitles

export const defaultDocumentTypography: DocumentTypography = {
  nameSize: 16,
  nameBold: true,
  headerTextSize: 10,
  headerTextBold: false,
  sectionTitleSize: 12,
  sectionTitleBold: true,
  subheadingSize: 10,
  subheadingBold: true,
  bodySize: 10,
  bodyBold: false,
  tagSize: 8.5,
  tagBold: false,
}

export const documentTypographyFieldOptions = [
  { key: 'name', label: 'Name' },
  { key: 'headerText', label: 'Header text (headline & contact)' },
  { key: 'sectionTitle', label: 'Section headings' },
  { key: 'subheading', label: 'Subheadings (entry titles)' },
  { key: 'body', label: 'Body text (summary & bullets)' },
  { key: 'tag', label: 'Tags (skills & tools)' },
] as const satisfies ReadonlyArray<{
  key: 'name' | 'headerText' | 'sectionTitle' | 'subheading' | 'body' | 'tag'
  label: string
}>

function typographyFontWeight(bold: boolean) {
  return bold ? '700' : '400'
}

export function documentTypographyCssVars(
  typography: DocumentTypography,
): Record<string, string> {
  return {
    '--name-font-size': `${typography.nameSize}pt`,
    '--name-font-weight': typographyFontWeight(typography.nameBold),
    '--header-text-font-size': `${typography.headerTextSize}pt`,
    '--header-text-font-weight': typographyFontWeight(typography.headerTextBold),
    '--section-title-font-size': `${typography.sectionTitleSize}pt`,
    '--section-title-font-weight': typographyFontWeight(typography.sectionTitleBold),
    '--subheading-font-size': `${typography.subheadingSize}pt`,
    '--subheading-font-weight': typographyFontWeight(typography.subheadingBold),
    '--body-font-size': `${typography.bodySize}pt`,
    '--body-font-weight': typographyFontWeight(typography.bodyBold),
    '--tag-font-size': `${typography.tagSize}pt`,
    '--tag-font-weight': typographyFontWeight(typography.tagBold),
  }
}

export const documentFontOptions: Array<{
  id: DocumentFontKey
  label: string
}> = [
  { id: 'charter', label: 'Charter Serif' },
  { id: 'inter', label: 'Inter Sans' },
  { id: 'georgia', label: 'Georgia Serif' },
  { id: 'garamond', label: 'Garamond Serif' },
  { id: 'lato', label: 'Lato Sans' },
]

export const documentPageSizeOptions: Array<{
  id: DocumentPageSizeKey
  label: string
}> = [
  { id: 'a4', label: 'A4' },
  { id: 'letter', label: 'US Letter' },
]

export const documentFontStacks: Record<DocumentFontKey, string> = {
  charter:
    '"Charter", "Charter BT", "Bitstream Charter", "Sitka Text", "Cambria", "Georgia", serif',
  inter:
    'Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  georgia: 'Georgia, "Times New Roman", serif',
  garamond: '"EB Garamond", Garamond, "Times New Roman", serif',
  lato: 'Lato, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}

export const documentFontStylesheets: Partial<Record<DocumentFontKey, string>> = {
  lato: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&display=swap',
}

export function getDocumentFontStylesheet(
  fontFamily: DocumentFontKey,
): string | undefined {
  return documentFontStylesheets[fontFamily]
}

export const documentPageDimensions: Record<
  DocumentPageSizeKey,
  { width: number; height: number; printName: string }
> = {
  a4: {
    width: 8.27,
    height: 11.69,
    printName: 'A4',
  },
  letter: {
    width: 8.5,
    height: 11,
    printName: 'Letter',
  },
}
