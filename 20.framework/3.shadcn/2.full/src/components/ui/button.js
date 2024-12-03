import React from "react";
import classNames from "classnames";

export const Button = ({ variant = "default", children, ...props }) => {
  const buttonClass = classNames(
    "px-4 py-2 rounded",
    {
      "bg-blue-500 text-white hover:bg-blue-700": variant === "primary",
      "bg-gray-300 text-black hover:bg-gray-400": variant === "default",
    }
  );

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};
