"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline, animate } from "../anime/anime";
import "./style.css";
interface AnimatedLetterProps {
  text: string;
}
const FlickerAnimation: React.FC<AnimatedLetterProps> = ({ text }) => {
  const tl = createTimeline({
    loop: true,
  });

  useEffect(() => {
    tl.add(
      ".ml24",
      {
        opacity: {
          from: 0,
          to: 1,
          duration: 150,
          delay: (el, i) => 70 * i,
          ease: "outExpo",
        },
        loop: 10,
      },
      0
    );
  }, []);
  return (
    <div className="containerAnimation">
      <div className="ml24">
        <img src="https://image.shutterstock.com/image-photo/3d-cute-colorful-unicorn-valentines-260nw-2401151293.jpg" />
      </div>
    </div>
  );
};

export default FlickerAnimation;
