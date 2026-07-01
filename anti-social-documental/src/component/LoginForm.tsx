import { useState } from "react";
import { User, Lock, Eye, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";
// @ts-ignore: allow importing CSS without type declarations
import "../styles/loginForm.css"

const LoginForm = () => {
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("¡Click detectado! Nickname:", nickname, "Password:", password);
        try {
            const response = await api.get('/usuarios'); // Obtiene la lista
            console.log("Respuesta de la API:", response.data);
            const usuarios = response.data;
            const usuarioEncontrado = usuarios.find((u: any) => 
            u.nickName.toLowerCase() === nickname.toLowerCase()
        );

            console.log("Usuario encontrado:", usuarioEncontrado);

            if (usuarioEncontrado && password === "123456") {
                localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
                console.log("Login exitoso, redirigiendo...");
                navigate('/perfil');
            } else {
                alert("Credenciales incorrectas o usuario no encontrado");
            }
        } catch (error) {
            console.error("Error al conectar", error);
            alert("Error de conexión con el servidor");
        }
    };

    return(

        <form
            className="login-form"
            onSubmit={handleSubmit}
        >

            <label>

                Nickname

                <div className="login-form__input">

                    <User size={18}/>

                    <input

                        type="text"

                        placeholder="ej: valen_ruiz"

                        value={nickname}

                        onChange={(e)=>setNickname(e.target.value)}

                    />

                </div>

            </label>

            <label>

                Contraseña

                <div className="login-form__input">

                    <Lock size={18}/>

                    <input

                        type="password"

                        placeholder="Tu contraseña"

                        value={password}

                        onChange={(e)=>setPassword(e.target.value)}

                    />

                    <Eye size={18}/>

                </div>

            </label>

            <button
                className="login-form__button"
                type="submit"
            >

                INGRESAR

                <ArrowRight size={18}/>

            </button>

            <p>

                ¿No tenés cuenta?

                <span> Registrate</span>

            </p>

        </form>

    )

}

export default LoginForm;