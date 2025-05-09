"use client";

import { MouseEventHandler } from "react";

interface CheckIconProps {
  label?: string;
  className?: string;
  onClick?: MouseEventHandler<SVGElement>;
}

export default function CheckIcon({
  label,
  className,
  onClick,
}: CheckIconProps) {
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
          d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
          clipRule="evenodd"
        />
      </svg>
      {label && <span>{label}</span>}
    </span>
  );
}
