import "./UserCircle.scss";
import userImg from "../../assets/placeholders/user-img.png";
import leaderImg from "../../assets/placeholders/leader.png"; // Crown icon import

const UserCircle = ({ user, onClick }) => {
  const circleStyle = {
    height: "50px",
    width: "50px",
    borderRadius: "50%",
    border: user.isSelected ? "3px solid black" : "3px solid #0a78cd",
    cursor: "pointer",
  };

  return (
    <div className="user-circle" onClick={onClick} style={circleStyle}>
      <img
        src={user.isLeader ? leaderImg : userImg}
        alt={user.isLeader ? "Leader" : "User"}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default UserCircle;
