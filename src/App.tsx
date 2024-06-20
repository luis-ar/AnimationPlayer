import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { animate, stagger } from "./anime/anime";
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    animate(".square", {
      translateX: 320,
      rotate: { from: -180 },
      duration: 1250,
      delay: stagger(65, { from: "center" }),
      ease: "inOutQuint",
      loop: true,
      alternate: true,
    });
  }, []);
  return (
    <>
      <div
        className="square"
        style={{
          width: 100,
          height: 100,
          backgroundColor: "#555",
          margin: 10,
          borderRadius: 5,
        }}
      ></div>
    </>
  );
}

export default App;
