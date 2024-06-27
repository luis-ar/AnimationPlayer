import { useEffect, useState } from "react";
import { animate, createTimeline, stagger } from "./anime/anime";
import Thursday from "./components/anime-letters/Thursday";
import SunnyMornings from "./components/anime-letters/sunny-mornings";
import GreatThinkers from "./components/anime-letters/great-thinkers";
import ReadySetGo from "./components/anime-letters/ready-set-go";
import SignalNoise from "./components/anime-letters/signal-noise";
import BeautifulQuestions from "./components/anime-letters/beautiful-questions";
import RealityBroken from "./components/anime-letters/reality-broken";
import Hello from "./components/anime-letters/hello";
import CoffeeMornings from "./components/anime-letters/coffee-mornings";
import DominoDreams from "./components/anime-letters/domino-dreams";
import HelloGoodbye from "./components/anime-letters/hello-goodbye";
import ANewProduction from "./components/anime-letters/a-new-production";
import RisingStrong from "./components/anime-letters/rising-strong";
import FindYourElement from "./components/anime-letters/find-your-element";
import OutNow from "./components/anime-letters/out-now";
import MadeWithLove from "./components/anime-letters/made-with-love";
import SeventeenAnimation from "./components/anime-letters/anime17";
import FlyInAnimation from "./components/fly-in";
import FadeInAnimation from "./components/fade-in";
import WipeInAnimation from "./components/wipe-in";
import ZoomInAnimation from "./components/zoom-in";
import BlockRevealInAnimation from "./components/block-reveal-in";
import TumbleInAnimation from "./components/tumble-in";
import FlickerAnimation from "./components/flicker";
import StompAnimation from "./components/stomp";
import SpinAnimation from "./components/spin";
import FadeOutAnimation from "./components/fade-out";
import FlyOutAnimation from "./components/fly-out";
import WipeOutAnimation from "./components/wipe-out";
import TumbleOutAnimation from "./components/tumble-out";
import BlockRevealOutAnimation from "./components/block-reveal-out";
import RevealInAnimation from "./components/reveal-in";
import RevealOutAnimation from "./components/reveal-out";
import ANewProductionIn from "./components/anime-letters/a-new-production-in";
import ANewProductionOut from "./components/anime-letters/a-new-production-out";
import RisingStrongIn from "./components/anime-letters/rising-strong-in";
import RisingStrongOut from "./components/anime-letters/rising-strong-out";

function App() {
  const timeLine = createTimeline({
    loop: true,
  });
  return (
    <>
      <Thursday text="Hello World" timeLine={timeLine} />
      {/* <SunnyMornings text="Hello World" timeLine={timeLine} /> */}
      {/* <GreatThinkers text="Hello World" timeLine={timeLine} /> */}
      {/* <ReadySetGo text="Hello World Luis" timeLine={timeLine} /> */}
      {/* <SignalNoise text="Hello World Luis" timeLine={timeLine} /> */}
      {/* <BeautifulQuestions text="Hello World Luis" timeLine={timeLine} /> */}
      {/* <RealityBroken text="Hello World Luis" timeLine={timeLine} /> */}
      {/* <Hello text="Luis" timeLine={timeLine} /> */}
      {/* <CoffeeMornings text="Hello World Luis" timeLine={timeLine} /> */}
      {/* <DominoDreams text="Hello World Luis" timeLine={timeLine} /> */}
      {/* <HelloGoodbye text="Hello World Luis" timeLine={timeLine} /> */}
      {/* <ANewProduction text="Hello World" timeLine={timeLine} /> */}
      {/* <ANewProductionIn text="Hello World" timeLine={timeLine} /> */}
      {/* <ANewProductionOut text="Hello World" timeLine={timeLine} /> */}
      {/* <RisingStrong text="Hello World" timeLine={timeLine} /> */}
      {/* <RisingStrongIn text="Hello World" timeLine={timeLine} /> */}
      {/* <RisingStrongOut text="Hello World" timeLine={timeLine} /> */}
      {/* <FindYourElement text="Hello World" timeLine={timeLine} /> */}
      {/* <OutNow text="Hello World Luis" timeLine={timeLine} /> */}
      {/* <MadeWithLove text="Hello World Luis" timeLine={timeLine} /> */}
      {/* <SeventeenAnimation text="Hello World Luis" timeLine={timeLine} /> */}
      {/* <FlyInAnimation timeLine={timeLine} /> */}
      {/* <FadeInAnimation timeLine={timeLine} /> */}
      {/* <WipeInAnimation timeLine={timeLine} /> */}
      {/* <ZoomInAnimation timeLine={timeLine} /> */}
      {/* <BlockRevealInAnimation timeLine={timeLine} /> */}
      {/* <TumbleInAnimation timeLine={timeLine} /> */}
      {/* <FlickerAnimation timeLine={timeLine} /> */}
      {/* <StompAnimation timeLine={timeLine} /> */}
      {/* <SpinAnimation timeLine={timeLine} /> */}
      {/* <FadeOutAnimation  timeLine={timeLine} /> */}
      {/* <FlyOutAnimation timeLine={timeLine} /> */}
      {/* <WipeOutAnimation timeLine={timeLine} /> */}
      {/* <TumbleOutAnimation timeLine={timeLine} /> */}
      {/* <BlockRevealOutAnimation timeLine={timeLine} /> */}
      {/* <RevealInAnimation timeLine={timeLine} /> */}
      {/* <RevealOutAnimation timeLine={timeLine} /> */}
    </>
  );
}

export default App;
