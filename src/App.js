import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoutesApp from "./routes/router";
export default function App() {
  return (
    <div id="container">
      <RoutesApp />
      <ToastContainer/>
    </div>
  );
}
