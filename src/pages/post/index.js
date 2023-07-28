import Header from "../../components/header";
import Footer from "../../components/footer";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore";
import { Context } from "../../context/context";
import "./post.css";
import { db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/loading";
export default function Post() {
  const navigate = useNavigate();
  const { user, setUser, idPost, setIdPost } = useContext(Context);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    async function getD() {
      try {
        setLoading(true)
        const userDocRef = doc(db, "data", user.id);
        const docSnapshot = await getDoc(userDocRef);
        console.log(docSnapshot.data());
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
      }finally{
      console.clear();
      setLoading(false)
    }}
    getD();
  }, [user.id, setUser]);

  async function postThisTought() {
    if (
      title !== "" &&
      title.length <= 70 &&
      content !== "" &&
      content.length <= 2200
    ) {
      setLoading(true)
      const userDocRef = doc(db, "data", user.id);
      let name = `post${idPost}`;
      console.clear();
      await setDoc(
        userDocRef,
        {
          posts: {
            [name]: {
              idPost,
              username: user.username,
              email: user.user,
              title,
              content,
              date: new Date(),
            },
          },
        },
        { merge: true }
      );
      let pratic = Number(idPost) + 1;
      setIdPost(pratic);
      localStorage.setItem("idPost", pratic);
      toast.success("content posted sucessfull");
      setLoading(false)
    } else {
      console.log("erro: nao entrou no if");
    }
  }
  function resetItems() {
    setTitle("");
    setContent("");
  }
  if(!loading){
    return(
      <div>
        <Loading/>
      </div>
    )
  }
  return (
    <div>
      <Header />
      <div id="Post">
        <FontAwesomeIcon id="cancelPo" icon={faTimes} onClick={resetItems} />
        <label id="firstLabelCorrect" className="labelPo" htmlFor="titlePo">
          title {title.length}/70
        </label>
        <textarea
          placeholder="Why fishs are too small?"
          id="titlePo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="labelPo" htmlFor="contentPo">
          content {content.length}/2200
        </label>
        <textarea
          placeholder="am thinking about it every day. Humanity has improved the DNA of fruits, so why don't we improve the DNA of fish? By doing so, we could eat more of them... "
          id="contentPo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button id="botaoL" onClick={postThisTought}>
          post
        </button>
      </div>
      <Footer />
    </div>
  );
}
