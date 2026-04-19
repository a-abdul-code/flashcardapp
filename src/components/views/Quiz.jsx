import "./Quiz.scss";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Quiz() {
  //Initialisation ---------------------------------
  const { setID } = useParams();
  const navigate = useNavigate();

  //State ------------------------------------------
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //Handlers ---------------------------------------
  const generateQuizOptions = (cards) => {
    if (cards.length < 2) return [];

    return cards.map((card, index) => {
      const correctAnswer = card.back;

      const wrongAnswers = cards
        .filter((_, i) => i !== index)
        .map((c) => c.back)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

      return {
        question: card.front,
        options: options,
        answer: correctAnswer,
      };
    });
  };

  const fetchQuizData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.from("Flashcards").select("*").eq("setID", setID);

      if (error) throw error;

      const generatedQuiz = generateQuizOptions(data);
      setQuizQuestions(generatedQuiz.sort(() => 0.5 - Math.random()));

      setUserAnswers(new Array(generatedQuiz.length).fill(null));
    } catch (err) {
      console.error("Error fetching quiz data:", err.message);
      setError("Failed to load quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (option) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIndex] = option;
    setUserAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    let finalScore = 0;
    quizQuestions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        finalScore += 1;
      }
    });
    setScore(finalScore);
    setIsFinished(true);
  };

  useEffect(() => {
    if (setID) {
      fetchQuizData();
    }
  }, [setID]);

  //View -------------------------------------------
  const currentQ = quizQuestions[currentIndex];
  const optionLetters = ["A", "B", "C", "D"];

  return (
    <>
      <div className="header">
        <h1>Quiz</h1>
        <button className="navbutton" onClick={() => navigate(`/flashcards/${setID}`)}>
          Back to Set
        </button>
      </div>

      {error ? (
        <p className="errorMessage">{error}</p>
      ) : isLoading ? (
        <p>Generating Quiz...</p>
      ) : quizQuestions.length < 2 ? (
        <p>Not enough cards to generate a quiz. Please add more cards to this set.</p>
      ) : isFinished ? (
        <div className="quizResultsContainer">
          <h2>Quiz Complete!</h2>
          <p className="scoreDisplay">
            You scored {score} out of {quizQuestions.length}
          </p>
          <button className="navbutton" onClick={() => navigate(`/flashcards/${setID}`)}>
            Return to Flashcards
          </button>
        </div>
      ) : (
        <div className="quizCardContainer">
          <div className="quizCardHeader">
            <h3>
              Question {currentIndex + 1} of {quizQuestions.length}
            </h3>
            <hr />
          </div>

          <div className="quizQuestion">
            <h2>{currentQ?.question}</h2>
          </div>

          <div className="quizOptions">
            {currentQ?.options.map((option, index) => (
              <button
                key={index}
                className={`optionButton ${userAnswers[currentIndex] === option ? "selected" : ""}`}
                onClick={() => handleSelectAnswer(option)}
              >
                <b>{optionLetters[index]}.</b> {option}
              </button>
            ))}
          </div>

          <div className="quizFooter">
            <button
              className="prevButton"
              onClick={handlePrev}
              style={{ visibility: currentIndex === 0 ? "hidden" : "visible" }}
            >
              Back
            </button>

            {currentIndex === quizQuestions.length - 1 ? (
              <button className="nextButton finishButton" onClick={handleFinish} disabled={!userAnswers[currentIndex]}>
                Finish
              </button>
            ) : (
              <button className="nextButton" onClick={handleNext} disabled={!userAnswers[currentIndex]}>
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Quiz;
