import "./Pomodoro.scss";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../auth/useAuth";

function Pomodoro() {
  //Initialisation ---------------------------------
  const { session } = useAuth();

  const times = {
    work: 25 * 60,
    break: 5 * 60,
    long: 15 * 60,
  };

  const defaultState = {
    mode: "work",
    isRunning: false,
    endTime: null,
    timeLeft: times.work,
    workSessionsCompleted: 0,
  };

  const savedState = localStorage.getItem("pomodoroState");
  const initialState = savedState ? JSON.parse(savedState) : defaultState;

  //State ------------------------------------------
  const [pomoState, setPomoState] = useState(initialState);

  //Handlers ---------------------------------------
  const updateState = (newStateUpdates) => {
    setPomoState((prev) => {
      const updatedState = { ...prev, ...newStateUpdates };
      localStorage.setItem("pomodoroState", JSON.stringify(updatedState));
      return updatedState;
    });
  };

  const awardPoints = async (pointsToAdd) => {
    if (!session?.user?.id) return;

    try {
      const currentBalanceResponse = await supabase
        .from("Users")
        .select("coinBalance")
        .eq("userID", session.user.id)
        .single();

      if (currentBalanceResponse.error) throw currentBalanceResponse.error;
      const currentCoins = currentBalanceResponse.data.coinBalance || 0;

      const updateResponse = await supabase
        .from("Users")
        .update({ coinBalance: currentCoins + pointsToAdd })
        .eq("userID", session.user.id)
        .select();

      if (updateResponse.error) throw updateResponse.error;
    } catch (error) {
      console.error("Error awarding points:", error.message);
    }
  };

  const handleTimerComplete = () => {
    const audio = new Audio("/alarm.mp3");
    audio.play().catch(() => console.log("Audio unable to be played"));

    let nextMode = "work";
    let newWorkSessions = pomoState.workSessionsCompleted;
    let pointsEarned = 0;

    if (pomoState.mode === "work") {
      newWorkSessions += 1;
      pointsEarned += 10;

      if (newWorkSessions >= 4) {
        nextMode = "long";
        newWorkSessions = 0;
        pointsEarned += 50;
        alert(`Complete Focus Bonus! You earned ${pointsEarned} points for completing a full Pomodoro cycle.`);
      } else {
        nextMode = "break";
        alert(`Focus complete! You earned ${pointsEarned} points.`);
      }
    } else {
      nextMode = "work";
    }

    if (pointsEarned > 0) {
      awardPoints(pointsEarned);
    }

    updateState({
      mode: nextMode,
      isRunning: false,
      endTime: null,
      timeLeft: times[nextMode],
      workSessionsCompleted: newWorkSessions,
    });
  };

  const toggleTimer = () => {
    if (pomoState.isRunning) {
      updateState({ isRunning: false, endTime: null });
    } else {
      const newEndTime = Date.now() + pomoState.timeLeft * 1000;
      updateState({ isRunning: true, endTime: newEndTime });
    }
  };

  const handleManualModeChange = (newMode) => {
    updateState({
      mode: newMode,
      isRunning: false,
      endTime: null,
      timeLeft: times[newMode],
    });
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "pomodoroState") {
        setPomoState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    let interval;

    if (pomoState.isRunning && pomoState.endTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const secondsRemaining = Math.round((pomoState.endTime - now) / 1000);

        if (secondsRemaining <= 0) {
          handleTimerComplete();
        } else {
          setPomoState((prev) => ({ ...prev, timeLeft: secondsRemaining }));
        }
      }, 1000);
    } else if (!pomoState.isRunning && pomoState.endTime) {
      const secondsRemaining = Math.round((pomoState.endTime - Date.now()) / 1000);
      if (secondsRemaining <= 0) {
        handleTimerComplete();
      }
    }

    return () => clearInterval(interval);
  }, [pomoState.isRunning, pomoState.endTime]);

  // View -------------------------------------------
  return (
    <>
      <div className="pomodoroContainer">
        <div className="pomodoroHeader">
          <p>Pomodoro</p>
        </div>

        <div className="pomodoroModes">
          <button className={pomoState.mode === "work" ? "active" : ""} onClick={() => handleManualModeChange("work")}>
            Work
          </button>
          <button
            className={pomoState.mode === "break" ? "active" : ""}
            onClick={() => handleManualModeChange("break")}
          >
            Break
          </button>
          <button className={pomoState.mode === "long" ? "active" : ""} onClick={() => handleManualModeChange("long")}>
            Long
          </button>
        </div>

        <h2>{formatTime(pomoState.timeLeft)}</h2>

        <button className="startButton" onClick={toggleTimer}>
          {pomoState.isRunning ? "Pause" : "Start pomodoro"}
        </button>
      </div>
    </>
  );
}

export default Pomodoro;
