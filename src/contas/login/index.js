import { useState, useContext, useEffect } from "react";
import { Context } from "../../context/context";
import Logo from '../../imgs/logo.png'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
export default function Login() {
  const { user, setUser } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  useEffect(()=>{let x = JSON.parse(localStorage.getItem("user"));
  if (x) {
    
    console.log('reset')
    navigate("/home");
    return
  }},[navigate, setUser])

  

  async function logar(e) {
    e.preventDefault();
    if (email !== "" && senha !== "") {
      try{
      await signInWithEmailAndPassword(auth, email, senha)
        .then(() => {
          toast.success("Logado com sucesso");
          setUser({
            ...user,
            user: email,
            password: senha,
            
          });
          localStorage.setItem("user", JSON.stringify(user));
          navigate('/home')
        })
        .catch((e) => {
          //melhorar os erros aqui
          console.log(e);
        });}catch(e){
          console.log(e)
        }
    } else {
      if (email === "" && senha === "") {
        toast.error("Digite seu email e senha");
        return;
      } else if (email === "") {
        return toast.error("Digite seu email");
      } else if (senha === "") {
        return toast.error("Digite sua senha");
      }
      return toast.error("Digite corretamente");
    }
  }

  return (
    <div id="divL">
      <img src={Logo} id="h1L" />
      <h2 id="h2L">login</h2>
      <form onSubmit={logar} id="formL">
        <label className="labelL" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@email.com"
        />
        <label className="labelL" htmlFor="senha">
          Password
        </label>
        <input
          id="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="********"
        />
        <button id="botaoL" type="submit">
          Login
        </button>
      </form>
      <p id="pL">
        Dont have an account?{" "}
        <Link id="lL" to="/register">
          {" "}
          Register
        </Link>
      </p>
    </div>
  );
}
