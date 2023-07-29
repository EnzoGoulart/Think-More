import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../footer";
import Header from "../header";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import "./loading.css";
export default function Loading() {
  const [txt, setTxt] = useState("loading...");
  useEffect(() => {
    setTimeout(() => {
      const frases = [
        "Loading smiles...",
        "Take a deep breath. We're almost there!",
        "Patience is a virtue. Thank you for waiting!",
        "Loading doses of happiness for your day!",
        "In the meantime, spread kindness around you.",
        "Does anyone really read this?",
      ];
      let random = Math.floor(Math.random() * frases.length);
      setTxt(frases[random]);
    }, 3000);
  }, [txt, setTxt]);
  return (
    <div id="conatinerLoading">
      <Header />
      <div id="divLoading">
        <FontAwesomeIcon id="spinnerLoading" icon={faSpinner} />
        <p id="txtLoading">{txt}</p>
      </div>
      <Footer />
    </div>
  );
}
