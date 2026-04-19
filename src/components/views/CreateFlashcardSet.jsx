import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import FlashcardForm from "../UI/FlashcardForm";

function CreateFlashcardSet() {
  //Initialisation ---------------------------------
  const { session } = useAuth();
  const navigate = useNavigate();

  const emptySetInfo = { setName: "", description: "" };
  const emptyCard = [{ front: "", back: "" }];

  //Handlers ---------------------------------------
  const handleCreate = async (setInfo, cards) => {
    const setResponse = await supabase
      .from("Flashcard_Sets")
      .insert({
        setName: setInfo.setName,
        description: setInfo.description,
        userID: session.user.id,
      })
      .select()
      .single();

    if (setResponse.error) {
      alert("Error creating set: " + setResponse.error.message);
      return;
    }

    const cardsToInsert = cards.map((card) => ({
      front: card.front,
      back: card.back,
      setID: setResponse.data.setID,
    }));

    const cardResponse = await supabase.from("Flashcards").insert(cardsToInsert);

    if (cardResponse.error) {
      alert("Error creating cards: " + cardResponse.error.message);
    } else {
      navigate("/flashcards");
    }
  };

  //View -------------------------------------------
  return (
    <FlashcardForm initialSetInfo={emptySetInfo} initialCards={emptyCard} onSubmit={handleCreate} isEditing={false} />
  );
}

export default CreateFlashcardSet;
