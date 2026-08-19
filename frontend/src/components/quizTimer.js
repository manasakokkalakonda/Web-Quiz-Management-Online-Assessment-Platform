// src/components/QuizTimer.jsx
import React, { useState, useEffect } from 'react';

const QuizTimer = ({ initialMinutes, onTimeExpired }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeExpired(); // Trigger automatic submission when timer runs out
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeExpired]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={`p-3 rounded-md font-bold ${secondsLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-800'}`}>
      Time Remaining: {formatTime(secondsLeft)}
    </div>
  );
};

export default QuizTimer;