import { useState } from "react";
import { User, Lock, Eye, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import usuarioServices from "../services/usuarioServices";
// @ts-ignore: allow importing CSS without type declarations
import "../styles/loginForm.css"

const LoginForm = () => {
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        
        try {
            const usuarios = await usuarioServices.getUsuarios();
            const usuarioEncontrado = usuarios.find((u) =>
                u.nickName.toLowerCase() === nickname.toLowerCase()
            );

            if (usuarioEncontrado && password === "123456") {
                localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
                navigate('/perfil');
            } else {
                setError("Credenciales incorrectas o usuario no encontrado");
            }
        } catch (error) {
            console.error("Error al conectar", error);
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <label>Nickname
                <div className="login-form__input">
                    <User size={18} />
                    <input 
                        type="text" 
                        placeholder=" esteban123 " 
                        value={nickname} 
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
            </label>

            <label>Contraseña
                <div className="login-form__input">
                    <Lock size={18} />
                    <input 
                        type="password" 
                        placeholder="Tu contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <Eye size={18} />
                </div>
            </label>

            {error && (
                <p className="login-form__error" style={{ color: '#ff6b6b', marginBottom: '10px' }}>
                    {error}
                </p>
            )}

            <button
                className="login-form__button"
                type="submit">
                INGRESAR
                <ArrowRight size={18} />
            </button>

            <p>¿No tenés cuenta? <Link to="/register">Registrate</Link></p>
        </form>
    )
}

export default LoginForm;
