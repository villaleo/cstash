"use client";

import { ChangeEvent, useState } from "react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onChange?: (changes: string) => void;
}

export default function SearchBar({
  className,
  placeholder = "Search...",
  onChange,
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (onChange) onChange(searchValue);
    }
  };

  return (
    <input
      className={`border border-gray-200 p-1 px-2 rounded ${className}`}
      type="search"
      placeholder={placeholder}
      value={searchValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}
