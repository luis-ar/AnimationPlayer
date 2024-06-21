import { useEffect, useState } from "react";
import { animate, stagger } from "./anime/anime";
import FirstAnime from "./components/anime1";
import SecondAnimation from "./components/anime2";
import ThirdAnimation from "./components/anime3";
import FourthAnimation from "./components/anime4";
import FifthAnimation from "./components/anime5";
import SixthAnimation from "./components/anime6";
import SeventhAnimation from "./components/anime7";
import EighthAnimation from "./components/anime8";
import NinthAnimation from "./components/anime9";
import TenthAnimation from "./components/anime10";
import ElevenAnimation from "./components/anime11";
import TwelveAnimation from "./components/anime12";
import ThirteenAnimation from "./components/anime13";
import FourteenAnimation from "./components/anime14";
import FifteenAnimation from "./components/anime15";
import SixteenAnimation from "./components/anime16";
import SeventeenAnimation from "./components/anime17";
function App() {
  // useEffect(() => {
  //   animate(".square", {
  //     translateX: 320,
  //     rotate: { from: -180 },
  //     duration: 1250,
  //     delay: stagger(65, { from: "center" }),
  //     ease: "inOutQuint",
  //     loop: true,
  //     alternate: true,
  //   });
  // }, []);
  return (
    <>
      {/* <FirstAnime text="Hello World" /> */}
      {/* <SecondAnimation text="Hello World" /> */}
      {/* <ThirdAnimation text="Hello World" /> */}
      {/* <FourthAnimation text="Hello World Luis" /> */}
      {/* <FifthAnimation text="Hello World Luis" /> */}
      {/* <SixthAnimation text="Hello World Luis" /> */}
      {/* <SeventhAnimation text="Hello World Luis" /> */}
      {/* <EighthAnimation text="Luis" /> */}
      {/* <NinthAnimation text="Hello World Luis" /> */}
      {/* <TenthAnimation text="Hello World Luis" /> */}
      {/* <ElevenAnimation text="Hello World Luis" /> */}
      {/* <TwelveAnimation text="Hello World" /> */}
      {/* <ThirteenAnimation text="Hello World" /> */}
      {/* <FourteenAnimation text="Hello World" /> */}
      {/* <FifteenAnimation text="Hello World Luis" /> */}
      <SixteenAnimation text="Hello World Luis" />
      {/* <SeventeenAnimation text="Hello World Luis" /> */}
    </>
  );
}

export default App;
