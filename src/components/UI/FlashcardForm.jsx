import "./FlashcardForm.scss";
import { useState } from "react";

function FlashcardForm({ initialSetInfo, initialCards, onSubmit, isEditing }) {
  //Initialisation ---------------------------------
  const emptyCard = { front: "", back: "" };
  const emptyErrors = { setName: "", cards: [] };

  //State ------------------------------------------
  const [setInfo, setSetInfo] = useState(initialSetInfo);
  const [cards, setCards] = useState(initialCards);
  const [errors, setErrors] = useState(emptyErrors);

  //Handlers ---------------------------------------
  const handleSetChange = (event) => {
    const { name, value } = event.target;
    setSetInfo({ ...setInfo, [name]: value });
  };

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    const updatedCards = [...cards];
    updatedCards[index][name] = value;
    setCards(updatedCards);
  };

  const onDeleteCard = (index) => {
    const updatedCards = [...cards];
    updatedCards.splice(index, 1);
    setCards(updatedCards);

    const updatedErrors = [...errors.cards];
    if (updatedErrors.length > index) {
      updatedErrors.splice(index, 1);
      setErrors({ ...errors, cards: updatedErrors });
    }
  };

  const onAddCard = () => {
    setCards([...cards, emptyCard]);
  };

  const checkForErrors = () => {
    const newErrors = { setName: "", cards: [] };

    if (!setInfo.setName.trim()) {
      newErrors.setName = "Set name is required.";
    }

    newErrors.cards = cards.map((card) => {
      const cardErrors = {};
      if (!card.front.trim()) cardErrors.front = "Front cannot be empty.";
      if (!card.back.trim()) cardErrors.back = "Back cannot be empty.";
      return cardErrors;
    });

    setErrors(newErrors);
    const hasErrors = newErrors.setName || newErrors.cards.some((c) => c.front || c.back);
    return !hasErrors;
  };

  const handleSubmit = () => {
    if (!checkForErrors()) return;
    onSubmit(setInfo, cards);
  };

  //View -------------------------------------------
  return (
    <>
      <div className="header">
        <h1>{isEditing ? "Edit Flashcard Set" : "Create Flashcard Set"}</h1>
      </div>

      <div className="cardsContainer">
        <div className="setNameCard">
          <label className="setNameLabel">
            Set Name:
            <input
              className="setNameInput"
              type="text"
              name="setName"
              placeholder="Enter the name of your flashcard set"
              value={setInfo.setName}
              onChange={handleSetChange}
            />
            {errors.setName && <p className="error">{errors.setName}</p>}
          </label>

          <label className="descriptionLabel">
            Description:
            <textarea
              className="descriptionInput"
              name="description"
              placeholder="Enter the description of this set"
              value={setInfo.description}
              onChange={handleSetChange}
            />
          </label>
        </div>

        {cards.map((card, index) => (
          <div className="frontCardContainer" key={index}>
            <div className="cardNumber">{index + 1}</div>
            <div className="frontCard">
              <label className="frontLabel">
                <div className="labelHeader">
                  <span>Front:</span>
                  {index > 0 && (
                    <div className="deleteButtonContainer">
                      <button className="deleteButton" onClick={() => onDeleteCard(index)}>
                        <img src="https://img.icons8.com/ios-glyphs/30/ff0000/filled-trash.png" alt="Delete icon" />
                      </button>
                    </div>
                  )}
                </div>

                <input
                  className="frontInput"
                  type="text"
                  name="front"
                  placeholder="Enter a term or question"
                  value={card.front}
                  onChange={(e) => handleChange(e, index)}
                />
                {errors.cards[index]?.front && <p className="error">{errors.cards[index].front}</p>}
              </label>

              <label className="backLabel">
                Back:
                <textarea
                  className="backInput"
                  name="back"
                  placeholder="Enter the answer or definition"
                  value={card.back}
                  onChange={(e) => handleChange(e, index)}
                />
                {errors.cards[index]?.back && <p className="error">{errors.cards[index].back}</p>}
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="addCardButtonContainer">
        <button onClick={onAddCard}>
          <img
            src="https://img.icons8.com/external-basicons-line-edtgraphics/50/undefined/external-add-ui-basic-basicons-line-edtgraphics-2.png"
            alt="Add icon"
          />
        </button>
      </div>

      <div className="createSetButtonContainer">
        <button onClick={handleSubmit}>{isEditing ? "Save Changes" : "Create Set"}</button>
      </div>
    </>
  );
}

export default FlashcardForm;
