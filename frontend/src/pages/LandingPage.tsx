import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuth();

  // Redirect to appropriate dashboard if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isLoggedIn, role, navigate]);

  return (
    <div
      style={{
        backgroundColor: "var(--spotify-black)",
        color: "var(--text-white)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Navigation Header */}
      <header
        className="d-flex justify-content-between align-items-center py-3 px-4 px-md-5 border-bottom"
        style={{
          borderColor: "var(--border-gray)",
          backgroundColor: "rgba(18, 18, 18, 0.95)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize: "2rem" }}>🎵</span>
          <span
            className="h3 m-0 fw-bold"
            style={{
              letterSpacing: "-1px",
              fontFamily: "var(--font-heading)",
              background: "linear-gradient(to right, #1db954, #1ed760, #ffffff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SpotiMERN
          </span>
        </div>
        <div className="d-flex gap-3">
          <Link to="/login" className="btn btn-spotify-outline btn-sm px-3 py-2">
            SIGN IN
          </Link>
          <Link to="/register" className="btn btn-spotify btn-sm px-3 py-2">
            GET STARTED
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="text-center py-5 px-3 d-flex flex-column align-items-center justify-content-center flex-grow-1"
        style={{
          background: "radial-gradient(circle at top, rgba(29, 185, 84, 0.15) 0%, var(--spotify-black) 70%)",
          minHeight: "75vh",
        }}
      >
        <div className="container" style={{ maxWidth: "800px" }}>
          <span
            className="badge rounded-pill bg-dark border border-success text-success px-3 py-2 mb-4 animate-fade-in"
            style={{ fontSize: "0.85rem", letterSpacing: "1px", fontWeight: 700 }}
          >
            🚀 THE ULTIMATE MUSIC COMPANION
          </span>
          <h1
            className="display-3 fw-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)", lineHeight: "1.1", letterSpacing: "-1.5px" }}
          >
            Your Music, Your Rules. <br />
            <span style={{ color: "var(--spotify-green)" }}>Streamlined.</span>
          </h1>
          <p className="lead text-light-gray mb-5 px-md-5" style={{ fontSize: "1.2rem", color: "#b3b3b3" }}>
            Experience seamless audio playback, real-time catalogue updates, and personalized playlist management with our next-generation audio portal.
          </p>

          {/* Action grid */}
          <div className="row g-3 justify-content-center">
            {/* User portal */}
            <div className="col-12 col-sm-6 col-md-5">
              <div
                className="p-4 rounded-4 border text-start h-100 d-flex flex-column justify-content-between"
                style={{
                  backgroundColor: "rgba(24, 24, 24, 0.6)",
                  borderColor: "var(--border-gray)",
                  backdropFilter: "blur(5px)",
                }}
              >
                <div>
                  <h4 className="text-white fw-bold mb-2">Listener Portal</h4>
                  <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                    Create custom playlists, explore curated tracks, search by artist or album, and stream high-quality audio.
                  </p>
                </div>
                <div className="d-grid gap-2 mt-4">
                  <Link to="/login" className="btn btn-spotify text-center py-2.5">
                    USER LOGIN
                  </Link>
                  <Link to="/register" className="btn btn-spotify-outline text-center py-2.5">
                    USER SIGNUP
                  </Link>
                </div>
              </div>
            </div>

            {/* Admin portal */}
            <div className="col-12 col-sm-6 col-md-5">
              <div
                className="p-4 rounded-4 border text-start h-100 d-flex flex-column justify-content-between"
                style={{
                  backgroundColor: "rgba(24, 24, 24, 0.6)",
                  borderColor: "var(--border-gray)",
                  backdropFilter: "blur(5px)",
                }}
              >
                <div>
                  <h4 className="text-white fw-bold mb-2">Admin Portal</h4>
                  <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                    Manage the song catalog, modify track metadata, manage users, toggle listing visibility, and audit notifications.
                  </p>
                </div>
                <div className="d-grid gap-2 mt-4">
                  <Link to="/admin/login" className="btn btn-spotify text-center py-2.5">
                    ADMIN LOGIN
                  </Link>
                  <Link to="/admin/register" className="btn btn-spotify-outline text-center py-2.5">
                    ADMIN REGISTER
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 px-3 border-top" style={{ backgroundColor: "#0b0b0b", borderColor: "var(--border-gray)" }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Why SpotiMERN?
            </h2>
            <p className="text-muted" style={{ maxWidth: "500px", margin: "0 auto" }}>
              Explore advanced options designed specifically for a modern, responsive web experience.
            </p>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-md-4">
              <div className="p-4 rounded-3 h-100 text-start" style={{ backgroundColor: "var(--spotify-dark-gray)", border: "1px solid var(--border-gray)" }}>
                <span className="h1 text-success mb-3 d-block">⚡</span>
                <h4 className="text-white fw-bold mb-2">Instant Playback</h4>
                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                  A global persistent audio controller allows you to browse and skip songs without pausing your queue.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-3 h-100 text-start" style={{ backgroundColor: "var(--spotify-dark-gray)", border: "1px solid var(--border-gray)" }}>
                <span className="h1 text-success mb-3 d-block">📁</span>
                <h4 className="text-white fw-bold mb-2">Playlist Control</h4>
                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                  Easily group audio files into dynamic playlists. Add and remove tracks on-the-fly from the catalog.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-3 h-100 text-start" style={{ backgroundColor: "var(--spotify-dark-gray)", border: "1px solid var(--border-gray)" }}>
                <span className="h1 text-success mb-3 d-block">🔔</span>
                <h4 className="text-white fw-bold mb-2">Real-time Feeds</h4>
                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                  Stay up to date with instant system-level alerts and updates as new songs are compiled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5 px-3" style={{ backgroundColor: "var(--spotify-black)" }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-start">
              <h2 className="display-5 fw-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Clean, Responsive Interface
              </h2>
              <div className="d-flex gap-3 mb-4">
                <div className="text-success h4">✓</div>
                <div>
                  <h5 className="text-white fw-bold">Fluid Sidebar Layout</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    Responsive sidebar layout collapses seamlessly on tablet and mobile interfaces.
                  </p>
                </div>
              </div>
              <div className="d-flex gap-3 mb-4">
                <div className="text-success h4">✓</div>
                <div>
                  <h5 className="text-white fw-bold">WCAG Contrast Compliance</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    Refreshed color styles elevate contrast ratio for high-visibility text displays.
                  </p>
                </div>
              </div>
              <div className="d-flex gap-3">
                <div className="text-success h4">✓</div>
                <div>
                  <h5 className="text-white fw-bold">Dynamic State Controls</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    Global login state maintains persistent state cache across tab refreshes automatically.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="p-5 rounded-4 border text-center"
                style={{
                  background: "linear-gradient(135deg, #181818 0%, #282828 100%)",
                  borderColor: "var(--border-gray)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                <div className="display-1 mb-3">🎧</div>
                <h3 className="text-white fw-bold mb-2">Feel the Beats</h3>
                <p className="text-muted mb-4">
                  Stream premium audio with instant access control dashboard.
                </p>
                <Link to="/register" className="btn btn-spotify py-2.5 px-4">
                  CREATE FREE ACCOUNT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 px-3 border-top" style={{ backgroundColor: "#0b0b0b", borderColor: "var(--border-gray)" }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              How It Works
            </h2>
            <p className="text-muted">A standard 3-step pipeline to get streaming.</p>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-md-4 text-center">
              <div className="p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-black fw-bold"
                  style={{ width: "60px", height: "60px", backgroundColor: "var(--spotify-green)", fontSize: "1.5rem" }}
                >
                  1
                </div>
                <h5 className="text-white fw-bold">Sign Up</h5>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Create an account in seconds. Select admin or standard listener status.
                </p>
              </div>
            </div>

            <div className="col-md-4 text-center">
              <div className="p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-black fw-bold"
                  style={{ width: "60px", height: "60px", backgroundColor: "var(--spotify-green)", fontSize: "1.5rem" }}
                >
                  2
                </div>
                <h5 className="text-white fw-bold">Organize Tracks</h5>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Create customized playlists, search the catalogs, and build your digital library.
                </p>
              </div>
            </div>

            <div className="col-md-4 text-center">
              <div className="p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-black fw-bold"
                  style={{ width: "60px", height: "60px", backgroundColor: "var(--spotify-green)", fontSize: "1.5rem" }}
                >
                  3
                </div>
                <h5 className="text-white fw-bold">Stream Anywhere</h5>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Experience fluid, uninterrupted playback across desktop, tablet, or smartphone viewports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-5 px-4 px-md-5 mt-auto text-start border-top"
        style={{ backgroundColor: "var(--spotify-black)", borderColor: "var(--border-gray)", fontSize: "0.85rem" }}
      >
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span style={{ fontSize: "1.5rem" }}>🎵</span>
                <span className="h5 m-0 fw-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  SpotiMERN
                </span>
              </div>
              <p className="text-muted mb-0" style={{ maxWidth: "300px" }}>
                A premium full-stack responsive web audio catalog library application built using MongoDB, Express, React, and Node.js.
              </p>
            </div>
            <div className="col-md-3">
              <h6 className="text-white fw-bold mb-3 uppercase">App Entry</h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li>
                  <Link to="/login" className="text-muted text-decoration-none hover-white">
                    User Signin
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-muted text-decoration-none hover-white">
                    User Signup
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="text-white fw-bold mb-3 uppercase">Administration</h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li>
                  <Link to="/admin/login" className="text-muted text-decoration-none hover-white">
                    Admin Signin
                  </Link>
                </li>
                <li>
                  <Link to="/admin/register" className="text-muted text-decoration-none hover-white">
                    Admin Signup
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <hr className="my-4" style={{ borderColor: "var(--border-gray)" }} />
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <span className="text-muted">© 2026 SpotiMERN. All rights reserved.</span>
            <span className="text-muted">
              Designed for premium visual excellence.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
