import "./UserCircle.scss";
import userImg from "../../assets/placeholders/user-img.png";
import creatorImg from "../../assets/placeholders/isCreator.png"; // Creator Crown Image Lenny
import { useState } from "react";

const UserCircle = ({ user, onSelect }) => {
  const [isSelected, setIsSelected] = useState(user.isSelected || false);

  const handleClick = () => {
    if (!user.isCreator) {
      const newSelection = !isSelected;
      setIsSelected(newSelection);
      if (onSelect) {
        onSelect(newSelection); // Update parent state
      }
    }
  };
  //.........................Lenny circle style tooltips ...//
  const circleStyle = {
    height: "50px",
    width: "50px",
    borderRadius: "50%",
    backgroundColor: isSelected ? "#333" : "#0a78cd", // Dark Grey on Select
    cursor: !user.isCreator ? "pointer" : "default",
    position: "relative", // Required for Tooltip
  };

  // Tooltip Logic
  const tooltipText = user.isCreator
    ? "Creator"
    : user.isSelected
    ? `Player ${user.playerNumber}`
    : "Empty Slot";

  return (
    <div
      className="user-circle"
      style={circleStyle}
      onClick={handleClick}
      data-tooltip={tooltipText} // Tooltip Logic
    >
      <img
        src={user.isCreator ? creatorImg : userImg}
        alt={tooltipText}
        style={{ width: "100%", height: "100%" }}
      />
      {/* Tooltip Display */}
      <div className="tooltip">{tooltipText}</div>
    </div>
    //...............Lenny circle style tooltips ...//
  );
};

export default UserCircle;
