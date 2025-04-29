import {
  useState,
  useRef,
  useEffect,
  MouseEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";

interface EditableLabelProps {
  className?: string;
  text: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (nextText: string) => void;
  width?: string;
}

export default function EditableLabel({
  className,
  text,
  placeholder,
  disabled,
  onChange,
  width,
}: EditableLabelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const [elementWidth, setElementWidth] = useState<string>(width || "auto");
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  // Reset value when text prop changes
  useEffect(() => setValue(text), [text]);

  // Calculate and set width when component mounts or text changes
  useEffect(() => {
    if (!width && spanRef.current) {
      // Add a small buffer to prevent text truncation
      const calculatedWidth = spanRef.current.offsetWidth + 8;
      setElementWidth(`${calculatedWidth}px`);
    }
  }, [text, width]);

  // Focus when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const saveChanges = () => {
    // Don't save if the value is empty
    if (value === "") {
      setValue(text);
      setIsEditing(false);
      return;
    }

    setIsEditing(false);
    onChange(value);
  };

  const cancelChanges = () => {
    // Reset to original text
    setValue(text);
    setIsEditing(false);
  };

  const handleBlur = () => cancelChanges();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveChanges();
    }

    if (e.key === "Escape") {
      cancelChanges();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  const startEditing = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const commonStyles = `p-1 rounded ${className || ""}`;
  const widthStyle = {
    minWidth: elementWidth,
    width: elementWidth,
  };

  return (
    <>
      {!disabled && isEditing ? (
        <div className="relative">
          <input
            className={`${commonStyles} border border-gray-300`}
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder={placeholder}
            style={widthStyle}
          />
          <p className={`h-0 text-sm text-blue-700`}>Press Enter to save</p>
        </div>
      ) : (
        <span
          ref={spanRef}
          className={`${commonStyles} border border-transparent hover:border-gray-300 ${
            !disabled ? "hover:cursor-pointer" : ""
          } transition-colors duration-200 inline-block`}
          onClick={startEditing}
          style={width ? widthStyle : undefined}
        >
          {text}
        </span>
      )}
    </>
  );
}
