import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import Loading from "../../components/loading";
import { collection, getDocs, query } from "firebase/firestore";
import { where } from "firebase/firestore";
import { db } from "../../firebase";
import Perfil from "../../imgs/iconePerfil.png";
import "./rp.css";
export default function ReadPost() {
  const navigate = useNavigate()
  const { email, number } = useParams();
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({});
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          let data = querySnapshot.docs.map((doc) => doc.data());
          
          data = data.filter((i)=>
            i.idPost === Number(number)
          )
          console.log(data)
          setPost(data[0]);

        } else {
          console.log("Nenhum documento encontrado com esse email.");
        }
      } catch (error) {
        console.error("Erro ao buscar o documento:", error);
      }
      setLoading(false)
    };
    fetchPost();
  }, [email]);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div id="CRP">
      <Header />
      <div id="divCRP">
        <div id="navigateCRP" onClick={()=> navigate(`/see/${encodeURIComponent(post.email)}/profile`)}>
          <div id="divPerfilCRP">
            <img id="imgCRP" src={Perfil} />
            <p id="unCRP">{post.username}</p>
          </div>
        </div>
        <div id="linha1CRP"></div>
        <p className="pDivisorCRP">title</p>
        <div id="linha2CRP"></div>
        <p id="titleCRP">{post.title}</p>
        <p className="pDivisorCRP">content</p>
        <div id="linha2CRP"></div>
        <p id="contentCRP">{post.content}</p>
      </div>
      <Footer />
    </div>
  );
}
