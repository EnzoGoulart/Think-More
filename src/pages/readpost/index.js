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
  const navigate = useNavigate();
  const { email, number } = useParams();
  const [posts, setPosts] = useState({});
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countLikesColor, setCountLikesColor] = useState("#272727");
  const { user, setUser, results, setResults } = useContext(Context);
  const [post, setPost] = useState({});
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          let data = querySnapshot.docs.map((doc) => doc.data());

          data = data.filter((i) => i.idPost === Number(number));

          setPost(data[0]);
        } else {
          console.log("Nenhum documento encontrado com esse email.");
        }
      } catch (error) {
        console.error("Erro ao buscar o documento:", error);
      }
    };
    setLoading(true);
    fetchPost();
    loadLikes();
    setLoading(false);
  }, [email]);

  async function loadLikes() {
    try {
      const postsRef = collection(db, "posts");
      const q = query(
        postsRef,
        where("email", "==", email),
        where("idPost", "==", parseInt(number))
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let data = querySnapshot.docs.map((doc) => doc.data());
        data = data[0];
        if (data.curtidas) {
          data.curtidas.forEach((e) => {
            if (e == user.id) {
              setLiked(true);
              setCountLikesColor("#26a813");
            }
          });
          setLikes(data.curtidas);
        }
      }
    } catch (e) {
      console.log(e.message);
      toast.error("post wasn't found");
      return;
    }
  }
  async function likeThePost() {
    try {
      const postsRef = collection(db, "posts");
      const q = query(
        postsRef,
        where("email", "==", email),
        where("idPost", "==", parseInt(number))
      );
      const querySnapshot = await getDocs(q);
      let data = querySnapshot.docs.map((doc) => doc.data());
      let idCreator = data[0];
      let newLiked = liked;
      let newLikes = likes.slice();

      if (idCreator.curtidas && idCreator.curtidas.includes(user.id)) {
        newLiked = false;
        setCountLikesColor("#000");
        newLikes = newLikes.filter((e) => e !== user.id);
      } else {
        newLiked = true;
        setCountLikesColor("#26a813");
        newLikes.push(user.id);
      }

      console.log(newLikes);

      const userDocRef = doc(db, "posts", idCreator.idAleatorio);
      await setDoc(
        userDocRef,
        {
          curtidas: newLikes,
        },
        { merge: true }
      );

      if (newLiked) {
        setLiked(true);
        setLikes(newLikes);
        document.getElementById("heart-icon").classList.add("pulse-animation");
        document.getElementById("likes-count").classList.add("fade-animation");
      } else {
        setLiked(false);
        setLikes(newLikes);
        document
          .getElementById("heart-icon")
          .classList.remove("pulse-animation");
        document
          .getElementById("likes-count")
          .classList.remove("fade-animation");
      }
    } catch (e) {
      console.log(e);
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
          <div
            id="navigateCRP"
            onClick={() =>
              navigate(`/see/${encodeURIComponent(post.email)}/profile`)
            }
          >
            <div id="divPerfilCRP">
              <img id="imgCRP" src={Perfil} />
              <p id="unCRP">{post.username}</p>
            </div>
          </div>
          <div
            id="divLikePerfilCRP"
            onClick={likeThePost}
            className={`likePerfilCRP ${liked ? "likePerfilActive" : ""}`}
          >
            <p id="heart-icon">💚</p>
            <CountLikesPerfil id="likes-count" color={countLikesColor}>
              {likes.length}
            </CountLikesPerfil>
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
