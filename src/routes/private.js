import { fetchSignInMethodsForEmail } from "firebase/auth";
import { useContext, useState, useEffect } from "react";
import { Context } from "../context/context";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Private({ children }) {
  const navigate = useNavigate();
  const [met, setMet] = useState(JSON.parse(localStorage.getItem('user'))); 
  const {user,setUser} = useContext(Context)
  useEffect(() => {
    if (met === null) {

      return navigate('/');
    }
    setUser(met)
  }, [met, navigate]);

  return children;
}