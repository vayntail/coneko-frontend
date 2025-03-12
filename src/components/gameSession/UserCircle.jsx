import "./UserCircle.scss";
import userImg from "../../assets/placeholders/user-img.png";
import leaderImg from "../../assets/placeholders/leader.png"; // Crown Icon Import
import { useState } from "react";

const UserCircle = ({ user, onSelect }) => {
  const [isSelected, setIsSelected] = useState(user.isSelected || false);

  const handleClick = () => {
    if (!user.isLeader) {
      const newSelection = !isSelected;
      setIsSelected(newSelection);
      if (onSelect) {
        onSelect(newSelection); // Update parent state
      }
    }
  };

  const circleStyle = {
    height: "50px",
    width: "50px",
    borderRadius: "50%",
    border: isSelected ? "3px solid #333" : "3px solid #0a78cd",
    cursor: !user.isLeader ? "pointer" : "default", // Leader cannot be selected
  };

  return (
    <div
      className="user-circle"
      style={circleStyle}
      onClick={handleClick} // Click logic here
    >
      {isSelected ? (
        <div
          className="solid-circle"
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#333", // Solid Dark Grey Circle
            borderRadius: "50%",
          }}
        />
      ) : (
        <img
          src={user.isLeader ? leaderImg : userImg}
          alt={user.isLeader ? "Leader" : "User"}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};

export default UserCircle;
