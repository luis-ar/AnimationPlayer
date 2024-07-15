"use client";
import React, { useEffect } from "react";
import { Timeline, animate } from "../anime/anime";
import "./style.css";

interface AnimatedLetterProps {
  timeLine: Timeline;
}

const RevealInAnimation: React.FC<AnimatedLetterProps> = ({ timeLine }) => {
  useEffect(() => {
    timeLine.add(
      ".ml33 .item",
      {
        left: { from: "-100%", to: "0%" },
        easing: "easeOutExpo",
        duration: 2000,
        delay: (el, i) => 70 * i,
        loop: true,
      },
      0
    );
  }, []);

  return (
    <div className="containerAnimation">
      <div className="ml33">
        <img
          className="item"
          src="https://image.shutterstock.com/image-photo/3d-cute-colorful-unicorn-valentines-260nw-2401151293.jpg"
        />
      </div>
    </div>
  );
};

export default RevealInAnimation;
