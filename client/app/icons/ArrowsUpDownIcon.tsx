"use client";

import { MouseEventHandler } from "react";

interface ArrowsUpDownIconProps {
  label?: string;
  className?: string;
  onClick?: MouseEventHandler<SVGElement>;
}

export default function ArrowsUpDownIcon({
  label,
  className,
  onClick,
}: ArrowsUpDownIconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-4"
        onClick={onClick}
      >
        <path
          fillRule="evenodd"
          d="M13.78 10.47a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06l.97.97V5.75a.75.75 0 0 1 1.5 0v5.69l.97-.97a.75.75 0 0 1 1.06 0ZM2.22 5.53a.75.75 0 0 1 0-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1-1.06 1.06l-.97-.97v5.69a.75.75 0 0 1-1.5 0V4.56l-.97.97a.75.75 0 0 1-1.06 0Z"
          clipRule="evenodd"
        />
      </svg>
      {label && <span>{label}</span>}
    </span>
  );
}
