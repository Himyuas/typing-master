import "./styles.css";
import { LoremIpsum } from "lorem-ipsum";
import { useState, useRef, useEffect } from "react";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 4,
    min: 1,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const content = lorem.generateParagraphs(11);

const countDownValue = 60;

export default function App() {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(countDownValue);
  const [fidxs, setFIdxs] = useState([]);
  const [sidxs, setSIdxs] = useState([]);
  const [currIdx, setCurrIdx] = useState(0);
  const inpRef = useRef();

  const resetStates = () => {
    setTimer(countDownValue);
    setScore(0);
    setFIdxs([]);
    setSIdxs([]);
    inpRef.current.value = "";
    setCurrIdx(0);
    inpRef.current.focus();
  };

  const keyDownHandler = (e) => {
    if (timer === countDownValue) {
      setTimer(countDownValue - 1);
    }
    const inpLen = inpRef.current.value.length;
    if (e.key.includes("Shift")) {
      return;
    } else if (e.key === "Backspace") {
      if (inpLen > 0) {
        setCurrIdx(inpLen === 1 ? 0 : inpLen - 1);
        if (inpRef.current.value[inpLen - 1] === content[inpLen - 1]) {
          setSIdxs((p) => p.filter((pp) => pp !== inpLen - 1));
        } else {
          setFIdxs((p) => p.filter((pp) => pp !== inpLen - 1));
        }
      }
    } else if (e.key === content[inpLen]) {
      setCurrIdx(inpLen + 1);
      setSIdxs((p) => [...p, inpLen]);
      setFIdxs((p) => p.filter((pp) => pp !== inpLen));
    } else {
      setCurrIdx(inpLen + 1);
      setFIdxs((p) => [...p, inpLen]);
      setSIdxs((p) => p.filter((pp) => pp !== inpLen));
    }
  };

  const getStyle = (idx) => {
    const style = {};
    if (fidxs.includes(idx)) {
      style.color = "red";
    } else if (sidxs.includes(idx)) {
      style.color = "purple";
    }
    return style;
  };

  useEffect(() => {
    inpRef.current.focus();
  }, []);

  useEffect(() => {
    setScore(sidxs.length);
  }, [sidxs]);

  useEffect(() => {
    if (timer === 0) {
      inpRef.current.blur();
    }
    if (!timer || timer === countDownValue) return;
    const int = setInterval(() => setTimer((t) => t - 1), 1000);

    return () => clearInterval(int);
  }, [timer]);

  return (
    <div
      className="App"
      onClick={() => {
        if (timer === 0) {
          resetStates();
        }
      }}
    >
      <h1>{timer === countDownValue ? "Start Typing..." : "Typing Test"}</h1>
      {timer === 0 && (
        <div className="popup">Typing Speed: {Math.trunc(score / 5)} wpm</div>
      )}
      <div className="stContainer">
        <h3>Score: {score}</h3>
        <h3>Timer: {timer}</h3>
      </div>
      <div
        className="editArea"
        onClick={() => {
          inpRef.current.focus();
        }}
      >
        <div className="background">
          {[...content].map((c, idx) => (
            <span
              key={idx}
              style={getStyle(idx)}
              className={currIdx === idx ? "cursor" : ""}
            >
              {c}
            </span>
          ))}
        </div>
        <input
          ref={inpRef}
          type="text"
          onKeyDown={keyDownHandler}
          spellCheck={false}
        />
      </div>
       
    </div>
  );
}
