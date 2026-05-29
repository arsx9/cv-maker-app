import type { CoverLetterListItem } from './documents'
import { filterDocumentsByQuery } from './documentSearch'

export function filterCoverLettersByQuery(
  letters: CoverLetterListItem[],
  query: string,
): CoverLetterListItem[] {
  return filterDocumentsByQuery(letters, query)
}
