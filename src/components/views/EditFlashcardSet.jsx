import { supabase } from "../../supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FlashcardForm from "../UI/FlashcardForm";

function EditFlashcardSet() {
  //Initialisation ---------------------------------
  const { setID } = useParams();
  const navigate = useNavigate();

  //State ------------------------------------------
  const [loading, setLoading] = useState(true);
  const [initialSetInfo, setInitialSetInfo] = useState(null);
  const [initialCards, setInitialCards] = useState(null);

  //Handlers ---------------------------------------
  const fetchSetData = async () => {
    try {
      const setInfoRes = await supabase
        .from("Flashcard_Sets")
        .select("setName, description")
        .eq("setID", setID)
        .single();

      if (setInfoRes.error) throw setInfoRes.error;
      setInitialSetInfo(setInfoRes.data);

      const cardsRes = await supabase.from("Flashcards").select("front, back").eq("setID", setID);

      if (cardsRes.error) throw cardsRes.error;

      setInitialCards(cardsRes.data.length > 0 ? cardsRes.data : [{ front: "", back: "" }]);
    } catch (error) {
      console.error("Error fetching set:", error.message);
      alert("Failed to load flashcard set.");
      navigate("/flashcards");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedSetInfo, updatedCards) => {
    const setUpdateRes = await supabase
      .from("Flashcard_Sets")
      .update({
        setName: updatedSetInfo.setName,
        description: updatedSetInfo.description,
      })
      .eq("setID", setID);

    if (setUpdateRes.error) {
      alert("Error updating set: " + setUpdateRes.error.message);
      return;
    }

    await supabase.from("Flashcards").delete().eq("setID", setID);

    const newCardsToInsert = updatedCards.map((card) => ({
      front: card.front,
      back: card.back,
      setID: setID,
    }));

    const cardRes = await supabase.from("Flashcards").insert(newCardsToInsert);

    if (cardRes.error) {
      alert("Error saving cards: " + cardRes.error.message);
    } else {
      navigate("/flashcards");
    }
  };

  useEffect(() => {
    fetchSetData();
  }, [setID]);

  //View -------------------------------------------
  return loading ? (
    <p>Loading set data...</p>
  ) : (
    <FlashcardForm
      initialSetInfo={initialSetInfo}
      initialCards={initialCards}
      onSubmit={handleUpdate}
      isEditing={true}
    />
  );
}

export default EditFlashcardSet;
