import type { ResumeListItem } from './documents'
import { filterDocumentsByQuery } from './documentSearch'

export function filterResumesByQuery(
  resumes: ResumeListItem[],
  query: string,
): ResumeListItem[] {
  return filterDocumentsByQuery(resumes, query)
}
