import { ITrackItem } from "./types";

export const trackItems: ITrackItem[] = [
  {
    id: "1",
    type: "text",
    details: {
      text: "Hello Morning",
      fontSize: 100,
    },
    display: {
      from: 0,
      to: 150,
    },
    animation: "sunnyMornings",
  },
  {
    id: "2",
    type: "text",
    details: {
      text: "Hello World",
      fontSize: 100,
    },
    display: {
      from: 150,
      to: 360,
    },
    animation: "thursday",
  },
  {
    id: "3",
    type: "text",
    details: {
      text: "Hello Thinkers",
      fontSize: 100,
    },
    display: {
      from: 390,
      to: 570,
    },
    animation: "greatThinkers",
  },
  {
    id: "4",
    type: "text",
    details: {
      text: "Hello Luis",
      fontSize: 100,
    },
    display: {
      from: 600,
      to: 930,
    },
    animation: "readySetGo",
  },
];
