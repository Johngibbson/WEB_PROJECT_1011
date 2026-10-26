import { useEffect, useState } from 'react';

// CountUp: animates a number from 0 up to `end` over `duration` milliseconds.
// Screen readers get the final number straight away from the hidden span.
export default function CountUp({ end, duration = 1200 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || end === 0) {
      setValue(end);
      return undefined;
    }

    let frameId;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.round(end * progress));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [end, duration]);

  return (
    <>
      <span aria-hidden="true">{value}</span>
      <span className="visually-hidden">{end}</span>
    </>
  );
}
