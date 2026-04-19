import "../views/ViewFlashcards.scss";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function ViewFlashcards({}) {
  //Initialisation ---------------------------------
  const { setID } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  const emptySetInfo = {
    setName: "",
    description: "",
  };

  //State ------------------------------------------
  const [setInfo, setSetInfo] = useState(emptySetInfo);
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasAwardedThisSession, setHasAwardedThisSession] = useState(false);

  //Handlers ---------------------------------------
  const fetchFlashcards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase.from("Flashcards").select("*").eq("setID", setID);

      if (error) throw error;

      setFlashcards(data);
    } catch (err) {
      console.error("Error fetching flashcards:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSetName = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("Flashcard_Sets")
        .select("setName, description")
        .eq("setID", setID)
        .single();

      if (error) throw error;

      setSetInfo({
        setName: data.setName,
        description: data.description || "",
      });
    } catch (err) {
      console.error("Error fetching set info:", err);
    }
  };

  const updateLastOpened = async () => {
    try {
      const { error } = await supabase
        .from("Flashcard_Sets")
        .update({ lastOpened: new Date().toISOString() })
        .eq("setID", setID);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating lastOpened:", err);
    }
  };

  const awardSetCompletionPoints = async () => {
    if (!session?.user?.id) return;

    try {
      const userResponse = await supabase
        .from("Users")
        .select("coinBalance, numOfFlashcardSetCompletedToday, flashcardSetCompletedDailyDate, coinBoostExpireDate")
        .eq("userID", session.user.id)
        .single();

      if (userResponse.error) throw userResponse.error;

      const userData = userResponse.data;
      const today = new Date().toISOString().split("T")[0];

      let completionsToday = userData.numOfFlashcardSetCompletedToday || 0;
      let lastDate = userData.flashcardSetCompletedDailyDate;

      if (lastDate !== today) {
        completionsToday = 0;
      }

      if (completionsToday < 4) {
        let pointsEarned = 5;
        const now = new Date();

        if (userData.coinBoostExpireDate) {
          const boostExpiration = new Date(userData.coinBoostExpireDate);
          if (now < boostExpiration) {
            pointsEarned = 5 * 2;
          }
        }

        const newBalance = (userData.coinBalance || 0) + pointsEarned;
        const newCompletions = completionsToday + 1;

        const updateResponse = await supabase
          .from("Users")
          .update({
            coinBalance: newBalance,
            numOfFlashcardSetCompletedToday: newCompletions,
            flashcardSetCompletedDailyDate: today,
          })
          .eq("userID", session.user.id)
          .select();

        if (updateResponse.error) throw updateResponse.error;

        if (updateResponse.data && updateResponse.data.length > 0) {
          alert(`Set Completed! +${pointsEarned} points (${newCompletions}/4 daily limit)`);
        }
      } else {
        console.log("Set completed, but daily point limit (4/4) has been reached.");
      }
    } catch (err) {
      console.error("Error awarding set completion points:", err.message);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
    fetchSetName();
    updateLastOpened();
  }, [setID]);

  useEffect(() => {
    if (flashcards.length > 0 && currentIndex === flashcards.length - 1 && !hasAwardedThisSession) {
      awardSetCompletionPoints();
      setHasAwardedThisSession(true);
    }
  }, [currentIndex, flashcards.length, hasAwardedThisSession]);

  //View -------------------------------------------
  const currentCard = flashcards[currentIndex];

  return (
    <>
      <div className="header">
        <h1>View Flashcard Set</h1>
        <button
          className="generateQuizButton"
          onClick={() => navigate(`/flashcards/${setID}/quiz`)}
          disabled={isLoading || flashcards.length < 4}
        >
          {isLoading
            ? "Loading..."
            : flashcards.length < 4
              ? "Need at least 4 cards to generate Quiz"
              : "Generate Quiz"}
        </button>
      </div>
      {error ? (
        <p>Error loading set: {error}</p>
      ) : isLoading ? (
        <p>Loading flashcards...</p>
      ) : (
        <>
          <div className="subHeader">
            <h2>{setInfo.setName}</h2>
            <p className="description">{setInfo.description}</p>
            <p className="flashcardLength">
              {flashcards.length} {flashcards.length === 1 ? "card" : "cards"}
            </p>
          </div>

          <div className="viewFlashcardsContainer">
            <button className="arrowButton" onClick={handlePrev} disabled={currentIndex === 0}>
              <img src="https://www.svgrepo.com/show/510041/left-arrow.svg" alt="Left arrow" />
            </button>

            <div className="flashcard" onClick={() => setIsFlipped(!isFlipped)}>
              {isFlipped ? (
                <p className="flashcardBackText">{currentCard.back}</p>
              ) : (
                <h1 className="flashcardFrontText">{currentCard.front}</h1>
              )}
            </div>

            <button className="arrowButton" onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>
              <img src="https://www.svgrepo.com/show/510165/right-arrow.svg" alt="Right arrow" />
            </button>
          </div>

          <div className="currentFlashcardNum">
            <p>
              {currentIndex + 1} / {flashcards.length}
            </p>
          </div>
        </>
      )}
    </>
  );
}

export default ViewFlashcards;
