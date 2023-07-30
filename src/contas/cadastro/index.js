import { createUserWithEmailAndPassword } from "firebase/auth";
import Perfil from "../../imgs/icone.avif";
import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";
import { Context } from "../../context/context";
import Logo from "../../imgs/logo.png";
import { addDoc, setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import Loading from '../../components/loading'
export default function Cadastro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("");
  const { user, setUser } = useContext(Context);


  async function cadastrar(e) {
    e.preventDefault();
    let array = email.split("")
    let arroba = false
    let point = false
    let error = false
    array.forEach((e,i)=>{
      if(e === '@' && i !== 0){
        arroba = true
      }
      if(e === '.' && i!==1 && i!==2){
        point = true
      }
    })
    console.log(arroba, point, username, senha)
    if(username.length<4 || !arroba || !point || senha<6){
      if(username.length<4){
        return toast.error('username must have at least 4 caracteres')
      }
      if(!arroba || !point){
        return toast.error('write your best email')
      }
      if(senha<6){
        return toast.error('password too small')
      }
      return
    
    }
    try {
      setLoading(true)
      await createUserWithEmailAndPassword(auth, email, senha)
        .then(() => {
          toast.success("User registered");
          setUser({
            user: email,
            username,
            password: senha,
            profile: {
              photo: Perfil,
              bio: null,
            },
          });
        })
        .catch((e) => {
          toast.error(e.message);
          console.log(e);
          error = true
        });
    } catch (e) {
      console.log("aqui e: ", e);
      error = true
    }
    if(error){
      setLoading(false)
      return
      
    }
    try {
      const userRef = collection(db, "data");
      const documento = await addDoc(userRef, {
        username,
        email,
        password: senha,
        photo: Perfil,
      });
      console.log("doc: ", documento.id);
      const userDocRef = doc(db, "data", documento.id);
      await setDoc(
        userDocRef,
        {
          id: documento.id,
        },
        { merge: true }
      );
      localStorage.setItem("id", documento.id);
      setUser({
        user: email,
        username,
        id: documento.id,
        password: senha,
        profile: {
          photo: Perfil,
          bio: null,
        },
      });
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
      console.log(user)
      console.log(email, documento.id, username, senha)
    } catch (e) {
      console.log(e);
      console.log("aqui");
    }
    setLoading(false)
  }
  if(loading){
    return(
      <div>
        <Loading/>
      </div>
    )
  }
  return (
    <div>
      <div id="divR">
        <img src={Logo} id="h1L" />
        <h2 id="h2L">register</h2>
        <form onSubmit={cadastrar} id="formL">
          <label className="labelL" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Joaozinho123"
          />
          <label className="labelL" htmlFor="email">
            Email
          </label>
          <input
            id="email" type="email"
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
            register
          </button>
        </form>
        <p id="pL">
          Dont have an account?{" "}
          <Link id="lL" to="/">
            {" "}
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
