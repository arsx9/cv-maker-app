import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CoverLetterEditorPage } from '../features/coverLetters/CoverLetterEditorPage'
import { CoverLetterListPage } from '../features/coverLetters/CoverLetterListPage'
import { ResumeEditorPage } from '../features/resumes/ResumeEditorPage'
import { ResumeListPage } from '../features/resumes/ResumeListPage'
import { AppLayout } from '../features/shared/AppLayout'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/resumes" replace />} />
          <Route path="/resumes" element={<ResumeListPage />} />
          <Route path="/resumes/:id/edit" element={<ResumeEditorPage />} />
          <Route path="/cover-letters" element={<CoverLetterListPage />} />
          <Route
            path="/cover-letters/:id/edit"
            element={<CoverLetterEditorPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
