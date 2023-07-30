import { createContext, useReducer, useState } from "react";
export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    user: null,
    id: null,
    username: null,
    password: null,
    profile: {
      photo: null,
      bio: null,
    },
  });
  let id = localStorage.getItem("idPost");

  const [idPost, setIdPost] = useState(Number(id) || 0);
  const [results, setResults] = useState('')
  return (
    <Context.Provider
      value={{
        user,
        setUser,
        idPost,
        setIdPost,
        results,
        setResults
      }}
    >
      {children}
    </Context.Provider>
  );
};
