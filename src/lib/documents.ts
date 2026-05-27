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

export type DocumentFontKey = 'charter' | 'inter' | 'georgia' | 'garamond'

export type DocumentPageSizeKey = 'a4' | 'letter'

export type DocumentMargins = {
  top: number
  right: number
  bottom: number
  left: number
}

export type DocumentStyleSettings = {
  accentColor: string
  fontFamily: DocumentFontKey
  pageSize: DocumentPageSizeKey
  gutter: number
  margins: DocumentMargins
}

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
  data: ResumeData
  createdAt: string
  updatedAt: string
}

export type ResumeListItem = Pick<
  ResumeRecord,
  'id' | 'title' | 'templateKey' | 'updatedAt'
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
  linkedResumeId: string | null
  data: CoverLetterData
  createdAt: string
  updatedAt: string
}

export type CoverLetterListItem = Pick<
  CoverLetterRecord,
  'id' | 'title' | 'linkedResumeId' | 'updatedAt'
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

export const documentFontOptions: Array<{
  id: DocumentFontKey
  label: string
}> = [
  { id: 'charter', label: 'Charter Serif' },
  { id: 'inter', label: 'Inter Sans' },
  { id: 'georgia', label: 'Georgia Serif' },
  { id: 'garamond', label: 'Garamond Serif' },
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
