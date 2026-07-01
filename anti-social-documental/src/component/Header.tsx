import React from "react"
import { Home, PenSquare, UserCircle, LogOut } from "lucide-react"
import "../styles/header.css"

type Screen = "login" | "register" | "home" | "post" | "create" | "profile"

const D = "'Bricolage Grotesque',sans-serif"

interface HeaderProps {
  screen: Screen
  onNav: (s: Screen) => void
  onLogout: () => void
}

export default function Header({ screen, onNav, onLogout }: HeaderProps) {
  const showNav = !["login", "register"].includes(screen)

  const navItems: { key: Screen; icon: React.ReactNode; label: string }[] = [
    { key: "home", icon: <Home size={15} />, label: "Home" },
    { key: "create", icon: <PenSquare size={15} />, label: "Crear" },
    { key: "profile", icon: <UserCircle size={15} />, label: "Perfil" },
  ]

  return (
    <header className="header">
      <div className="header__inner">
        {/* Logo */}
        <button className="header__logo-btn" onClick={() => onNav("home")}>
          <span className="header__logo-text" style={{ fontFamily: D }}>
            anti<span className="header__logo-dash">-</span>social
          </span>
          <span className="header__logo-badge">UNAHUR</span>
        </button>

        {/* Nav */}
        {showNav && (
          <nav className="header__nav">
            {navItems.map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => onNav(key)}
                className={`header__nav-btn ${
                  screen === key ? "header__nav-btn--active" : ""
                }`}
              >
                {icon}
                <span className="header__nav-btn-label">{label}</span>
              </button>
            ))}
            <button
              className="header__logout-btn"
              onClick={onLogout}
              title="Cerrar sesión"
            >
              <LogOut size={13} />
            </button>
          </nav>
        )}

        {/* Auth Nav (login/register) */}
        {!showNav && (
          <nav className="header__auth-nav">
            <button
              className={`header__auth-btn ${
                screen === "login" ? "header__auth-btn--active" : ""
              }`}
              onClick={() => onNav("login")}
            >
              Login
            </button>
            <button
              className={`header__auth-btn ${
                screen === "register" ? "header__auth-btn--active" : ""
              }`}
              onClick={() => onNav("register")}
            >
              Registro
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
