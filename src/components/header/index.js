import "./header.css";
import Logo from "../../imgs/logoR.png";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";
export default function Header() {
  const { user, setUser } = useContext(Context);
  return (
    <div id="Header">
      <img id="imgH" src={Logo} />
      <div id="divIconsH">
        <Link to='/post'><FontAwesomeIcon id="svgH" icon={faPlus}/></Link>
        <Link to='/tellme' ><FontAwesomeIcon id="svg2H" icon={faPaperPlane}/></Link>
      </div>
    </div>
  );
}
