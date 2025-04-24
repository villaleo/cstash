import React, { useState, useRef, useEffect } from "react";

interface EditableLabelProps {
  className?: string;
  text: string;
  disabled?: boolean;
  onChange: (nextText: string) => void;
  minWidth?: number;
}

export default function EditableLabel({
  className,
  text,
  disabled,
  onChange,
  minWidth = 50,
}: EditableLabelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Update width based on current text content
  const updateWidth = () => {
    if (inputRef.current && measureRef.current) {
      measureRef.current.textContent = value || text;
      const textWidth = measureRef.current.offsetWidth + 16;
      inputRef.current.style.width = `${Math.max(textWidth, minWidth)}px`;
    }
  };

  // Focus and set width when editing starts
  useEffect(() => {
    if (isEditing) {
      if (inputRef.current) {
        inputRef.current.focus();
        // Set initial width when switching to edit mode
        updateWidth();
      }
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (value === "") {
        return;
      }
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setValue(text);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setTimeout(updateWidth, 0);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const commonStyles = `p-1 rounded ${className}`;

  return (
    <>
      {/* Hidden span used for text width measurement */}
      <span
        ref={measureRef}
        style={{
          visibility: "hidden",
          position: "absolute",
          whiteSpace: "pre",
          fontSize: "1rem",
          padding: "0.25rem",
          fontFamily: "inherit",
        }}
      >
        {value || text}
      </span>

      {!disabled && isEditing ? (
        <input
          className={`${commonStyles} border border-gray-300`}
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          type="text"
          style={{ minWidth: `${minWidth}px` }}
        />
      ) : (
        <span
          className={`${commonStyles} border border-transparent hover:border-gray-300 hover:cursor-pointer transition-colors duration-200 inline-block`}
          onClick={startEditing}
        >
          {text}
        </span>
      )}
    </>
  );
}
