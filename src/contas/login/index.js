import { useState, useContext, useEffect } from "react";
import { Context } from "../../context/context";
import Logo from "../../imgs/logo.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { collection, query, getDocs, where } from "firebase/firestore";
import "./login.css";
import { db } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
export default function Login() {
  const { user, setUser } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  useEffect(() => {
    async function get() {
      let local = localStorage.getItem("user");
      if (!local) {
        return;
      }
      let ls = JSON.parse(local);
      if (ls.user) {
        const postsRef = collection(db, "data");
        const q = query(postsRef, where("email", "==", ls.user));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map((doc) => doc.data());
          console.log(data[0].password);
          let dado = data[0];
          if (data[0].password === ls.password) {
            setUser({
              id: dado?.id,
              user: dado?.user,
              password: dado?.password,
              username: dado?.username,
              profile: {
                bio: dado?.bio,
                photo: null,
              },
            });
            navigate("/home");
          }
        } else {
          console.log("Documento não encontrado no Firestore.");
        }
      }
    }
    get();
  }, [navigate, setUser]);

  async function logar(e) {
    e.preventDefault();
    if (email !== "" && senha !== "") {
      try {
        await signInWithEmailAndPassword(auth, email, senha)
          .then(() => {})
          .catch((e) => {
            toast.error("error");
            console.log(e);
          });
      } catch (e) {
        console.log(e);
        return toast.error("cant be loged");
      }
      try {
        const postsRef = collection(db, "data");
        const q = query(postsRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          console.log("a");
          const data = querySnapshot.docs.map((doc) => doc.data());
          console.log(data);
          toast.success("Logado com sucesso");
          setUser({
            id: data[0].id,
            user: data[0].email,
            username: data[0].username,
            password: data[0].password,
            profile: {
              photo: null,
              bio: data[0].bio,
            },
          });

          console.log(user)
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/home");
        } else {
          console.log("nada aqui");
        }
      } catch (e) {
        console.log(e.message);
        toast.error("cant be loged");
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
