function App() {
  return (
    <main className="min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <span className="badge text-bg-success mb-3">
                  Bootstrap + Sass configured
                </span>

                <h1 className="display-5 fw-bold mb-3">CV Maker App</h1>

                <p className="lead text-secondary mb-4">
                  Bootstrap styles are now loaded through Sass, and the dropdown
                  below confirms the Bootstrap JavaScript bundle is available.
                </p>

                <div className="d-flex flex-wrap gap-3">
                  <button type="button" className="btn btn-primary btn-lg">
                    Create Resume
                  </button>

                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-lg dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Test Bootstrap JS
                    </button>

                    <ul className="dropdown-menu">
                      <li>
                        <span className="dropdown-item-text">
                          Dropdown positioning is handled by Popper.
                        </span>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#features">
                          View configured features
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div id="features" className="row g-4 mt-1">
              <div className="col-md-4">
                <div className="feature-card card h-100 shadow-sm">
                  <div className="card-body">
                    <h2 className="h5">Bootstrap UI</h2>
                    <p className="text-secondary mb-0">
                      Utility classes and components are ready to use.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="feature-card card h-100 shadow-sm">
                  <div className="card-body">
                    <h2 className="h5">Sass Support</h2>
                    <p className="text-secondary mb-0">
                      Your theme now compiles from `index.scss`.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="feature-card card h-100 shadow-sm">
                  <div className="card-body">
                    <h2 className="h5">JS Components</h2>
                    <p className="text-secondary mb-0">
                      Interactive Bootstrap components work via the bundle import.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
