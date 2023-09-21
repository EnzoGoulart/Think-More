import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import './home.css'
import Header from "../../components/header";
import { useContext, useEffect, useState } from "react";
import Perfil from '../../imgs/iconePerfil.png'
import { Context } from "../../context/context";
import { doc, getDoc, getDocs, limit, orderBy,query, collection } from "firebase/firestore";
import Loading from "../../components/loading";
import { db } from "../../firebase";
export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [numPostsExibidos, setNumPostsExibidos] = useState(40)
  const [dados,setDados] = useState([])
  const { user, setUser, idPost, setIdPost } = useContext(Context);
  useEffect(() => {
    async function getD() {
      setLoading(true);
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
        console.error("Erro ao obter usuário:", error);
        setUser(JSON.parse(localStorage.getItem("user")));
        return;
      }

      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, limit(40), orderBy("date", "asc"));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map((doc) => doc.data());
          setDados(data)
        } else {
          console.log("Documento não encontrado no Firestore.");
        }
      } catch (error) {
        console.error("Erro ao obter usuário:", error.message);
        setUser(JSON.parse(localStorage.getItem("user")));
      } finally {
        setLoading(false);
      }
    }

    getD();
  }, [user.id, user.user]);


  async function carregarMaisPosts() {
    setLoading(true);
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, limit(numPostsExibidos + 40), orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setDados(data);
        setNumPostsExibidos((prevNumPosts) => prevNumPosts + 40);
      } else {
        console.log("Documento não encontrado no Firestore.");
      }
    } catch (error) {
      console.error("Erro ao obter usuário:", error.message);
      setUser(JSON.parse(localStorage.getItem("user")));
    } finally {
      setLoading(false);
    }
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
      <Header />
      <div id="containerH">
          {dados.length>0?(
            dados.reverse().map(post=>{
                return(
                    <div
                    onClick={() => {
                      navigate(`/${post.email}/${post.idPost}`);
                    }}
                    id="containerPostSP"
                    key={post.idPost}
                  >
                    <img src={Perfil} />
                    <div id="contentPostSP">
                      <p id="titlePostSP">{post.title}</p>
                      <div id="linhaPostSP"></div>
                      <p id="contentPostSP">{post.content}</p>
                      <p id="usernamePostSP">{post.username}</p>
                    </div>
                  </div>
                )
            })
          ):(
            <div id='divNadaEncontradoPostSP'>nothing found</div>)}
          {dados.length>0 &&
                <button id="btnSMH"  onClick={carregarMaisPosts}>search more</button>
          }
      </div>
      <Footer />
    </div>
  );
}
