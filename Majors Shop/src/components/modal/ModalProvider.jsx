import { useState } from "react";
import { ModalContext } from "./ModalContext";
import Modal from "./Modal";

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const showModal = (msg) => {
    setMessage(msg);
    setIsOpen(true);

    // Auto close after 2 seconds
    setTimeout(() => setIsOpen(false), 2000);
  };

  const hideModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {isOpen && <Modal message={message} onClose={hideModal} />}
    </ModalContext.Provider>
  );
};
