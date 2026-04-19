import "./Notes.scss";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function Notes() {
  //Initialisation ---------------------------------
  const { session } = useAuth();
  const navigate = useNavigate();

  //State ------------------------------------------
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  //Handlers ---------------------------------------
  const fetchUserNotes = async (userID) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("Notes")
        .select("*")
        .eq("userID", userID)
        .order("lastOpened", { ascending: false });

      if (error) throw error;

      setUserNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (note) => {
    setNoteToDelete(note);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setNoteToDelete(null);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      const { error } = await supabase.from("Notes").delete().eq("noteID", noteToDelete.noteID);

      if (error) throw error;

      setUserNotes((prevNotes) => prevNotes.filter((note) => note.noteID !== noteToDelete.noteID));
    } catch (error) {
      console.error("Error deleting note:", error.message);
      alert("Failed to delete the note. Please try again.");
    } finally {
      closeDeleteModal();
    }
  };

  useEffect(() => {
    fetchUserNotes(session.user.id);
  }, [session.user.id]);

  //View -------------------------------------------
  return (
    <>
      <div className="header">
        <h1>Your Notes</h1>
        <NavLink className="navbutton" to="/notes/newnote">
          New Note
        </NavLink>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="noteContainer">
          {userNotes.map((note) => (
            <div className="noteCard" key={note.noteID}>
              <div className="cardHeader">
                <p className="noteName">
                  <b>{note.noteName}</b>
                </p>
                <div className="cardButtons">
                  <button className="button" onClick={() => navigate(`/notes/edit/${note.noteID}`)} title="Edit Note">
                    <img src="https://www.svgrepo.com/show/503019/edit.svg" alt="Edit Button" />
                  </button>
                  <button className="button" onClick={() => openDeleteModal(note)} title="Delete Note">
                    <img src="https://img.icons8.com/ios-glyphs/30/ff0000/filled-trash.png" alt="Delete Button" />
                  </button>
                </div>
              </div>
              <p>{!note.description ? "No Description Provided" : note.description}</p>

              <div className="lastOpenedContainer">
                <span className="label">Last Opened</span>
                <span className="date">
                  {new Date(note.lastOpened).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {isModalOpen && (
                <div className="modalContainer" onClick={closeDeleteModal}>
                  <dialog open={isModalOpen} className="modal" onClick={(e) => e.stopPropagation()}>
                    <h2>Delete Note</h2>
                    <p>
                      Are you sure you want to delete <b>{noteToDelete?.noteName}</b>?
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
export default Notes;
