import { useState, ReactNode } from "react";

interface CopyButtonProps {
  className?: string;
  text: string;
  successMessage?: string;
  buttonText?: string;
  children?: ReactNode;
}

export default function CopyButton({
  className = "",
  text,
  successMessage = "Copied!",
  buttonText = "Copy",
  children,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      const timeout = 3 * 1000;
      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
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
