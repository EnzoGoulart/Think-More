import './footer.css'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
export default function Footer(){
    return(
        <div id='footer'>
           <Link to='/home'>
               <FontAwesomeIcon icon={faHome} className='svgF'/>
           </Link>
           <Link to='/search'>
               <FontAwesomeIcon icon={faSearch} className='svgF'/>
           </Link>
           <Link to='/post'><FontAwesomeIcon icon={faPlus} className='svgF'/></Link>
           <Link to='/user'>
               <FontAwesomeIcon icon={faUser} className='svgF'/>
           </Link>
        </div>
    )
}