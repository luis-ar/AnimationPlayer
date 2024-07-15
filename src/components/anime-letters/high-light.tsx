"use client";
import React, { useEffect, useRef, useState } from "react";
import { Timeline } from "../../anime/anime";
import "../style.css";

interface AnimatedLettersProps {
  text: string;
  timeLine: Timeline;
  from: number;
  to: number;
}

const HighLight: React.FC<AnimatedLettersProps> = ({
  text,
  timeLine,
  from,
  to,
}) => {
  const [contentDimensions, setContentDimensions] = useState<
    { width: number; height: number }[]
  >([]);
  const contentRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const timeFrom = (from / 30) * 1000;
    const timeTo = (to / 30) * 1000;

    const content1Elements = document.querySelectorAll(".ml44 .content1");
    const textElements = document.querySelectorAll(".ml44 .text");

    const dimensions = Array.from(content1Elements).map((el, index) => {
      const content1Rect = el.getBoundingClientRect();
      const textRect = textElements[index].getBoundingClientRect();
      return { width: content1Rect.width, height: textRect.height };
    });

    setContentDimensions(dimensions);

    dimensions.forEach((dim, index) => {
      const { height, width } = dim;
      timeLine
        .add(
          `.ml44 .content:nth-child(${index + 1})`,
          {
            height: { from: "0%", to: `${height + 10}px` },
            ease: "inOutQuad",
            opacity: 1,
            duration: 1000,
            delay: timeFrom,
          },
          0
        )
        .add(
          `.ml44 .content1:nth-child(${index + 1})`,
          {
            height: { from: "0%", to: `${height + 10}px` },
            ease: "inOutQuad",
            opacity: 1,
            duration: 1500,
          },
          "<-=800"
        )
        .add(
          `.ml44 .text:nth-child(${index + 1})`,
          {
            top: { from: "100%", to: "0%" },
            ease: "inOutQuad",
            opacity: { from: 0, to: 1 },
            duration: 1500,
          },
          "<-=1200"
        )
        .add(
          `.ml44 .text:nth-child(${index + 1})`,
          {
            opacity: { from: 1, to: 0 },
            ease: "inOutQuad",
            duration: 500,
            delay: timeTo - 1500,
          },
          0
        )
        .add(
          `.ml44 .content1:nth-child(${index + 1})`,
          {
            height: { from: `${height}`, to: `0px` },
            ease: "inOutQuad",
            duration: 1500,
            delay: timeTo - 1500,
          },
          0
        )
        .add(
          `.ml44 .content:nth-child(${index + 1})`,
          {
            height: { from: `${height}`, to: `0px` },
            ease: "inOutQuad",
            duration: 1500,
            delay: timeTo - 1500,
          },
          0
        );
    });
  }, [text]);

  return (
    <div className="ml44">
      <div
        ref={(el) => el && (contentRefs.current[0] = el)}
        className="content"
        style={{
          width: contentDimensions[0]?.width
            ? contentDimensions[0].width - 1
            : "auto",
        }}
      >
        <div className="content1">
          <div className="text">{text}</div>
        </div>
        <div className="content2"></div>
      </div>
      <div
        ref={(el) => el && (contentRefs.current[1] = el)}
        className="content"
        style={{
          width: contentDimensions[1]?.width
            ? contentDimensions[1].width - 1
            : "auto",
        }}
      >
        <div className="content1">
          <div className="text">Hi luis </div>
        </div>
        <div className="content2"></div>
      </div>
    </div>
  );
};

export default HighLight;
