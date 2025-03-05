import "./UserCircle.scss";
import userImg from "../../assets/placeholders/user-img.png";

const UserCircle = (props) => {
  return <div>{props.user.pic ? <img src="" /> : <img src={userImg} />}</div>;
};

export default UserCircle;
