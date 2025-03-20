import { useState } from "react";
import NewRequestModal from "./NewRequestModal";
import "./NewRequestButton.scss";

//What is this?
/* 
A button that opens the NewRequestModal

This component: 
-Displays a button to create a new game session
-Manages the state of the modal (open/closed)
-Handles the session creation callback
*/

const NewRequestButton = ({ onSessionCreated }) => {
  //State to track whether the modal is open
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  //Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  //Handle session created (pass through to parent component)
  const handleSessionCreated = (newSession) => {
    if (onSessionCreated) {
      onSessionCreated(newSession);
    }
  };

  return (
    <>
      <button className="createGameBtn" onClick={openModal}>
        Create New
      </button>

      <NewRequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSessionCreated={handleSessionCreated}
      />
    </>
  );
};

export default NewRequestButton;
