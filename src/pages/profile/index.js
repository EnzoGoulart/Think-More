import { useEffect, useContext, useState } from "react";
import Footer from "../../components/footer";
import Header from "../../components/header";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { Context } from "../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
//certo vai setar o coiso e cancel vai fazer a state ser igual ao valor novamente
import FotoP from "../../imgs/iconePerfil.png";
import { db } from "../../firebase";
import "./profile.css";
export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser, idPost, setIdPost } = useContext(Context);
  const [newUsername, setNewUsername] = useState("");
  const [newBio, setNewBio] = useState("");
  useEffect(() => {
    async function getD() {
      try {
        const userDocRef = doc(db, "data", user.id);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUser({
            user: data?.email,
            password: data?.password,
            id: user?.id,
            username: data?.username,
            profile: {
              photo: data?.photo,
              bio: data?.bio,
            },
          });
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          console.log("Documento não encontrado no Firestore.");
        }
      } catch (error) {
        console.error("Erro ao obter usuário:", error.message);
        setUser(JSON.parse(localStorage.getItem("user")));
      } finally {
        setNewUsername(user.username);
        setNewBio(user.profile.bio || '');
        console.clear()
      }
    }
    getD();
  }, [user.id, setUser]);

  async function HLogout() {
    await signOut(auth)
      .then(() => {
        toast.success("exiting...");
        localStorage.clear();
        navigate("/");
        setIdPost(0)
        setUser({
          user: null,
          username: null,
          password: null,
          profile: {
            photo: null,
            bio: null,
          },
        });
      })
      .catch((e) => {
        toast.error("error");
        console.log(e);
      });
  }
  async function setNewProfile() {
    if (newUsername.length >= 4) {
      setUser({
        ...user,
        username: setNewUsername,
        password: null,
        profile: {
          photo: user.photo,
          bio: null,
        },
      });
      localStorage.setItem('user', JSON.stringify(user))
      const userDocRef = doc(db, "data", user.id);
      try {
        
        await setDoc(userDocRef, {
          username: newUsername,
          bio: newBio,
        }, { merge: true });
        console.log("Dados atualizados com sucesso!");
        toast.success(`successful update, ${newUsername}`)
      } catch (error) {
        console.error("Erro ao atualizar os dados:", error);
      }

    }
  }
  async function cancelAllAlterations(){
    setNewUsername(user.username)
    setNewBio(user.profile.bio)
    console.log(user)
  }
  return (
    <div>
      <Header />
      <div id="Profile">
        <FontAwesomeIcon icon={faTimes} id="cancelP" onClick={cancelAllAlterations} />
        <button id="btnH" onClick={HLogout}>
          Logout
        </button>
        <img id="imgPr" src={FotoP} />
        <label className="labelP">email</label>
        <input id="emailPr"  value={user.user} />
        <label className="labelP">username</label>
        <input
          id="usernamePr"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <label className="labelP">bio</label>
        <textarea
          id="txtaP"
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
        />
        <button
          id="botaoL"
          className="moreMarginOnProfile"
          onClick={setNewProfile}
        >
          Save all
        </button>
      </div>
      <Footer />
    </div>
  );
}
