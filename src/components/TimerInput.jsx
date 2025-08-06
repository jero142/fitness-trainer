import React, { useState, useEffect } from 'react';

// TimerInput component receives props from parent:
// - currentItem: the currently displayed exercise
// - timerValue: the number of seconds the user has set
// - repsValue: the number of reps (used to disable input if set)
// - onTimerChange: callback to handle input changes
const TimerInput = ({ currentItem, timerValue, repsValue, onTimerChange }) => {
  // Local state to store validation error messages
  const [error, setError] = useState('');

  // When the timerValue changes, run validation
  useEffect(() => {
    // If no value or value less than 1, set an error message
    if (!timerValue || timerValue < 1) {
      setError('Please enter at least 1 second');
    } else {
      // If valid, clear the error
      setError('');
    }
  }, [timerValue]);

  // If there's no current item to work with, render nothing
  if (!currentItem) return null;

  // Boolean to determine whether the input is valid
  const isValid = timerValue && timerValue >= 1;

  return (
    <div className="input-with-validation">
      {/* Timer input field */}
      <input
        type="number" // Input only accepts numeric values
        inputMode="numeric" // Suggest numeric keyboard on mobile
        autoComplete="off" // Prevent browser autofill (especially on Android)
        placeholder="Enter time" // Placeholder text
        className={`form-chrono ${isValid ? 'valid-input' : 'invalid-input'}`} // Dynamic class based on validity
        value={timerValue} // Controlled value from parent
        onChange={(e) => onTimerChange(e, currentItem.productId)} // Notify parent of changes
        disabled={!!repsValue} // Disable if repsValue is set
        min="0" // Minimum allowed value
        name="timerInputSeconds" // Less generic name to avoid autofill triggers
      />
      
      {/* Error message display */}
      <p className={`input-error ${!isValid ? 'visible' : ''}`}>
        {/* Show error or a non-breaking space to maintain layout */}
        {error || '\u00A0'}
      </p>
    </div>
  );
};

export default TimerInput;