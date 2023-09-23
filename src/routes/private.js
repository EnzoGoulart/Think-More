import { useContext, useState, useEffect } from "react";
import { Context } from "../context/context";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function Private({ children }) {
  const navigate = useNavigate();
  const { user, setUser, results, setResults } = useContext(Context);

  useEffect(() => {
    async function fetchData() {
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
          throw new Error("Erro ao recuperar dados do usuário do Firestore.");
        }
      } catch (error) {
        try {
          let userLs = JSON.parse(localStorage.getItem("user"));
          let email = userLs.user;
          let senha = userLs.password;

          const postsRef = collection(db, "data");
          const q = query(
            postsRef,
            where("email", "==", email),
            where("senha", "==", senha)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            let data = querySnapshot.docs[0].data();
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
          } else {
            throw new Error("Erro ao recuperar dados do usuário do armazenamento local.");
          }
        } catch (e) {
          navigate("/");
        }
      }
    }

    fetchData();
  }, []);

  return children;
}
