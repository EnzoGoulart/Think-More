import { useEffect, useContext, useState } from "react";
import Footer from "../../components/footer";
import Header from "../../components/header";
import { doc } from "firebase/firestore";
import {  getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { inMemoryPersistence, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { Context } from "../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
//certo vai setar o coiso e cancel vai fazer a state ser igual ao valor novamente
import FotoP from "../../imgs/iconePerfil.png";
import { db } from "../../firebase";
import "./profile.css";
import Loading from '../../components/loading'
export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser, idPost, setIdPost } = useContext(Context);
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false)
  const [newBio, setNewBio] = useState("");
  useEffect(() => {
    async function getD() {
      setNewBio(user.profile.bio)
      setNewUsername(user.username) 
      /*try {
        setLoading(true) 
        setUser(
          JSON.parse(localStorage.getItem('user')))
        const userDocRef = doc(db, "data", user.id);
        const docSnapshot = await getDoc(userDocRef); 
        if (docSnapshot.exists()) { 
          const data = docSnapshot.data();
          setUser({
            ...user,
            username: data?.username,
            profile: { 
              bio: data?.bio,
            },
          }); 
          
          localStorage.setItem("user", JSON.stringify(user));
          setNewUsername(user.username);
          setNewBio(user.profile.bio || '');
        } else {
          console.log("Documento não encontrado no Firestore.");
        }
      } catch (error) { 
        console.error("Erro ao obter usuário:", error.message); 
        toast.error('error')
      } finally { 
        setLoading(false)
      }*/
    }
    getD();
  }, [user.id, setUser]);

  async function HLogout() {
    setLoading(true)
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
      setLoading(false)
  }
  async function setNewProfile() {
    setLoading(true)
    console.clear()
    if (newUsername.length >= 4) {
      setUser({
        ...user,
        username: newUsername, 
        profile: {
          photo: user?.photo,
          bio: newBio,
        },
      });
      localStorage.setItem('user', JSON.stringify(user))
      const userDocRef = doc(db, "data", user.id);
      try {
        setLoading(true)
        await setDoc(userDocRef, {
          username: newUsername,
          bio: newBio,
        }, { merge: true });
        toast.success(`successful update, ${newUsername}`)
      } catch (error) {
        console.error("Erro ao atualizar os dados:", error);
      }
      setLoading(false)
    }
  }
  async function cancelAllAlterations(){
    setNewUsername(user.username)
    setNewBio(user.profile.bio || '')
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
      <Header />
      <div id="Profile">
        <FontAwesomeIcon icon={faTimes} id="cancelP" onClick={cancelAllAlterations} />
        <button id="btnH" onClick={HLogout}>
          Logout
        </button>
        <img id="imgPr" src={FotoP} />
          <label className="labelP">email </label>
        <input id="emailPr" onChange={()=>{let y = 1}} value={user.user} />
        <label className="labelP">username</label>
        <input maxLength={20}
          id="usernamePr"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <label className="labelP">biography</label>
        <textarea maxLength={120}
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
