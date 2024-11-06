import { useState, useEffect, useRef } from "react";
import "./App.css";
import Timer from "./components/Timer";
import StopWatch from "./components/StopWatch";
import Advice from "./components/Advice";
import useFetch from "./hook/useFecth";
import Clock from "./components/Clock";
import formatTime from "./util/formatTime";

function App() {
  const url = "http://localhost:3000/todos";
  const { isLoading, data, error } = useFetch(url);
  const [todo, setTodo] = useState(null);
  const [time, setTime] = useState(0);
  const [isTimer, setIsTimer] = useState(true);
  const [currentTodo, setCurrentTodo] = useState(null);

  useEffect(() => {
    setTime(0);
  }, [isTimer]);

  useEffect(() => {
    if (data) {
      console.log(data);
      setTodo(data); // 데이터를 상태에 저장
    }
  }, [data]);

  useEffect(() => {
    if (todo) {
      let newTime = todo.find((el) => el.id === currentTodo)?.time + 1;
      if (newTime)
        fetch(`http://localhost:3000/todos/${currentTodo}`, {
          method: "PATCH",
          body: JSON.stringify({
            time: newTime,
          }),
        })
          .then((res) => res.json())
          .then((res) =>
            setTodo((prev) =>
              prev.map((el) => (el.id === currentTodo ? res : el))
            )
          );
    }
  }, [time]);

  if (isLoading) return <div>Loading...</div>;
  else
    return (
      <>
        <h1>TODO LIST</h1>
        <Clock />
        <Advice />
        <button onClick={() => setIsTimer((prev) => !prev)}>
          {isTimer ? "스톱워치로 변경" : "타이머로 변경"}
        </button>
        {isTimer ? (
          <Timer time={time} setTime={setTime} />
        ) : (
          <StopWatch time={time} setTime={setTime} />
        )}
        <TodoInput setTodo={setTodo} />
        <TodoList
          todo={todo}
          setTodo={setTodo}
          currentTodo={currentTodo}
          setCurrentTodo={setCurrentTodo}
        />
      </>
    );
}

const TodoInput = ({ setTodo }) => {
  const inputRef = useRef(null);
  return (
    <section>
      <input ref={inputRef} type="text" />
      <button
        onClick={() =>
          fetch("http://localhost:3000/todos", {
            method: "POST",
            body: JSON.stringify({
              content: inputRef.current.value,
              time: 0,
            }),
          })
            .then((res) => res.json())
            .then((res) => setTodo((prev) => [...prev, res]))
        }
      >
        추가
      </button>
    </section>
  );
};

const TodoList = ({ todo, setTodo, currentTodo, setCurrentTodo }) => {
  return (
    <ul>
      {todo?.map((el) => (
        <Todo
          key={el.id}
          todo={el}
          setTodo={setTodo}
          currentTodo={currentTodo}
          setCurrentTodo={setCurrentTodo}
        />
      ))}
    </ul>
  );
};

const Todo = ({ todo, setTodo, currentTodo, setCurrentTodo }) => {
  console.log(todo);
  return (
    <li className={todo.id === currentTodo ? "current" : ""}>
      <div>
        <h2>{todo.content}</h2>
        <div>소모시간 : {formatTime(todo.time)}</div>
      </div>
      <div>
        <button onClick={() => setCurrentTodo(todo.id)}>할일 하기!</button>
        <button
          onClick={() =>
            fetch(`http://localhost:3000/todos/${todo.id}`, {
              method: "DELETE",
            }).then((res) => {
              if (res.ok)
                setTodo((prev) => prev.filter((el) => el.id !== todo.id));
            })
          }
        >
          삭제
        </button>
      </div>
    </li>
  );
};

export default App;
