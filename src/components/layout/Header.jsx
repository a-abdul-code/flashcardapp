import "../layout/Header.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function Header() {
  //Initialisation ---------------------------------
  const { signOut, session } = useAuth();

  const navigate = useNavigate();

  //State ------------------------------------------

  //Handlers ---------------------------------------
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  //View -------------------------------------------
  return (
    <header>
      <h1 className="websiteTitle">Study Website</h1>
      {session && (
        <button className="signOutButton" onClick={handleSignOut}>
          Sign Out
        </button>
      )}
    </header>
  );
}

export default Header;
