import { BrowserRouter, Routes, Route } from "react-router-dom";
import Private from "./private";
import Home from "../pages/home";
import Login from "../contas/login";
import Cadastro from "../contas/cadastro";
import Search from "../pages/search";
import Profile from "../pages/profile";
import Post from "../pages/post/";
import NotFound from "../pages/nf";
import User from '../pages/user' 
import ReadPost from "../pages/readpost";
import SearchPost from "../pages/searchPost";
import SearchUsers from "../pages/searchUsers";
import SeeProfile from "../pages/seeProfile";
import TellMe from "../pages/tellMe";
function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/home" element={<Private><Home/></Private>} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Cadastro />} />
        <Route path="/search" element={<Private><Search/></Private>} />
        <Route path="/profile" element={<Private><Profile/></Private>} />
        <Route path="/post" element={<Private><Post/></Private>}/>
        <Route path="/user" element={<Private><User/></Private>}/>
        <Route path="/*" element={<NotFound />} />
        <Route path="/:email/:number" element={<Private><ReadPost/></Private>} />
        <Route path="/search/:input/posts" element={<Private><SearchPost/></Private>} />
        <Route path="/search/:input/users" element={<Private><SearchUsers/></Private>} />
        <Route path="/see/:email/profile" element={<Private><SeeProfile/></Private>} />
        <Route path="/tellme" element={<Private><TellMe/></Private>} />
      </Routes>
      
      
    </BrowserRouter>
  );
}
export default RoutesApp;
