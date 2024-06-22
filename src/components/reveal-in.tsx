"use client";
import React, { useEffect } from "react";
import { animate } from "../anime/anime";
import "./style.css";

interface AnimatedLetterProps {
  text: string;
}

const RevealInAnimation: React.FC<AnimatedLetterProps> = ({ text }) => {
  useEffect(() => {
    animate(".ml33 .item", {
      left: { from: "-100%", to: "0%" },
      easing: "easeOutExpo",
      duration: 2000,
      delay: (el, i) => 70 * i,
      loop: true,
    });
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
