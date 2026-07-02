import { Routes, Route, useLocation } from "react-router-dom"
import { useMemo } from "react"

import Header from "./component/Header"
import Footer from "./component/Footer"
import Inicio from "./pages/Inicio"
import Perfil from "./pages/Perfil"
import PerfilUsuario from "./pages/PerfilUsuario"
import Login from "./component/Login"
import Register from "./component/RegisterForm"
import NewPost from "./pages/NewPost"
import PostDetails from "./pages/PostDetails"
import { ROUTES } from "./constants"

type Screen = "home" | "login" | "register" | "profile" | "create" | "post"

function App() {
  const location = useLocation()

  // Determinar screen actual basado en la ruta
  const screen: Screen = useMemo(() => {
    const path = location.pathname
    if (path === "/" || path === "/inicio") return "home"
    if (path === "/login") return "login"
    if (path === "/register") return "register"
    if (path === "/perfil") return "profile"
    if (path === "/newPost") return "create"
    return "post"
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('usuario')
  }

  const showHeader = !["login", "register"].includes(screen)

  return (
    <div>
      {showHeader && <Header screen={screen} onLogout={handleLogout} />}
      <Routes>
        <Route path={ROUTES.HOME} element={<Inicio />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.PROFILE} element={<Perfil />} />
        <Route path={ROUTES.PROFILE_USER} element={<PerfilUsuario />} />
        <Route path={ROUTES.NEW_POST} element={<NewPost />} />
        <Route path={ROUTES.POST_DETAILS} element={<PostDetails />} />
      </Routes>
    </div>
  )
}

export default App
