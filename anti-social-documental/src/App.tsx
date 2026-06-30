import { Routes, Route, useNavigate, useLocation } from "react-router"
import { useState, useEffect } from "react"

import Header from "./component/Header"
import Footer from "./component/Footer"
import Inicio from "./pages/Inicio"
import Perfil from "./pages/Perfil"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NewPost from "./pages/NewPost"
import PostDetails from "./pages/PostDetails"

type Screen = "home" | "login" | "register" | "profile" | "create" | "post"

function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const navigate = useNavigate()
  const location = useLocation()

  // Sincronizar screen con la ruta actual
  useEffect(() => {
    const path = location.pathname
    if (path === "/" || path === "/inicio") setScreen("home")
    else if (path === "/login") setScreen("login")
    else if (path === "/register") setScreen("register")
    else if (path === "/perfil") setScreen("profile")
    else if (path === "/newPost") setScreen("create")
    else setScreen("post")
  }, [location.pathname])

  const handleNav = (s: Screen) => {
    setScreen(s)
    switch (s) {
      case "home":
        navigate("/")
        break
      case "login":
        navigate("/login")
        break
      case "register":
        navigate("/register")
        break
      case "profile":
        navigate("/perfil")
        break
      case "create":
        navigate("/newPost")
        break
      default:
        navigate("/")
    }
  }

  return(
    <div>
        <Header screen={screen} onNav={handleNav} />
        <Routes>
            <Route path="/" element={<Inicio/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/perfil" element={<Perfil/>} />
            <Route path="/newPost" element={<NewPost/>}/>
            <Route path="/postDetails/:idPost" element={<PostDetails/>}/>
        </Routes>

        <Footer/>
    </div>
  )
}

export default App
