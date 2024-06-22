"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline, animate } from "../anime/anime";
import "./style.css";
interface AnimatedLetterProps {
  text: string;
}
const SpinAnimation: React.FC<AnimatedLetterProps> = ({ text }) => {
  const tl = createTimeline({
    loop: true,
  });

  useEffect(() => {
    tl.add(
      ".ml26",
      {
        rotate: {
          to: 360,
          duration: 1000,
          delay: 100,
          ease: "inOutCirc",
        },
      },
      0
    );
  }, []);
  return (
    <div className="containerAnimation">
      <div className="ml26">
        <img src="https://image.shutterstock.com/image-photo/3d-cute-colorful-unicorn-valentines-260nw-2401151293.jpg" />
      </div>
    </div>
  );
};

export default SpinAnimation;
