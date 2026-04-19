import "../views/Dashboard.scss";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function Dashboard() {
  //Initialisation ---------------------------------
  const { session } = useAuth();
  //State ------------------------------------------
  //Handlers ---------------------------------------
  //View -------------------------------------------
  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <p>Good Morning, {session.user.user_metadata.displayName} </p>
        <p>Ready to start your study?</p>
      </div>

      <div className="cards">
        <div className="card">
          <div className="cardDetails">
            <img src="https://static.thenounproject.com/png/flash-cards-icon-1981384-512.png" />
            <p className="cardName">Flashcards</p>
            <p className="cardDescripton">Create and view your Flashcards</p>
          </div>

          <div className="button">
            <NavLink className="navbutton" to="/flashcards">
              View Flashcards
            </NavLink>
          </div>
        </div>

        <div className="card">
          <div className="cardDetails">
            <img src="https://www.svgrepo.com/show/532913/notes.svg" />
            <p className="cardName">Notes</p>
            <p className="cardDescripton">Create your own structured notes</p>
          </div>

          <div className="button">
            <NavLink className="navbutton" to="/notes">
              View Notes
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
