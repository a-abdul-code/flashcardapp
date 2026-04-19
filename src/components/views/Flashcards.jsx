import "../views/Flashcards.scss";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function Flashcards() {
  //Initialisation ---------------------------------
  const { session } = useAuth();
  const navigate = useNavigate();

  //State ------------------------------------------
  const [userSets, setUserSets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  //Handlers ---------------------------------------
  const fetchUserSets = async (userID) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("Flashcard_Sets")
        .select("*")
        .eq("userID", userID)
        .order("lastOpened", { ascending: false });

      if (error) throw error;

      setUserSets(data);
    } catch (error) {
      console.error("Error fetching sets:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (set) => {
    setSetToDelete(set);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSetToDelete(null);
  };

  const confirmDelete = async () => {
    if (!setToDelete) return;

    try {
      const { error } = await supabase.from("Flashcard_Sets").delete().eq("setID", setToDelete.setID);

      if (error) throw error;

      setUserSets((prevSets) => prevSets.filter((set) => set.setID !== setToDelete.setID));
    } catch (error) {
      console.error("Error deleting set:", error.message);
      alert("Failed to delete the set. Please try again.");
    } finally {
      closeDeleteModal();
    }
  };

  useEffect(() => {
    fetchUserSets(session.user.id);
  }, [session.user.id]);

  //View -------------------------------------------
  return (
    <>
      <div className="header">
        <h1>Your Flashcard Sets</h1>
        <NavLink className="navbutton" to="/flashcards/newset">
          New Set
        </NavLink>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flashcardSetContainer">
          {userSets.map((set) => (
            <div className="flashcardSet" key={set.setID}>
              <div className="cardHeader">
                <p className="setName">
                  <b>{set.setName}</b>
                </p>
                <div className="cardButtons">
                  <button className="button" onClick={() => navigate(`/flashcards/edit/${set.setID}`)} title="Edit Set">
                    <img src="https://www.svgrepo.com/show/503019/edit.svg" alt="Edit Button" />
                  </button>
                  <button className="button" onClick={() => openDeleteModal(set)} title="Delete Set">
                    <img src="https://img.icons8.com/ios-glyphs/30/ff0000/filled-trash.png" alt="Delete Button" />
                  </button>
                </div>
              </div>
              <p>{set.description === "" ? "No Description Provided" : set.description}</p>

              <div className="lastOpenedContainer">
                <span className="label">Last Opened</span>
                <span className="date">
                  {new Date(set.lastOpened).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="openSetContainer">
                <NavLink className="navbutton" to={`/flashcards/${set.setID}`}>
                  Open Set
                </NavLink>
              </div>

              {isModalOpen && (
                <div className="modalContainer" onClick={closeDeleteModal}>
                  <dialog open={isModalOpen} className="modal" onClick={(e) => e.stopPropagation()}>
                    <h2>Delete Set</h2>
                    <p>
                      Are you sure you want to delete <b>{setToDelete?.setName}</b>?
                    </p>

                    <div className="modalButtons">
                      <button className="cancelButton" onClick={closeDeleteModal}>
                        Cancel
                      </button>
                      <button className="delButton" onClick={confirmDelete}>
                        Delete
                      </button>
                    </div>
                  </dialog>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
export default Flashcards;
