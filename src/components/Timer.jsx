import { useEffect, useRef, useState } from "react";
import formatTime from "../util/formatTime";

const Timer = ({ time, setTime }) => {
  const [startTime, setStartTime] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOn && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (!isOn || time <= 0) {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current); // Cleanup function
  }, [isOn, time]);

  return (
    <div>
      <span className="time">
        {time ? formatTime(time) : formatTime(startTime)}
      </span>

      <button
        onClick={() => {
          setTime(time ? time : startTime);
          setStartTime(0);
          setIsOn(true);
        }}
      >
        시작
      </button>
      <button onClick={() => setIsOn(false)}>멈춤</button>
      <button
        onClick={() => {
          setTime(0);
          setIsOn(false);
        }}
      >
        리셋
      </button>
      <br />
      <input
        type="range"
        max="3600"
        step="30"
        onChange={(e) => setStartTime(e.target.value)}
      />
    </div>
  );
};

export default Timer;
