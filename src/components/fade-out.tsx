"use client";
import React, { useEffect, useRef } from "react";
import { createTimeline, animate } from "../anime/anime";
import "./style.css";
interface AnimatedLetterProps {
  text: string;
}
const FadeOutAnimation: React.FC<AnimatedLetterProps> = ({ text }) => {
  useEffect(() => {
    animate(".ml28", {
      opacity: { from: 1, to: 0 },
      translateY: { from: "0%", to: "-50%" },
      easing: "easeInOutQuint",
      ease: "inOutQuint",
      duration: 1500,
      delay: (el, i) => 150 * i,
      loop: true,
    });
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
