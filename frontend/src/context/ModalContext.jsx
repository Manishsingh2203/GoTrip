// src/context/ModalContext.jsx
import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ loginOpen, setLoginOpen }}>
      {children}
    </ModalContext.Provider>
  );
};
