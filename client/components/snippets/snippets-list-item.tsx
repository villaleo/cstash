"use client";

import { MouseEvent, Suspense, useEffect, useState } from "react";

import { Snippet } from "@/lib/types";
import TextLabel from "../ui/text-label";
import { EllipsesIcon, StarIcon } from "../ui/icons";
import CopyButton from "../ui/copy-button";
import Picker from "../ui/picker";
import LoadingSpinner from "../ui/loading-spinner";
import useBool from "@/lib/hooks/use-bool";
import { useSnippet, useUpdateSnippet } from "@/lib/hooks/queries/use-snippets";

interface SnippetListItemProps {
  snippetId: string;
  onUpdate: () => void;
}

type ActionOption = "Edit" | "Favorite" | "Undo Favorite" | "Delete";

export default function SnippetListItem({ snippetId, onUpdate }: SnippetListItemProps) {
  const {
    data: snippet,
    refetch: refetchSnippet,
    isFetching: isFetchingSnippet,
    isRefetching: isRefetchingSnippet,
    isError: isSnippetError,
    error: snippetError,
  } = useSnippet(snippetId);
  const { mutate: updateSnippet, isPending: isUpdatingSnippet } = useUpdateSnippet();

  const [content, setContent] = useState("");
  const [isExpanded, toggleIsExpanded] = useBool();

  useEffect(() => snippet && setContent(snippet.content), [snippet]);

  const toggleFavorite = (event: MouseEvent) => {
    event.stopPropagation();
    updateSnippet({ id: snippetId, updates: { isFavorite: !snippet?.isFavorite } });
    setTimeout(onUpdate, 300);
  };

  const updateTitle = (title: string) => {
    updateSnippet({ id: snippetId, updates: { title } });
    setTimeout(onUpdate, 300);
  };

  const updateContent = () => {
    updateSnippet({ id: snippetId, updates: { content } });
    setTimeout(onUpdate, 300);
  };

  const handleSelect = (event: MouseEvent<HTMLElement>, actionSelected: string) => {
    switch (actionSelected as ActionOption) {
      case "Edit":
        break;
      case "Favorite":
      case "Undo Favorite":
        toggleFavorite(event);
        break;
      case "Delete":
        break;
    }
  };

  const options = ["Edit", snippet?.isFavorite ? "Undo Favorite" : "Favorite", "Delete"];

  return (
    <Suspense fallback={<>Loading..</>}>
      {snippet && (
        <li
          className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
            isExpanded && "shadow-lg"
          }`}
          onClick={() => toggleIsExpanded()}
        >
          <div className="flex justify-between items-center">
            <h2 className="flex gap-2 items-center text-lg font-medium text-gray-800">
              <div onClick={(event) => event.stopPropagation()}>
                <TextLabel
                  text={snippet.title}
                  placeholder="Snippet Title"
                  onChange={updateTitle}
                  disabled={isFetchingSnippet || isRefetchingSnippet}
                />
              </div>
              <StarIcon
                onClick={toggleFavorite}
                className={`${
                  snippet.isFavorite ? "text-yellow-500" : "text-gray-300"
                } hover:cursor-pointer inline-block transition-colors duration-200`}
              />
            </h2>
            <Picker opts={options} onSelect={handleSelect}>
              <EllipsesIcon />
            </Picker>
          </div>

          <p className="text-gray-500 mt-5">{snippet.description}</p>

          {/* Expandable Content Section */}
          <div
            className={`overflow-hidden transition-all duration-400 ease-in-out ${
              isExpanded ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pt-1">
              <div className="flex h-0 justify-end items-end gap-2 mb-2 translate-y-11 -translate-x-3">
                <CopyButton text={snippet.content} className="px-3 py-1 rounded text-xs font-medium" />
                <button
                  onClick={updateContent}
                  disabled={isFetchingSnippet || isRefetchingSnippet}
                  className={`px-3 py-1 rounded text-xs font-medium
                ${
                  isFetchingSnippet || isRefetchingSnippet
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                >
                  {isFetchingSnippet || isRefetchingSnippet ? "Saving..." : "Save"}
                </button>
              </div>
              <textarea
                id={`content-${snippet.id}`}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="w-full h-80 p-2 border border-gray-300 rounded font-mono text-sm resize-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Add your code snippet here..."
                spellCheck="false"
              />
              <div className="flex mt-2 text-xs text-gray-500 justify-between">
                <span>{content.split("\n").length} lines</span>
                <span>{content.length} characters</span>
              </div>
            </div>
          </div>

          {isUpdatingSnippet && <LoadingSpinner label="Saving changes..." />}

          <div className="mt-4 flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{snippet.language}</span>
              {snippet.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-gray-400 text-sm">{new Date(snippet.createdAt).toDateString()}</span>
          </div>
        </li>
      )}
    </Suspense>
  );
}
