import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
const Workout = () => {
  // Get all cart items from Redux store
  const carts = useSelector((store) => store.cart.items);

  // Filter only the exercises with either a timer or a number of reps set
  const exercises = carts.filter(item => Number(item.timer) > 0 || Number(item.reps) > 0);

  // Track the current exercise index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Remaining time for current timer-based exercise (in milliseconds)
  const [remainingTime, setRemainingTime] = useState(null);

  // Countdown before starting a timer-based exercise (3, 2, 1, GO!)
  const [introCountdown, setIntroCountdown] = useState(3);

  // Controls whether the intro countdown is shown
  const [showIntro, setShowIntro] = useState(false);

  // Ref to store interval ID for countdown timer
  const intervalRef = useRef(null);

  // Ref to control and play the bell sound
  const bellRef = useRef(null); 

  // Get the current exercise from the filtered array
  const currentExercise = exercises[currentIndex];

  // Check if current exercise is timer-based
  const isTimer = Number(currentExercise?.timer) > 0;

  // Check if current exercise is rep-based
  const isReps = Number(currentExercise?.reps) > 0;

  // On exercise change: start intro countdown for timer-based exercises
  useEffect(() => {
    if (isTimer) {
      setIntroCountdown(3);  // Reset countdown to 3
      setShowIntro(true);    // Show the countdown
    } else {
      setShowIntro(false);   // Skip countdown for rep-based exercises
    }
  }, [currentIndex]);

  // Handle countdown and transition to the timer
  useEffect(() => {
    if (!showIntro) return;

    // Decrease countdown every second
    if (introCountdown > 0) {
      const timer = setTimeout(() => {
        setIntroCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer); // Cleanup timeout
    }

    // When countdown hits 0, play bell and start exercise timer
    if (introCountdown === 0 && isTimer) {
      const goTimer = setTimeout(() => {
        playBell();              // Play start bell
        setShowIntro(false);     // Hide intro
        startTimer();            // Begin timer
      }, 1000);
      return () => clearTimeout(goTimer);
    }
  }, [introCountdown, showIntro]);

  // Start the countdown timer for the current exercise
  const startTimer = () => {
    const duration = Number(currentExercise.timer);
    setRemainingTime(duration * 1000); // Convert to milliseconds

    const start = Date.now();

    // Start interval to update remaining time
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const timeLeft = duration * 1000 - elapsed;

      // If time is up, clear interval and go to next exercise
      if (timeLeft <= 0) {
        clearInterval(intervalRef.current);
        setRemainingTime(0);
        playBell(); // Play bell when exercise ends
        goToNextExercise();
      } else {
        setRemainingTime(timeLeft);
      }
    }, 100); // Update every 100ms for smoother countdown
  };

  // Play bell sound by resetting and triggering the <audio> element
  const playBell = () => {
    if (bellRef.current) {
      bellRef.current.currentTime = 0;
      bellRef.current.play();
    }
  };

  // Move to the next exercise or show completion alert if done
  const goToNextExercise = () => {
    clearInterval(intervalRef.current);
    setRemainingTime(null);
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert('Workout complete!');
    }
  };

  // Show fallback if no exercise is selected
  if (!currentExercise) return <p>No exercises selected.</p>;

  return (
    <div className="workout-container">

      {/* Audio element for bell sound */}
      <audio ref={bellRef} src={`${import.meta.env.BASE_URL}sounds/bell.mp3`} preload="auto" />

      {/* Countdown intro display */}
      {showIntro ? (
        <div className="intro-countdown">
          <h1>{introCountdown > 0 ? introCountdown : "GO!"}</h1>
        </div>
      ) : (
        <>
          {/* Exercise GIF */}
          <div className="gifworkout-container">
            <img src={currentExercise.gif} alt="exercise gif" className="gif-video-workout" />
          </div>

          {/* Display for timer or reps */}
          <div className="workout-chrono-reps-container">
            <div className="exercise-title-workout">
              {currentExercise.name}
            </div>

            <div className="workout-chrono-reps-player">
              {isTimer && (
                <h2 className="timer-text">
                  Time: {(remainingTime / 1000).toFixed(1)}s
                </h2>
              )}
              {isReps && (
                <h2 className="reps-text">
                  Reps: {currentExercise.reps}
                </h2>
              )}
            </div>

            {/* Show NEXT button for rep-based exercises */}
            {isReps && (
              <button className="button-next-exercise" onClick={goToNextExercise}>NEXT EXERCISE</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Workout;