import React, { useState, useEffect } from 'react';

// RepsInput component receives:
// - currentItem: the current exercise object
// - repsValue: the current number of reps entered
// - timerValue: the current timer value (used to disable this input if set)
// - onRepsChange: callback function to handle input changes
const RepsInput = ({ currentItem, repsValue, timerValue, onRepsChange }) => {
  // Local state to control whether the error message is shown
  const [errorVisible, setErrorVisible] = useState(false);

  // Runs whenever the repsValue changes
  useEffect(() => {
    // Show error if reps are missing or less than 1
    setErrorVisible(!repsValue || repsValue < 1);
  }, [repsValue]);

  // If no current item is selected, render nothing
  if (!currentItem) return null;

  // Boolean to determine if current repsValue is valid
  const isValid = repsValue && repsValue >= 1;

  return (
    <div className="input-with-validation">
      {/* Reps input field */}
      <input
        type="number" // Only accept numbers
        inputMode="numeric" // Suggest numeric keyboard on mobile
        autoComplete="off" // Prevent autofill suggestions
        placeholder="Enter reps" // Hint text inside the input
        className={`form-reps ${isValid ? 'valid-input' : 'invalid-input'}`} // Style based on input validity
        value={repsValue} // Controlled input value
        onChange={(e) => onRepsChange(e, currentItem.productId)} // Notify parent when value changes
        disabled={!!timerValue} // Disable this input if timer is set (mutual exclusivity)
        min="0" // Prevent negative values
        name="repsInputCount" // More specific name to reduce autofill triggers
      />

      {/* Error message below the input */}
      <p className={`input-error ${errorVisible ? 'visible' : ''}`}>
        {/* Show message if invalid, or non-breaking space to maintain height */}
        {errorVisible ? 'Please enter at least 1 rep' : '\u00A0'}
      </p>
    </div>
  );
};

export default RepsInput;