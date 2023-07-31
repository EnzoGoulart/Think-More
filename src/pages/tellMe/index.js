import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../../components/footer";
import Header from "../../components/header";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "./tellme.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
export default function TellMe() {
  const [input, setInput] = useState("");

  async function sendMessage(e) {
    e.preventDefault()
    if (input.length > 0 && input.length <= 400) {
      const userRef = collection(db, "messages");
      const documento = await addDoc(userRef, {
        message: input,
      }).then(()=>{
        toast.success('the message was successfully sent')
        setInput('')
      }).catch(e=>{
        toast.error(e.message)
      })
    }
  }
  return (
    <div>
      <Header />
      <div id="containerTM">
        <form id="formTM" onSubmit={sendMessage}>
          <p id="anTM">
            <FontAwesomeIcon id="iconTM" icon={faUserSecret} />
            totally anonymous, only the message will be sent
          </p>
          <p id="labelTM">
          send anything, a compliment, a criticism, report a bug or an user, contact me, it's all up to you! {input.length}/400
          </p>
          <textarea
            id="taTM"
            placeholder="type here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button id="btnTM" type="submit">
            send message
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
