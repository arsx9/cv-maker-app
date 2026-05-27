import { NavLink, Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="builder-shell">
      <aside className="builder-sidebar">
        <div>
          <p className="eyebrow">CV Builder</p>
          <h1 className="sidebar-title">Resume and cover letter workspace</h1>
          <p className="sidebar-copy">
            Manage saved documents, edit content, reorder resume sections, and
            export polished PDFs from the same templates.
          </p>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/resumes"
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' sidebar-link-active' : ''}`
            }
          >
            Resumes
          </NavLink>
          <NavLink
            to="/cover-letters"
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' sidebar-link-active' : ''}`
            }
          >
            Cover Letters
          </NavLink>
        </nav>
      </aside>

      <div className="builder-content">
        <Outlet />
      </div>
    </div>
  )
}
