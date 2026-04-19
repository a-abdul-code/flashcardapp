import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import NoteForm from "../UI/NoteForm";

function CreateNote() {
  //Initialisation ---------------------------------
  const { session } = useAuth();
  const navigate = useNavigate();

  const emptyNoteInfo = { noteName: "", description: "", noteText: "" };

  //Handlers ---------------------------------------
  const handleCreate = async (noteInfo) => {
    const { error } = await supabase.from("Notes").insert({
      noteName: noteInfo.noteName,
      description: noteInfo.description,
      noteText: noteInfo.noteText,
      userID: session.user.id,
    });

    if (error) {
      alert("Error creating note: " + error.message);
    } else {
      navigate("/notes");
    }
  };

  //View -------------------------------------------
  return <NoteForm initialNoteInfo={emptyNoteInfo} onSubmit={handleCreate} isEditing={false} />;
}

export default CreateNote;
