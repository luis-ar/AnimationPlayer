"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline, animate } from "../anime/anime";
import "./style.css";
interface AnimatedLetterProps {
  text: string;
}
const WipeInAnimation: React.FC<AnimatedLetterProps> = ({ text }) => {
  useEffect(() => {
    animate(".ml20", {
      width: { from: "0%", to: "100%" },
      opacity: { from: 0, to: 1 },
      ease: "outExpo",
      duration: 2000,
      delay: (el, i) => 70 * i,
      loop: true,
    });
  }, []);
  return (
    <div className="containerAnimation">
      <div className="ml20">
        <img src="https://image.shutterstock.com/image-photo/3d-cute-colorful-unicorn-valentines-260nw-2401151293.jpg" />
      </div>
    </div>
  );
};

export default WipeInAnimation;
