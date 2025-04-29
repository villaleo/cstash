import { MouseEvent, ReactNode, useState } from "react";
import useStatefulBool from "../hooks/statefulBool";
import CheckIcon from "../icons/CheckIcon";

interface MultipleChoiceDropdownProps {
  value: string[];
  opts: string[];
  onSelect: (event: MouseEvent<HTMLElement>, opts: string) => void;
  children: ReactNode;
}

export default function MultipleChoiceDropdown({
  value,
  opts,
  onSelect,
  children,
}: MultipleChoiceDropdownProps) {
  const [isExpanded, toggleIsExpanded] = useStatefulBool(false);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    toggleIsExpanded();
  };

  const handleSelect = (event: MouseEvent<HTMLElement>, opt: string) => {
    event.stopPropagation();
    onSelect(event, opt);
  };

  const handleBlur = () => setTimeout(() => toggleIsExpanded(false), 300);

  return (
    <div>
      <button
        className="p-0.5 hover:cursor-pointer rounded"
        onClick={handleClick}
        onBlur={handleBlur}
      >
        {children}
      </button>

      {isExpanded && (
        <ul className="absolute z-20 mt-2 w-50 bg-white border border-gray-300 text-gray-600 rounded shadow-lg">
          {opts.map((opt) => (
            <li
              key={opt}
              onClick={(event) => handleSelect(event, opt)}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-200`}
            >
              <span className="flex items-center gap-1">
                {value.includes(opt) && (
                  <CheckIcon className="absolute -translate-x-3" />
                )}
                <span className="pl-2">{opt}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
