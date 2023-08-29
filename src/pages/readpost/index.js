import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/footer";
import { CountLikesPerfil } from "./countLikesPerfilCSS";
import Header from "../../components/header";
import { useContext, useEffect, useState } from "react";
import Loading from "../../components/loading";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { where } from "firebase/firestore";
import { db } from "../../firebase";
import Perfil from "../../imgs/iconePerfil.png";
import "./rp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Context } from "../../context/context";
export default function ReadPost() {
  const navigate = useNavigate()
  const { email, number } = useParams();
  const [posts, setPosts] = useState({});
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countLikesColor, setCountLikesColor] = useState('#272727')
  const { user, setUser, results, setResults } = useContext(Context);
  const [post, setPost] = useState({});
  useEffect(() => {
    loadLikes() 
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

  async function loadLikes(){ 
    try { 
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("email", "==", email), where("idPost", "==", parseInt(number)));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let data = querySnapshot.docs.map((doc) => doc.data()); 
        data = data[0]  
        if(data.curtidas){
          data.curtidas.forEach(e => {
            if(e == user.user){ 
              setLiked(true)
              setCountLikesColor('#FF6258')
            }
          });
          setLikes(data.curtidas)
        }
        
      }
    } catch (e) {
      console.log(e.message);
      toast.error("post wasn't found");
      return
    }
  }

  async function likeThePost(){
   
      try{
        let x = [];
        if(liked){
          console.log('b')
          x = likes.filter(e=> e!=user.user)
        }else{
          x = likes
    
          console.log(x)
        }
        setLikes(x)
        const userDocRef = doc(db, "posts", where("email","==",email),where("idPost", "==",parseInt(number)));
      
        await setDoc(userDocRef, {
          curtidas: likes,
        }, { merge: true });
      }catch(e){
        console.log(e.message)
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
    <div id="CRP">
      <Header />
      <div id="divCRP">
        <div id="divHPerfilCRP">
          <div id="navigateCRP" onClick={()=> navigate(`/see/${encodeURIComponent(post.email)}/profile`)}>
            <div id="divPerfilCRP">
              <img id="imgCRP" src={Perfil} />
              <p id="unCRP">{post.username}</p>
            </div>
          
          </div>
          <div id="divLikePerfilCRP" onClick={likeThePost}>
              <FontAwesomeIcon icon={faHeart} id="likePerfilCRP"/>
              <CountLikesPerfil color = {countLikesColor}>{likes.length}</CountLikesPerfil>
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
