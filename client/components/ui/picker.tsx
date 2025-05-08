"use client";

import { MouseEvent, ReactNode, useState } from "react";
import { CheckIcon } from "./icons";

export interface PickerProps {
  className?: string;
  value?: string[] | string;
  opts: string[];
  onSelect: (event: MouseEvent<HTMLElement>, opt: string) => void;
  children: ReactNode;
}

export default function Picker({ className, value, opts, onSelect, children }: PickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = (event: MouseEvent<HTMLElement>, opt: string) => {
    event.stopPropagation();
    onSelect(event, opt);
  };

  const handleBlur = () => setTimeout(() => setIsExpanded(false), 300);

  const isSelected = (opt: string) => {
    if (!value) return false;

    switch (typeof value) {
      case "string":
        return (value as string) === opt;
      default:
        return (value as string[]).includes(opt);
    }
  };

  return (
    <div>
      <button
        className={`px-1 cursor-pointer transition-colors duration-300 text-gray-600 rounded ${className}`}
        onClick={handleClick}
        onBlur={handleBlur}
      >
        {children}
      </button>

      {isExpanded && (
        <ul className="absolute z-20 mt-2 w-50 bg-white border border-gray-300 rounded shadow-lg">
          {opts.map((opt) => (
            <li
              key={opt}
              onClick={(event) => handleSelect(event, opt)}
              className={`px-4 py-2 text-sm cursor-pointer bg-gray-50 hover:bg-gray-200`}
            >
              <span className="flex items-center gap-1">
                {isSelected(opt) && <CheckIcon className="absolute -translate-x-3" />}
                <span className="pl-2">{opt}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
