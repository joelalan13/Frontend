import React from "react"
import { useNavigate } from "react-router-dom"
import { Home, PenSquare, UserCircle, LogOut } from "lucide-react"
import "../styles/header.css"
import { ROUTES, LABELS } from "../constants"

type Screen = "login" | "register" | "home" | "post" | "create" | "profile"

const D = "'Bricolage Grotesque',sans-serif"

interface HeaderProps {
  screen: Screen
  onLogout: () => void
}

export default function Header({ screen, onLogout }: HeaderProps) {
  const navigate = useNavigate()
  const showNav = !["login", "register"].includes(screen)

  const navItems: { key: Screen; icon: React.ReactNode; label: string; route: string }[] = [
    { key: "home", icon: <Home size={15} />, label: LABELS.HOME, route: ROUTES.HOME },
    { key: "create", icon: <PenSquare size={15} />, label: LABELS.CREATE, route: ROUTES.NEW_POST },
    { key: "profile", icon: <UserCircle size={15} />, label: LABELS.PROFILE, route: ROUTES.PROFILE },
  ]

  const handleNav = (route: string) => {
    navigate(route)
  }

  const handleLogout = () => {
    onLogout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <header className="header">
      <div className="header__inner">
        {/* Logo */}
        <button className="header__logo-btn" onClick={() => handleNav(ROUTES.HOME)}>
          <span className="header__logo-text" style={{ fontFamily: D }}>
            anti<span className="header__logo-dash">-</span>social
          </span>
          <span className="header__logo-badge">UNAHUR</span>
        </button>

        {/* Nav */}
        {showNav && (
          <nav className="header__nav">
            {navItems.map(({ key, icon, label, route }) => (
              <button
                key={key}
                onClick={() => handleNav(route)}
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
              onClick={handleLogout}
              title={LABELS.LOGOUT}
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
              onClick={() => handleNav(ROUTES.LOGIN)}
            >
              {LABELS.LOGIN}
            </button>
            <button
              className={`header__auth-btn ${
                screen === "register" ? "header__auth-btn--active" : ""
              }`}
              onClick={() => handleNav(ROUTES.REGISTER)}
            >
              {LABELS.REGISTER}
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
