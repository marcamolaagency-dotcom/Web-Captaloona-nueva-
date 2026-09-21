import React, { useEffect, useState } from 'react';

interface CountdownProps {
  endDate: string;
  labels: { days: string; hours: string; minutes: string; seconds: string };
  onEnd?: () => void;
}

function getRemaining(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  return {
    ended: diff <= 0,
    days: Math.floor(clamped / 86400000),
    hours: Math.floor((clamped % 86400000) / 3600000),
    minutes: Math.floor((clamped % 3600000) / 60000),
    seconds: Math.floor((clamped % 60000) / 1000),
  };
}

const Countdown: React.FC<CountdownProps> = ({ endDate, labels, onEnd }) => {
  const [remaining, setRemaining] = useState(() => getRemaining(endDate));

  useEffect(() => {
    const tick = () => {
      const next = getRemaining(endDate);
      setRemaining(next);
      if (next.ended) onEnd?.();
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endDate, onEnd]);

  if (remaining.ended) {
    return null;
  }

  const units: Array<[number, string]> = [
    [remaining.days, labels.days],
    [remaining.hours, labels.hours],
    [remaining.minutes, labels.minutes],
    [remaining.seconds, labels.seconds],
  ];

  return (
    <div className="flex items-center gap-3" role="timer" aria-live="polite">
      {units.map(([value, label]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-2xl md:text-3xl serif tabular-nums">{String(value).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase tracking-widest text-zinc-400">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
