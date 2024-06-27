// global.d.ts
interface Window {
  AnimeJS?: any[];
}

// global.d.ts
declare function setImmediate(
  callback: (...args: any[]) => void,
  ...args: any[]
): number;
declare function clearImmediate(handle: number): void;
