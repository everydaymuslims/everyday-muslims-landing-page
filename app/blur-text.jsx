import { Fragment } from "react";

export function BlurText({ text, startIndex = 0 }) {
  return (
    <span className="blur-text">
      {text.split(" ").map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? " " : null}
          <span className="blur-text-word" style={{ "--word-order": startIndex + index }}>
            {word}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
