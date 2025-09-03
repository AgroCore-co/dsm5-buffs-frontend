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
    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
      <div className="text-sm text-gray-600 mb-2 font-medium">
        Redirecionando automaticamente em:
      </div>
      <div className="text-3xl font-bold text-orange-600 mb-2">
        {timeLeft}s
      </div>
      <div className="text-xs text-gray-500">
        Ou clique no botão &quot;Fazer Login&quot; para ir imediatamente
      </div>
    </div>
  );
};

export default CountdownTimer;
