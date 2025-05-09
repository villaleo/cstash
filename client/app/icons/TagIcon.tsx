"use client";

import { MouseEventHandler } from "react";

interface TagIconProps {
  label?: string;
  className?: string;
  onClick?: MouseEventHandler<SVGElement>;
}

export default function TagIcon({ label, className, onClick }: TagIconProps) {
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
          d="M4.5 2A2.5 2.5 0 0 0 2 4.5v2.879a2.5 2.5 0 0 0 .732 1.767l4.5 4.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-4.5-4.5A2.5 2.5 0 0 0 7.38 2H4.5ZM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
      {label && <span>{label}</span>}
    </span>
  );
}
