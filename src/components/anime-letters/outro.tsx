"use client";
import React, { useEffect } from "react";
import { Timeline } from "../../anime/anime";
import "../style.css";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
  from: number;
  to: number;
}
const Outro: React.FC<AnimatedLettersProps> = ({ text, timeLine, from }) => {
  useEffect(() => {
    const timeFrom = (from / 30) * 1000;
    timeLine
      .add(
        ".ml40 .container",
        {
          width: { from: "0%", to: "80%" },
          ease: "inOutQuad",
          duration: 1500,
          delay: timeFrom,
        },
        0
      )
      .add(
        ".ml40 .icon",
        {
          opacity: 1,
          ease: "inOutQuad",
          duration: 1000,
          delay: timeFrom,
        },
        "<-=800"
      )
      .add(
        ".ml40 .containerText2 .text1",
        {
          opacity: { from: 0, to: 1 },
          ease: "inOutQuad",
          duration: 1000,
        },
        "<-=800"
      )
      .add(
        ".ml40 .containerText2 .text2",
        {
          opacity: { from: 0, to: 1 },
          ease: "inOutQuad",
          duration: 1000,
        },
        "<-=800"
      )
      .add(
        ".ml40 .containerText2 .text3",
        {
          opacity: { from: 0, to: 1 },
          ease: "inOutQuad",
          duration: 1000,
        },
        "<-=800"
      )
      .add(
        ".ml40 .containerText3 .text1",
        {
          opacity: { from: 0, to: 1 },
          ease: "inOutQuad",
          duration: 1000,
        },
        "<-=800"
      )
      .add(
        ".ml40 .containerText3 .textURL",
        {
          opacity: { from: 0, to: 1 },
          ease: "inOutQuad",
          duration: 1000,
        },
        "<-=800"
      )
      .add(
        ".ml40 .containerText3 .textURL-text",
        {
          opacity: { from: 0, to: 1 },
          ease: "inOutQuad",
          duration: 1000,
        },
        "<-=800"
      );
  }, [text]);
  return (
    <div className="ml40">
      <div className="container">
        <div className="containerText1">
          <div className="icon"></div>
        </div>
        <div className="containerText2">
          <span className="text1">choose happiness</span>
          <span className="text2">choose joy</span>
          <span className="text3">choose peace</span>
        </div>
        <div className="containerText3">
          <span className="text1">#FeelGoodFriday</span>
          <div className="text2">
            <span className="textURL">
              <span className="textURL-text">www.yoursite.com</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outro;
