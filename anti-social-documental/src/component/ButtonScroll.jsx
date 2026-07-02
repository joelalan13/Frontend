import { useState } from "react"
import {Container, Row, Col} from "react-bootstrap"
import "../style/buttonscroll.css"

const ButtonScroll = ({setMostrar}) => {
  const [activo, setActivo] = useState(true)

  return (
    <div className="buttonscroll">
      <button
        className={`buttonscroll__btn ${activo ? "buttonscroll__btn--active" : ""}`}
        onClick={() => {setActivo(true);setMostrar(true)}}
      >
        Sugerencia
      </button>
      <button
        className={`buttonscroll__btn ${!activo ? "buttonscroll__btn--active" : ""}`}
        onClick={() => {setActivo(false);setMostrar(false)}}
      >
        Seguidos
      </button>
    </div>
  )
}

export default ButtonScroll