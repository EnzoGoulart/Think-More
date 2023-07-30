import Header from "../../components/header";
import { Context } from "../../context/context";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import Footer from "../../components/footer";
import "./user.css";
//editprofile yourposts logout
import { useContext } from "react";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Perfil from "../../imgs/iconePerfil.png";
import Loading from "../../components/loading";
import { toast } from "react-toastify";
export default function User() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, setUser, idPost, setIdPost } = useContext(Context);
  useEffect(() => {
    async function getD() {
      setLoading(true);
      try {
        console.log(user);
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
          console.log(user.user);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          console.log("Documento não encontrado no Firestore.");
        }
      } catch (error) {
        console.error("Erro ao obter usuário:", error.message);
        setUser(JSON.parse(localStorage.getItem("user")));
        return 
      }

      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("email", "==", user.user));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map((doc) => doc.data());

          setPosts(data);
        } else {
          console.log("Documento não encontrado no Firestore.");
        }
        /*if (docSnapshot.exists()) {
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
          console.clear();

          console.log(data.posts);
          setPosts(data.posts);
        } else {
          console.log("Documento não encontrado no Firestore.");
        }*/
      } catch (error) {
        console.error("Erro ao obter usuário:", error.message);
        setUser(JSON.parse(localStorage.getItem("user")));
      } finally {
        setLoading(false);
      }
    }

    getD();
  }, [user.id, user.user]);
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <div id="User">
      <Header />
      <div id="userContent">
        <Link to="/home">
          <FontAwesomeIcon id="svgUs" icon={faArrowLeft} />
        </Link>
        <img id="imgUs" src={Perfil} />
        <p id="usernameUs">{user.username}</p>
        <p id="bioUs">{user.profile.bio}</p>
        <Link to="/profile">
          <button id="btnUs">settings</button>
        </Link>
        <div id="linhaUs"></div>
        <div>
          {posts.length > 0 ? (
            posts.reverse().map((post) => {
              let email = encodeURIComponent(post.email);
              let number = post.idPost;
              return (
                <div
                  onClick={() => navigate(`/${email}/${number}`)}
                  id="containerPostUs"
                  key={post.idPost}
                >
                  <p id="titlePostUs">{post.title}</p>
                  <div id="linhaPostUs"></div>
                  <p id="contentPostUs">{post.content}</p>
                </div>
              );
            })
          ) : (
            <div>
              <p id="p1EU">Nothing to see here...</p>
              <p id="p2EU">
                You don't did a post yet, click in the '+' button to add a post!
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
