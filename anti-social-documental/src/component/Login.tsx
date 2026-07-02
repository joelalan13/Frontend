import LoginForm from "./LoginForm";
// @ts-ignore: allow importing CSS without type declarations
import "../styles/login.css"

const Login = () => {
  return (
    <main className="login">

      <section className="login__container">

        <span className="login__subtitle">
          INICIO DE SESIÓN
        </span>

        <h1 className="login__title">
          Bienvenid@<span>.</span>
        </h1>
        
        <LoginForm />       

      </section>

    </main>
  );
};

export default Login;