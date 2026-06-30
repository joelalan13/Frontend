import { useState } from "react";
import { User, Lock, Eye, ArrowRight } from "lucide-react";
// @ts-ignore: allow importing CSS without type declarations
import "../styles/loginForm.css"

const LoginForm = () => {

    const [nickname,setNickname]=useState("");

    const [password,setPassword]=useState("");

    const handleSubmit=(e:React.FormEvent)=>{

        e.preventDefault();

        console.log(nickname,password);

    }

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