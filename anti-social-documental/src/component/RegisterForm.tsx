import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Lock, Eye, ArrowRight, AlertCircle } from "lucide-react";
// @ts-ignore: allow importing CSS without type declarations
import "../styles/registerForm.css";

const RegisterForm = () => {
  const [nickName, setNickName] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickName || !nombreCompleto || !password) {
      setError("Completá todos los campos obligatorios.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    setError("");

    console.log({
      nickName,
      nombreCompleto,
      password,
    });
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
                />
              </div>
            </label>

            <label>
              NOMBRE COMPLETO *
              <div className="registro-form__input">
                <User size={17} />
                <input
                  type="text"
                  placeholder="Valentina Ruiz"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
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

            <button className="registro-form__button" type="submit">
              CREAR CUENTA
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