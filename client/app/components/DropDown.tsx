import { JSX, MouseEvent, ReactNode, useState } from "react";

import useStatefulBool from "@/app/hooks/statefulBool";

interface DropdownProps {
  opts: string[];
  onOptSelect?: (event: MouseEvent<HTMLElement>, opt: string) => void;
  children: ReactNode;
}

export default function Dropdown({
  opts,
  onOptSelect,
  children,
}: DropdownProps) {
  const [isExpanded, toggleIsExpanded] = useStatefulBool(false);

  const handleOnClick = (event: MouseEvent<HTMLElement>) => {
    toggleIsExpanded();
    event.stopPropagation();
  };

  const handleOnOptSelect = (event: MouseEvent<HTMLElement>, opt: string) => {
    event.stopPropagation();
    if (onOptSelect) onOptSelect(event, opt);
  };

  const handleOnBlur = () => setTimeout(() => toggleIsExpanded(false), 300);

  return (
    <div>
      <button
        className="p-0.5 hover:cursor-pointer hover:bg-gray-100 transition-colors duration-300 text-gray-600 rounded"
        onClick={handleOnClick}
        onBlur={handleOnBlur}
      >
        {children}
      </button>

      {isExpanded && (
        <ul className="absolute z-20 mt-2 w-36 bg-white border border-gray-300 rounded shadow-lg">
          {opts.map((opt) => (
            <li
              key={opt}
              onClick={(event) => handleOnOptSelect(event, opt)}
              className={`px-4 py-2 text-sm bg-gray-50 ${
                opt === "Delete"
                  ? "hover:bg-red-500 hover:text-white"
                  : "hover:bg-gray-200 hover:text-black"
              } cursor-pointer`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
