import "./NoteForm.scss";
import { useState } from "react";

function NoteForm({ initialNoteInfo, onSubmit, isEditing }) {
  //Initialisation ---------------------------------
  const emptyErrors = { noteName: "", noteText: "" };

  //State ------------------------------------------
  const [noteInfo, setNoteInfo] = useState(initialNoteInfo);
  const [errors, setErrors] = useState(emptyErrors);

  //Handlers ---------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNoteInfo({ ...noteInfo, [name]: value });
  };

  const checkForErrors = () => {
    const newErrors = { noteName: "", noteText: "" };
    let hasErrors = false;

    if (!noteInfo.noteName.trim()) {
      newErrors.noteName = "Note name is required.";
      hasErrors = true;
    }

    if (!noteInfo.noteText.trim()) {
      newErrors.noteText = "Note text cannot be empty.";
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = () => {
    if (!checkForErrors()) return;
    onSubmit(noteInfo);
  };

  //View -------------------------------------------
  return (
    <>
      <div className="header">
        <h1>{isEditing ? "Edit Note" : "Create Note"}</h1>
      </div>

      <div className="cardsContainer">
        <div className="setNameCard">
          <label className="setNameLabel">
            Note Name:
            <input
              className="setNameInput"
              type="text"
              name="noteName"
              placeholder="Enter the name of your note"
              value={noteInfo.noteName}
              onChange={handleChange}
            />
            {errors.noteName && <p className="error">{errors.noteName}</p>}
          </label>

          <label className="descriptionLabel">
            Description:
            <textarea
              className="descriptionInput"
              name="description"
              placeholder="Enter a brief description"
              value={noteInfo.description || ""}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="frontCardContainer">
          <div className="frontCard">
            <label className="backLabel">
              Note Text:
              <textarea
                className="noteTextInput"
                name="noteText"
                placeholder="Type your notes here..."
                value={noteInfo.noteText || ""}
                onChange={handleChange}
              />
              {errors.noteText && <p className="error">{errors.noteText}</p>}
            </label>
          </div>
        </div>
      </div>

      <div className="createSetButtonContainer">
        <button onClick={handleSubmit}>{isEditing ? "Save Changes" : "Create Note"}</button>
      </div>
    </>
  );
}

export default NoteForm;
