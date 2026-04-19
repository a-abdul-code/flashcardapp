import { supabase } from "../../supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NoteForm from "../UI/NoteForm";

function EditNote() {
  //Initialisation ---------------------------------
  const { noteID } = useParams();
  const navigate = useNavigate();

  //State ------------------------------------------
  const [loading, setLoading] = useState(true);
  const [initialNoteInfo, setInitialNoteInfo] = useState(null);

  //Handlers ---------------------------------------
  const fetchNoteData = async () => {
    try {
      const { data, error } = await supabase
        .from("Notes")
        .select("noteName, description, noteText")
        .eq("noteID", noteID)
        .single();

      if (error) throw error;
      setInitialNoteInfo(data);
    } catch (error) {
      console.error("Error fetching note:", error.message);
      alert("Failed to load note.");
      navigate("/notes");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedNoteInfo) => {
    const { error } = await supabase
      .from("Notes")
      .update({
        noteName: updatedNoteInfo.noteName,
        description: updatedNoteInfo.description,
        noteText: updatedNoteInfo.noteText,
        lastOpened: new Date().toISOString(),
      })
      .eq("noteID", noteID);

    if (error) {
      alert("Error updating note: " + error.message);
    } else {
      navigate("/notes");
    }
  };

  useEffect(() => {
    fetchNoteData();
  }, [noteID]);

  //View -------------------------------------------
  return loading ? (
    <p>Loading note data...</p>
  ) : (
    <NoteForm initialNoteInfo={initialNoteInfo} onSubmit={handleUpdate} isEditing={true} />
  );
}

export default EditNote;
