import { useEffect, useRef, useState } from "react";
import formatTime from "../util/formatTime";

const StopWatch = ({ time, setTime }) => {
  const [isOn, setIsOn] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOn) {
      const timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      timerRef.current = timer;
    } else {
      clearInterval(timerRef.current);
    }
  }, [isOn]);

  return (
    <div>
      <span className="time">{formatTime(time)}</span>
      <button
        onClick={() => {
          setIsOn((prev) => !prev);
        }}
      >
        {isOn ? "멈춤" : "시작"}
      </button>
      <button onClick={() => setTime(0)}>초기화</button>
    </div>
  );
};

export default StopWatch;
