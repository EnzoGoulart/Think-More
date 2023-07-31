import FilterInput from "../../components/filterInput";
import Footer from "../../components/footer";
import Header from "../../components/header";
import Perfil from "../../imgs/iconePerfil.png";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/context";
import { useNavigate, useParams } from "react-router-dom";
import "./searchUsers.css";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import Loading from "../../components/loading";
export default function SearchUsers() {
  const { input } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user, setUser, results, setResults } = useContext(Context);
  useEffect(() => {
    async function getData() {
      setResults("");
      setLoading(true);
      try {
        const postsRef = collection(db, "data");
        const q = query(postsRef, where("username", "==", input), limit(20), orderBy('date', 'asc'));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          console.log("a");
          const data = querySnapshot.docs.map((doc) => doc.data());
          setResults(data);
          console.log(data);
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
      <div id="containerUSP">
        {results.length > 0 ? (
          results.map((user) => {
            return (
              <div
                id="containerUserSP"
                key={user.email}
                onClick={() => navigate(`/see/${user.email}/profile`)}
              >
                <img id="imgUserSP" src={Perfil} />
                <p id="usernameUserSP">{user.username}</p>
              </div>
            );
          })
        ) : (
          <div id="divNadaEncontradoPostSP">
          nothing found</div>
        )}
        <p id="endUSP">end</p>
      </div>

      <Footer />
    </div>
  );
}
