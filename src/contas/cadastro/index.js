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
import Loading from "../../components/loading";
import { Forca1, Forca2, Forca3, Forca4, Forca5, TxtDivSenha } from "./StyledCadastro";
export default function Cadastro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const { user, setUser } = useContext(Context);
  const [bar1, setBar1] = useState("");
  const [bar2, setBar2] = useState("");
  const [bar3, setBar3] = useState("");
  const [bar4, setBar4] = useState("");
  const [bar5, setBar5] = useState("");
  const [barAt, setBarAt] = useState("");
  function VerificarSenha( senha ) {
     
      const length = senha.length;
      const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(senha);
      const hasUpperCase = /[A-Z]/.test(senha);

      if (length < 6) {
        return [false, "Invalid - At least 6 characters"];
      }
      else if (hasSpecialChar && hasUpperCase) {
        return [true, "Very strong"];
      }
      else if (length >= 6 && !hasSpecialChar && !hasUpperCase) {
        return [true, "Weak"];
      } else if (
        (length >= 8 && hasSpecialChar) ||
        (length >= 8 && hasUpperCase)
      ) {
        return [true, "Strong"];
      } else if (
        (length >= 6 && length<8) &&(
        hasSpecialChar ||
        hasUpperCase)
      ) {
        return [true, "Normal"];
      }
      return [false, "Invalid - At least 6 characters"];
   
  }
  async function mudaSenha(e) {
    setSenha(e.target.value);
    console.log(senha)
    let senhaa = e.target.value
    let rank = VerificarSenha(senhaa);
    rank = rank[1]
    setTxt(rank)
    console.log(rank)
    if(rank === "Invalid - At least 6 characters"){
      setBar1("#D62C20")
      setBar2("#fff")
      setBar3("#fff")
      setBar4("#fff")
      setBar5("#fff")
      setBarAt("#D62C20")
    }else if(rank === "Weak"){
      setBar1("#fff")
      setBar2("#FA933A")
      setBar3("#fff")
      setBar4("#fff")
      setBar5("#fff")
      setBarAt("#FA933A")
    }else if(rank === "Normal"){
      setBar1("#fff")
      setBar2("#fff")
      setBar3("#FACD3C")
      setBar4("#fff")
      setBar5("#fff")
      setBarAt("#FACD3C") 
    }else if(rank === "Strong"){
      setBar1("#fff")
      setBar2("#fff")
      setBar3("#fff")
      setBar4("#BDD63C")
      setBar5("#fff")
      setBarAt("#BDD63C")  
    }else if(rank === "Very strong"){
      setBar1("#fff")
      setBar2("#fff")
      setBar3("#fff")
      setBar4("#fff")
      setBar5("#4AF022")
      setBarAt("#4AF022")  
    }
    
  }
  async function cadastrar(e) {
    e.preventDefault(); 

    let error = false

    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let emailValid = true
    if(!regex.test(email)){
      emailValid = false
    } 
    if (!emailValid || username.length < 4 || senha.length < 6 || senha.length > 20) {
      if (username.length < 4) {
        return toast.error("username must have at least 4 caracteres");
      } 
      if (!emailValid) {
        return toast.error("invalid email");
      } 
      if (senha.length < 6) {
        return toast.error("password too small");
      }
      if (senha.length > 20) {
        return toast.error("password can't be longer than 20 characters");
      }
      return;
    }
    try {
      setLoading(true);
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
          error = true;
        });
    } catch (e) {
      console.log("aqui e: ", e);
      error = true;
    }
    if (error) {
      setLoading(false);
      return;
    }
    try {
      const userRef = collection(db, "data");
      const documento = await addDoc(userRef, {
        username,
        email,
        password: senha,
        photo: Perfil,
      });

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
        profile: {
          photo: Perfil,
          bio: null,
        },
      });
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } catch (e) {
      console.log(e);
      console.log("aqui");
    }
    setLoading(false);
  }
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
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
            id="email"
            type="email"
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
            onChange={(e) => mudaSenha(e)}
            placeholder="********"
          />
          {senha.length>0 && (
          <div id="divSenhaL">
            <TxtDivSenha color={barAt}>{txt}</TxtDivSenha>
            <div id="divForcaL">
              <Forca1 bgcolor={bar1} className="forcaL"></Forca1>
              <Forca2 bgcolor={bar2} className="forcaL"></Forca2>
              <Forca3 bgcolor={bar3} className="forcaL"></Forca3>
              <Forca4 bgcolor={bar4} className="forcaL"></Forca4>
              <Forca5 bgcolor={bar5} className="forcaL"></Forca5>
                
            </div>
          </div>
          )}
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
