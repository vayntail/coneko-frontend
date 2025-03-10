import "./UserCircle.scss";
import userImg from "../../assets/placeholders/user-img.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import leaderIcon from "../../assets/placeholders/leader.webp"; // Updated Path

const UserCircle = ({ user }) => {
  const renderIcon = () => {
    if (user.isLeader) {
      return <img src={leaderIcon} alt="Leader Icon" className="crown-icon" />;
    }
    return (
      <FontAwesomeIcon
        icon={faCircleUser}
        style={{
          color: user.isSelected ? "#967ce4" : "#0a78cd", // Purple for selected, Blue for empty
        }}
      />
    );
  };

  return <div className="user-circle">{renderIcon()}</div>;
};

export default UserCircle;
