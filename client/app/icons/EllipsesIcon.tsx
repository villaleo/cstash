"use client";

import { MouseEventHandler } from "react";

interface EllipsesIconProps {
  label?: string;
  className?: string;
  onClick?: MouseEventHandler<SVGElement>;
}

export default function EllipsesIcon({
  label,
  className,
  onClick,
}: EllipsesIconProps) {
  return (
    <span className={`flex items-center gap-2 ${label ? "p-1" : ""}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`size-6 ${className}`}
        onClick={onClick}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
      {label && <span>{label}</span>}
    </span>
  );
}
