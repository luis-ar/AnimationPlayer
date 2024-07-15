"use client";
import React, { useEffect } from "react";
import { Timeline } from "../anime/anime";
import "./style.css";
interface AnimatedLetterProps {
  timeLine: Timeline;
}
const FadeOutAnimation: React.FC<AnimatedLetterProps> = ({ timeLine }) => {
  useEffect(() => {
    timeLine.add(
      ".ml28",
      {
        opacity: { from: 1, to: 0 },
        translateY: { from: "0%", to: "-50%" },
        easing: "easeInOutQuint",
        ease: "inOutQuint",
        duration: 1500,
        delay: (el, i) => 150 * i,
        loop: true,
      },
      0
    );
  }, []);
  return (
    <div className="containerAnimation">
      <div className="ml28">
        <img src="https://image.shutterstock.com/image-photo/3d-cute-colorful-unicorn-valentines-260nw-2401151293.jpg" />
      </div>
    </div>
  );
};

export default FadeOutAnimation;
