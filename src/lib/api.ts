import type {
  CoverLetterListItem,
  CoverLetterRecord,
  ResumeListItem,
  ResumeRecord,
} from './documents'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  })

  if (!response.ok) {
    let message = 'Something went wrong.'

    try {
      const payload = (await response.json()) as { error?: string }
      message = payload.error || message
    } catch {
      message = response.statusText || message
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const api = {
  getResumes() {
    return request<ResumeListItem[]>('/resumes')
  },
  getResume(id: string) {
    return request<ResumeRecord>(`/resumes/${id}`)
  },
  createResume() {
    return request<ResumeRecord>('/resumes', { method: 'POST' })
  },
  updateResume(id: string, payload: Pick<ResumeRecord, 'title' | 'data' | 'templateKey'>) {
    return request<ResumeRecord>(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
  deleteResume(id: string) {
    return request<void>(`/resumes/${id}`, { method: 'DELETE' })
  },
  getCoverLetters() {
    return request<CoverLetterListItem[]>('/cover-letters')
  },
  getCoverLetter(id: string) {
    return request<CoverLetterRecord>(`/cover-letters/${id}`)
  },
  createCoverLetter() {
    return request<CoverLetterRecord>('/cover-letters', { method: 'POST' })
  },
  updateCoverLetter(
    id: string,
    payload: Pick<CoverLetterRecord, 'title' | 'data' | 'linkedResumeId'>,
  ) {
    return request<CoverLetterRecord>(`/cover-letters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
  deleteCoverLetter(id: string) {
    return request<void>(`/cover-letters/${id}`, { method: 'DELETE' })
  },
}

export function getResumePdfUrl(id: string) {
  return `${API_BASE}/resumes/${id}/pdf`
}

export function getCoverLetterPdfUrl(id: string) {
  return `${API_BASE}/cover-letters/${id}/pdf`
}
