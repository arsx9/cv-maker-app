export type TaggableDocument = {
  title: string
  tags: string[]
}

export function filterDocumentsByQuery<T extends TaggableDocument>(
  documents: T[],
  query: string,
): T[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return documents
  }

  return documents.filter((document) => {
    const titleMatches = document.title.toLowerCase().includes(normalizedQuery)
    const tagMatches = document.tags.some((tag) =>
      tag.toLowerCase().includes(normalizedQuery),
    )

    return titleMatches || tagMatches
  })
}
