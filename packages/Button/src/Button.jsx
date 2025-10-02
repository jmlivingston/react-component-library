import React from "react";
import "./Button.scss";
void React;

function Button({ children, onClick, variant = "primary" }) {
  return (
    <button className={`button ${variant}`.trim()} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
