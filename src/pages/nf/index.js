import { Link, useNavigate } from "react-router-dom";
import './nf.css'
import Logo from "../../imgs/logoR.png";
export default function NotFound() {
  return (
    <div id="nf">

      <div id="NotFound">
        <img id="imgNf" src={Logo} />
        <div id="divTxtNf">
          <p id="txtNf">
            Ops... this page does not exist, but you can go to Login page or to
            home if you have an account!
          </p>
          <div id="lineNf"></div>
          <div id="divOptionsNf">
            <p id="txt2Nf">What's today's order?</p>
            <Link className="linkNf" to='/'>Login page</Link>
            <Link className="linkNf" to='/home'>Home page</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
