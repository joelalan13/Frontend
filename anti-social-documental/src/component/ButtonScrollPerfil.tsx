import { useState } from "react"
// @ts-ignore
import "../styles/buttonscroll.css"
interface Props {
    activo: boolean;
    setActivo: (valor: boolean) => void;
}

const ButtonScrollPerfil = ({ activo, setActivo }: Props) => {
    return (
        <div className="buttonscroll">
            <button
                className={`buttonscroll__btn ${activo ? "buttonscroll__btn--active" : ""}`}
                onClick={() => setActivo(true)}
            >
                Imágenes
            </button>
            <button
                className={`buttonscroll__btn ${!activo ? "buttonscroll__btn--active" : ""}`}
                onClick={() => setActivo(false)}
            >
                Posts
            </button>
        </div>
    )
}

export default ButtonScrollPerfil