import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Lock, Eye, ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import usuarioServices from "../services/usuarioServices";
// @ts-ignore: allow importing CSS without type declarations
import "../styles/registerForm.css";

const RegisterForm = () => {
  const [nickName, setNickName] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nickName || !nombre || !apellido || !password) { 
      setError("Completá todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const nuevoUsuario = await usuarioServices.postUsuario({
        nickName,
        nombre,
        apellido,
      });

      console.log("Usuario creado:", nuevoUsuario);
      alert("¡Cuenta creada con éxito!");
      navigate("/login");
    } catch (err: any) {
      const mensajeError = err.message || "Error al registrar";
      setError("Error al registrar: " + mensajeError);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="registro">
      <section className="registro__container">
        <div className="registro__info">
          <span className="registro__label">REGISTRO</span>

          <h1 className="registro__title">
            Crear <br />
            <span>cuenta.</span>
          </h1>

          <p className="registro__description">
            Completá el formulario para unirte.
          </p>
        </div>

        <section className="registro__form-card">
          <form className="registro-form" onSubmit={handleSubmit}>
            <label>
              NICKNAME *
              <div className="registro-form__input">
                <User size={17} />
                <input
                  type="text"
                  placeholder="ej: valen_ruiz"
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </label>

            <label>
              NOMBRE *
              <div className="registro-form__input">
                <User size={17} />
                <input
                  type="text"
                  placeholder="Valentina Ruiz"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={loading}
                />
              </div>
            </label>

            <label>
              APELLIDO *
              <div className="registro-form__input">
                <User size={17} />
                <input
                  type="text"
                  placeholder="Valentina Ruiz"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  disabled={loading}
                />
              </div>
            </label>

            <label>
              CONTRASEÑA *
              <div className="registro-form__input">
                <Lock size={17} />
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <Eye size={17} />
              </div>
            </label>

            {error && (
              <p className="registro-form__error">
                <AlertCircle size={16} />
                {error}
              </p>
            )}

            <button 
              className="registro-form__button" 
              type="submit"
              disabled={loading}
            >
              {loading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
              <ArrowRight size={17} />
            </button>

            <p className="registro-form__login">
              ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
            </p>
          </form>
        </section>
      </section>
    </main>
  );
};

export default RegisterForm;
