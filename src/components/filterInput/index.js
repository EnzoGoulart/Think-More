import "./filterInput.css";
import { useState } from "react";
export default function FilterInput() {
  const [isPostsActive, setIsPostsActive] = useState(true);
  const handlePostsClick = () => {
    setIsPostsActive(true);
  };

  const handleUsersClick = () => {
    setIsPostsActive(false);
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
