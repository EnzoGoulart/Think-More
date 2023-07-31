import { useNavigate, useParams } from "react-router-dom";
import "./seeProfile.css";
import Loading from "../../components/loading";
import Perfil from "../../imgs/iconePerfil.png";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { Context } from "../../context/context";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { toast } from "react-toastify";
export default function SeeProfile() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const { results } = useContext(Context);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const postsRef = collection(db, "data");
        const q = query(postsRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map((doc) => doc.data());
          setUser(data[0]);
        } else {
          console.log("nada aqui");
          toast.error("user wasn't found");
          return
        }
      } catch (e) {
        console.log(e.message);
        toast.error("user wasn't found");
        return
      }
    }
    async function getPosts() {
      setLoading(true);
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("email", "==", email), limit(20), orderBy('date', 'asc'));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map((doc) => doc.data());
          setPosts(data);
        } else {
          console.log("nada aqui");
        }
      } catch (e) {
        console.log(e.message);
        toast.error("user wasn't found");
      } finally {
        setLoading(false);
      }
    }
    getPosts();
    getData();
  }, []);

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
      <div id="containerSEPR">
        <img src={Perfil} id="imgSEPR"/>
        <p id="usernameSEPR">{user.username}</p>
        <p id="bioSEPR">{user.bio}</p>
        <div id="divLinha1SEPR"></div>
      
      <div id="divPostsSEPR">
        <p id="txtPostsSEPR">posts</p>
        <div id="divLinha2SEPR"></div>
        {posts.map(post=>{
            return(
                <div id="divPostSEPR" onClick={()=>navigate(`/${email}/${post.idPost}`)} key={post.idPost}>
                    <p id="titlePostSEPR">{post.title}</p>
                    <div id="linha3SEPR"></div>
                    <p id="contentPostSEPR">{post.content}</p>
                </div>
            )
        })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
