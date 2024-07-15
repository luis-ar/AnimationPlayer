"use client";
import React, { useEffect, useRef } from "react";
import { Timeline, createTimeline } from "../../anime/anime";
import "../style.css";
import { spanLetters } from "../../utils/span-letters";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
  from: number;
  to: number;
}
const CrissCross: React.FC<AnimatedLettersProps> = ({
  text,
  timeLine,
  from,
  to,
}) => {
  useEffect(() => {
    const timeFrom = (from / 30) * 1000;
    const timeTo = (to / 30) * 1000;
    const content1 = document
      .querySelector(".ml43 .content1")
      .getBoundingClientRect().width;
    const content2Elements = document.querySelectorAll(".ml43 .content2");

    const content2Widths = Array.from(content2Elements).map(
      (el) => el.getBoundingClientRect().width
    );
    timeLine
      .add(
        ".ml43 .content1",
        {
          width: { from: "0%", to: `${content1}px` },
          ease: "inOutQuad",
          opacity: 1,
          duration: 1500,
          delay: timeFrom,
        },
        0
      )
      .add(
        ".ml43 .text1",
        {
          left: { from: "110%", to: "0%" },
          opacity: 1,
          ease: "inOutQuad",
          duration: 1000,
        },
        "<-=1000"
      );
    content2Elements.forEach((element, index) => {
      timeLine.add(
        `.ml43 .content2:nth-child(${index + 1})`, // Selección dinámica del elemento content2
        {
          width: { from: "0%", to: `${content2Widths[index]}px` },
          ease: "inOutQuad",
          opacity: 1,
          duration: 1500,
          delay: timeFrom + 500,
        },
        0
      );

      timeLine.add(
        `.ml43 .content2:nth-child(${index + 1}) .text2`, // Selección dinámica del texto dentro de content2
        {
          left: { from: "110%", to: "0%" },
          opacity: 1,
          ease: "inOutQuad",
          duration: 1000,
        },
        "<-=1000"
      );
    });

    timeLine
      .add(
        ".ml43 .content1",
        {
          width: { from: `${content1}px`, to: "0%" },
          ease: "inOutQuad",
          duration: 1000,
          delay: timeTo - 1000,
        },
        0
      )
      .add(
        ".ml43 .text1",
        {
          left: { from: "0%", to: "110%" },
          ease: "inOutQuad",
          duration: 1000,
        },
        "<-=1000"
      );
    content2Elements.forEach((element, index) => {
      timeLine.add(
        `.ml43 .content2:nth-child(${index + 1})`,
        {
          width: { from: `${content2Widths[index]}px`, to: "0%" },
          ease: "inOutQuad",
          duration: 1000,
          delay: timeTo - 1000,
        },
        0
      );

      timeLine.add(
        `.ml43 .content2:nth-child(${index + 1}) .text2`,
        {
          left: { from: "0%", to: "110%" },
          ease: "inOutQuad",
          duration: 1000,
          delay: timeTo - 1000,
        },
        0
      );
    });
  }, [text]);
  return (
    <div className="ml43">
      <div className="content1">
        <div className="text1">hola mundo como estas</div>
      </div>
      <div className="content">
        <div className="content2">
          <div className="text2">hola mundo jajjaja</div>
        </div>
        <div className="content2">
          <div className="text2">hola mundo gaggagagagagagaagag</div>
        </div>
        <div className="content2">
          <div className="text2">
            hola mundo jajajajajajajajajajajajkakkakak
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrissCross;
