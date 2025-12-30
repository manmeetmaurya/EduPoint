import React from "react";

const HighlightText = ({text}) => {
  return (
    <span className="bg-gradient-to-b from-blue-200 via-caribbeangreen-300 to-caribbeangreen-200 text-transparent bg-clip-text font-bold">
      {" "}
      {text}
    </span>
  );
};

export default HighlightText;
