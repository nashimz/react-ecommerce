import { createContext, useContext } from "react";

export const ModalContext = createContext(undefined);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return ctx;
};
