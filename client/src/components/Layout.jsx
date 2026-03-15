import { NavLink } from "react-router-dom";

const navLinkBase =
  "text-sm uppercase tracking-widest px-3 py-2 rounded-full transition";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand via-white to-clay/40">
      <header className="px-6 py-6">
        <div className="section-card max-w-6xl mx-auto px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-moss">Video Studio</p>
            <h1 className="font-display text-3xl text-ink">Classic Video Gallery</h1>
          </div>
          <nav className="flex gap-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? "bg-ink text-white" : "bg-white text-ink hover:bg-ink/10"}`
              }
            >
              Gallery
            </NavLink>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? "bg-ink text-white" : "bg-white text-ink hover:bg-ink/10"}`
              }
            >
              Upload
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
