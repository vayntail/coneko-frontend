import "./Navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="nav-bar">
      <nav>
        <NavLink
          end
          className={({ isActive }) => (isActive ? "active" : "")}
          to="/"
        >
          <FontAwesomeIcon icon={faHome} color="rgb(167, 167, 167)" />
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive ? "active profile-link" : "profile-link"
          }
          to="/profile"
        >
          <FontAwesomeIcon icon={faUser} color="rgb(167, 167, 167)" />
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
