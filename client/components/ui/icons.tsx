"use client";

import { MouseEventHandler } from "react";

interface IconProps {
  className?: string;
  label?: string;
  onClick?: MouseEventHandler<SVGElement>;
}

export function ArrowsUpDownIcon({ className, label, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4" onClick={onClick}>
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

export function EllipsesIcon({ className, label, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
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

export function StarIcon({ label, className, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" onClick={onClick}>
        <path
          fillRule="evenodd"
          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
          clipRule="evenodd"
        />
      </svg>
      {label && <span>{label}</span>}
    </span>
  );
}

export function BuildingOfficeIcon({ className, label, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4" onClick={onClick}>
        <path
          fillRule="evenodd"
          d="M3.75 2a.75.75 0 0 0 0 1.5H4v9h-.25a.75.75 0 0 0 0 1.5H6a.5.5 0 0 0 .5-.5v-3A.5.5 0 0 1 7 10h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h2.25a.75.75 0 0 0 0-1.5H12v-9h.25a.75.75 0 0 0 0-1.5h-8.5ZM6.5 4a.5.5 0 0 0-.5.5V5a.5.5 0 0 0 .5.5H7a.5.5 0 0 0 .5-.5v-.5A.5.5 0 0 0 7 4h-.5ZM6 7a.5.5 0 0 1 .5-.5H7a.5.5 0 0 1 .5.5v.5A.5.5 0 0 1 7 8h-.5a.5.5 0 0 1-.5-.5V7Zm3-3a.5.5 0 0 0-.5.5V5a.5.5 0 0 0 .5.5h.5A.5.5 0 0 0 10 5v-.5a.5.5 0 0 0-.5-.5H9Zm-.5 3a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5H9a.5.5 0 0 1-.5-.5V7Z"
          clipRule="evenodd"
        />
      </svg>

      {label && <span>{label}</span>}
    </span>
  );
}

export function CalendarIcon({ className, label, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4" onClick={onClick}>
        <path d="M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7.25 8.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM8 9.5A.75.75 0 1 0 8 11a.75.75 0 0 0 0-1.5Z" />
        <path
          fillRule="evenodd"
          d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1ZM3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V7Z"
          clipRule="evenodd"
        />
      </svg>

      {label && <span>{label}</span>}
    </span>
  );
}

export function CheckIcon({ className, label, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4" onClick={onClick}>
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

export function FilterIcon({ className, label, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" onClick={onClick}>
        <path
          fillRule="evenodd"
          d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z"
          clipRule="evenodd"
        />
      </svg>

      {label && <span>{label}</span>}
    </span>
  );
}

export function ThreeHorizontalLinesIcon({ className, label, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="menu-button"
        className="h-6 w-6 hover:cursor-pointer md:hidden block"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
        onClick={onClick}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>

      {label && <span>{label}</span>}
    </span>
  );
}

export function PencilSquareIcon({ className, label, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4" onClick={onClick}>
        <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
        <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
      </svg>

      {label && <span>{label}</span>}
    </span>
  );
}

export function XIcon({ className, label, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4" onClick={onClick}>
        <path
          fillRule="evenodd"
          d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z"
          clipRule="evenodd"
        />
      </svg>

      {label && <span>{label}</span>}
    </span>
  );
}

export function PersonIcon({ className, label, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4" onClick={onClick}>
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
      </svg>

      {label && <span>{label}</span>}
    </span>
  );
}

export function TagIcon({ className, label, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4" onClick={onClick}>
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
