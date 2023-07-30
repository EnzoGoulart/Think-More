import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "./search.css";
import Loading from "../../components/loading";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { getDocs, query, where, collection, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../firebase";
import { useContext } from "react";
import { Context } from "../../context/context";
import { doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
export default function Search() {
  const { user, setUser, idPost, setIdPost, results, setResults } = useContext(Context);
  const navigate = useNavigate();
  const [title, setTitle] = useState({});
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  useEffect(() => {
    async function getD() {
      try {
        setLoading(true);
        console.log(user.id);
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
        setLoading(false);
      }
    }
    getD();
  }, []);

  async function SearchFor(e) {
    e.preventDefault();
    if(input!==''){
        navigate(`/search/${input}/posts` )
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

      <form onSubmit={SearchFor} id="containerSe">
        <input
          id="inputSe"
          placeholder="search..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" id="containerIconSe">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
      <div id="linhaSe"></div>
      <Footer />
    </div>
  );
}
