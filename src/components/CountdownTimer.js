import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className="text-center">
      <div className="text-sm text-gray-500 mb-2">
        Redirecionando em:
      </div>
      <div className="text-2xl font-bold text-orange-500">
        {timeLeft}s
      </div>
    </div>
  );
};

export default CountdownTimer;
