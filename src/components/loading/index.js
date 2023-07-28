import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../footer";
import Header from "../header";
import { faArrowsToEye, faTruckLoading } from "@fortawesome/free-solid-svg-icons";

export default function Loading(){
    return(
        <div>
            <Header/>
                <FontAwesomeIcon icon={fa}/>
            <Footer/>
        </div>
    )
}
//continuar aqui