import "../layout/Sidebar.scss";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Pomodoro from "../UI/Pomodoro";

function Sidebar({ collapsed, handleCollapse }) {
  // Initialisation ------------------------------------------
  const { session } = useAuth();

  const profileName = collapsed ? "profileCollapsed" : "";
  const navName = collapsed ? "navbuttonCollapsed" : "navbutton";
  // State ---------------------------------------------------
  // Handlers ------------------------------------------------
  // View -----------------------------------------------
  return (
    <nav className="sidebar">
      <div className="collapseItem">
        {collapsed === true ? (
          <img
            className="collapseImage"
            onClick={handleCollapse}
            src="https://www.svgrepo.com/show/379887/collapse-right.svg"
          />
        ) : (
          <img
            className="collapseImage"
            onClick={handleCollapse}
            src="https://www.svgrepo.com/show/379883/collapse-left.svg"
          />
        )}
      </div>

      <div className="profileItem">
        <img className="profileImage" src="https://www.svgrepo.com/show/352625/user.svg" />
        <p className={profileName}>{session.user.user_metadata.displayName}</p>
      </div>

      <div className="navItem">
        <NavLink className={navName} to="/dashboard">
          <img src="https://www.svgrepo.com/show/491253/home.svg" />
          Dashboard
        </NavLink>
      </div>

      <div className="navItem">
        <NavLink className={navName} to="/flashcards">
          <img src="https://static.thenounproject.com/png/flash-cards-icon-1981384-512.png" />
          Flashcards
        </NavLink>
      </div>

      <div className="navItem">
        <NavLink className={navName} to="/notes">
          <img src="https://www.svgrepo.com/show/532913/notes.svg" />
          Notes
        </NavLink>
      </div>

      <div className="navItem">
        <NavLink className={navName} to="/store">
          <img src="https://www.svgrepo.com/show/334928/store.svg" />
          Store
        </NavLink>
      </div>

      <div className="pomodoroWrapper">{collapsed === false && <Pomodoro />}</div>
    </nav>
  );
}

export default Sidebar;
