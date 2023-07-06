"use client";

import { useEffect, useState } from "react";

// ✖◯

const cond = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const lines = [
  "top-[19%] -translate-y-1/2 left-[10%] w-4/5",
  "top-1/2 -translate-y-1/2 left-[10%] w-4/5",
  "bottom-[14%] -translate-y-1/2 left-[10%] w-4/5",
  "top-[48%] -translate-x-1/2 left-[19%] w-4/5 rotate-90",
  "top-[48%] -translate-x-1/2 left-[50%] w-4/5 rotate-90",
  "top-[48%] -translate-x-1/2 left-[80%] w-4/5 rotate-90",
  "top-[49%] left-[-5%]  w-[110%] rotate-45",
  "top-[49%] left-[-5%]  w-[110%] -rotate-45",
];

const Board: React.FC = () => {
  const clear = [null, null, null, null, null, null, null, null, null];
  const clearScore = { "✖": 0, "◯": 0 };
  const [checked, setChecked] = useState<Array<null | "✖" | "◯">>(clear);
  const [finished, setFinished] = useState(false);
  const [endLine, setEndLine] = useState<number>(0);
  const [currHand, setCurrHand] = useState(true);
  const [endText, setEndText] = useState("GOOD LUCK!");
  const [draw, setDraw] = useState(false);
  const [score, setScore] = useState<{ "✖": number; "◯": number }>(clearScore);

  const checkWin = (hand: "✖" | "◯") => {
    return cond.some((c, i) => {
      if (c.every((i) => checked[i] === hand)) {
        setEndLine(i);
        setFinished(true);
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    //console.log("RUNNING: ", checked);
    if (checkWin("✖")) {
      setScore({ ...score, "✖": score["✖"] + 1 });
      setEndText("The ✖ HAS WON!");
    } else if (checkWin("◯")) {
      setScore({ ...score, "◯": score["◯"] + 1 });
      setEndText("The ◯ HAS WON!");
    } else if (checked.every((e) => e !== null)) {
      setFinished(true);
      setDraw(true);
      setEndText("IT'S A DRAW!");
    }
  }, [JSON.stringify(checked)]);
  const cantReset = finished || (score["✖"] === 0 && score["◯"] === 0);
  return (
    <div>
      <h3 className="font-bold mb-2 text-center">{endText}</h3>
      <div className="flex flex-row m-auto relative max-w-xl aspect-square w-[min(80vw,_80vh)] md:w-[60vw] ">
        <div className="w-full h-full rounded-2xl p-2 sm:p-5 bg-purple-300 grid grid-cols-3 grid-rows-3 gap-2">
          {checked.map((b, i) => (
            <div
              onClick={() => {
                if (!checked[i] && !finished) {
                  setChecked((l) => {
                    l[i] = currHand ? "✖" : "◯";
                    setCurrHand(!currHand);
                    return l;
                  });
                }
              }}
              className={`text-3xl sm:text-6xl md:text-8xl flex items-center justify-center rounded-xl 
          bg-gray-100 text-black w-auto h-auto cursor-default 
          ${b === null && !finished ? "hover:cursor-pointer" : ""}`}
              key={i}
            >
              {b}
            </div>
          ))}
        </div>
        <div
          className={`${lines[endLine]}
          ${finished && !draw ? "" : "hidden"}
          rounded-full absolute  h-2 sm:h-4 md:h-5 bg-red-600/80
        `}
        />
        <div
          className={`
        ${!finished ? "hidden" : ""}
        absolute w-full h-full rounded-xl bg-gray-100/25 top-0 left-0
        `}
        />
        <div
          className={`${!finished ? "hidden" : ""} 
          bg-purple-500 p-3 rounded-md text-white  
          absolute self-center hover:cursor-pointer -translate-x-1/2 left-1/2`}
          onClick={() => {
            setFinished(false);
            setEndText("GOOD LUCK!");
            setChecked(clear);
            setDraw(false);
          }}
        >
          PLAY&nbsp;AGAIN
        </div>
      </div>
      <div className="flex flex-col mt-3  bottom-[-4em]">
        <p className="text-center">SCORE</p>
        <p className="text-center text-3xl">
          ✖ {score["✖"]}:{score["◯"]} ◯
        </p>
        {!cantReset && (
          <button
            disabled={cantReset}
            className="btn mt-3 self-center w-[8em] 
        text-purple-700   border border-purple-500 
        p-1 rounded-md hover:text-purple-500 hover:bg-violet-500/10 active:bg-transparent"
            onClick={() => {
              setScore(clearScore);
            }}
          >
            reset score
          </button>
        )}
      </div>
    </div>
  );
};

export default Board;
