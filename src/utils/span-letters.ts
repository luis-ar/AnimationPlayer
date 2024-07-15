export const spanLetters = (text: string, className: string) => {
  const elements = document.getElementsByClassName(className);
  const textWrapper = elements.length > 0 ? elements[0] : null;
  if (textWrapper) {
    textWrapper.innerHTML = "";
    const words = text.split(" ");
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "word";
      word.split("").forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.className = "letter";
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
      });
      textWrapper.appendChild(wordSpan);
      if (wordIndex < words.length - 1) {
        textWrapper.appendChild(document.createTextNode(" "));
      }
    });
  }
};
