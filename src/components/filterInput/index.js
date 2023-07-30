import { useNavigate, useParams } from "react-router-dom";
import "./filterInput.css";
import { useState } from "react";
export default function FilterInput() {
  const navigate = useNavigate()
  const {input} = useParams()
  const [isPostsActive, setIsPostsActive] = useState(true);
  const handlePostsClick = () => {
    setIsPostsActive(true);
    navigate(`/search/${input}/posts`)
  };

  const handleUsersClick = () => {
    setIsPostsActive(false);
    navigate(`/search/${input}/users`)
  };

  return (
    <div>
        <div id="divContainerFi">
          <button
            id="btnPostsFI"
            style={{ backgroundColor: isPostsActive ? "#7dff7d" : "#f0f0f0" }}
            onClick={handlePostsClick}
          >
            posts
          </button>
          <button
            style={{ backgroundColor: isPostsActive ? "#f0f0f0" : "#7dff7d" }}
            onClick={handleUsersClick}
            id="btnUsersFI"
          >
            users
          </button>
        
        </div>
        <div id="linhaFI">

            
        </div>
    </div>
  );
}
