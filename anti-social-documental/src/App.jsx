import {Routes, Route} from "react-router"

import Header from "./component/Header"
import Footer from "./component/Footer"
import Inicio from "./pages/Inicio"
import Perfil from "./pages/Perfil"
import Login from "./pages/Login"
import NewPost from "./pages/NewPost"
import PostDetails from "./pages/PostDetails"
import Error404 from "./pages/Error404"

function App() {
  return(
    <div>
        <Header/>
        <Routes>
            <Route path="/" element={<Inicio/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/perfil" element={<Perfil/>} />
            <Route path="/newPost" element={<NewPost/>}/>
            <Route path="/postDetails/:idPost" element={<PostDetails/>}/>
             <Route path="/notFund" element={<Error404/>}/>
        </Routes>
    </div>
  )
}

export default App
