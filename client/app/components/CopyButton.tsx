import React, { useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
  children?: React.ReactNode;
  successMessage?: string;
  buttonText?: string;
}

export default function CopyButton({
  text,
  className = "",
  children,
  successMessage = "Copied!",
  buttonText = "Copy",
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
      disabled={isCopied}
      aria-label={isCopied ? "Copied to clipboard" : "Copy to clipboard"}
    >
      {children || (isCopied ? successMessage : buttonText)}
    </button>
  );
}
