import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { animate, stagger, createTimeline } from "./anime";

const timeline = createTimeline({});

function App() {
  useEffect(() => {
    const timeline = createTimeline({
      autoplay: false,
    });

    timeline
      .add(
        ".circle",
        {
          translateX: "15rem",
          duration: 500,
          delay: 2000,
        },
        0
      )
      .add(
        ".square",
        {
          translateX: "15rem",
          duration: 500,
          delay: 2000,
        },
        0
      )
      .add(
        ".triangle",
        {
          translateX: "15rem",
          translateY: "-.375rem",
          rotate: "1turn",
          scale: 1.5,
          delay: 0,
        },
        0
      );
  }, []);
  return (
    <>
      <div>
        <div
          className="square"
          style={{ width: 100, height: 100, backgroundColor: "red" }}
        ></div>
        <div
          className="circle"
          style={{ width: 100, height: 100, backgroundColor: "blue" }}
        ></div>
        <div
          className="triangle"
          style={{ width: 100, height: 100, backgroundColor: "green" }}
        ></div>
      </div>
    </>
  );
}

export default App;
