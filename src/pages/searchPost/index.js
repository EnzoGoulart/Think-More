import Footer from "../../components/footer";
import Header from "../../components/header";
import FilterInput from "../../components/filterInput";
import Perfil from "../../imgs/iconePerfil.png";
import "./searchPost.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/context";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import Loading from "../../components/loading";
export default function SearchPost() {
  const { input } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user, setUser, results, setResults } = useContext(Context);
  useEffect(() => {
    setResults('')  
    async function getData() {
      setLoading(true);
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("title", "==", input), limit(20));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {

          const data = querySnapshot.docs.map((doc) => doc.data());
          setResults(data);

        } else {
          console.log("nada aqui");
        }
      } catch (e) {
        console.log(e.message);
      } finally {
        setLoading(false);
      }
    }
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
      <FilterInput />
      <div id="containerSP">
        {results.length > 0 ? (
          results.map((post) => {
            return (
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
            );
          })
        ) : (
          <div id="divNadaEncontradoPostSP">
          nothing found</div>
        )}

        <p id="endSP">end</p>
      </div>
      <Footer />
    </div>
  );
}
