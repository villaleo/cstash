"use client";

import { MouseEvent, useState } from "react";

import api from "@/lib/api";
import { Snippet } from "@/lib/types";
import EditableLabel from "./EditableLabel";
import StarIcon from "@/app/icons/StarIcon";
import CopyButton from "./CopyButton";
import Dropdown from "./DropDown";
import ProgressIndicator from "./ProgressIndicator";
import useStatefulBool from "@/app/hooks/statefulBool";
import EllipsesIcon from "@/app/icons/EllipsesIcon";

interface SnippetListItemProps {
  snippet: Snippet;
  onUpdate: (updatedSnippet: Snippet) => void;
  refreshList: () => Promise<void>;
}

interface SnippetUpdateableFields {
  title?: string;
  description?: string;
  content?: string;
  language?: string;
  tags?: string[];
  isFavorite?: boolean;
}

export default function SnippetListItem({
  snippet,
  onUpdate,
  refreshList,
}: SnippetListItemProps) {
  const [isDeleted, toggleIsDeleted] = useStatefulBool(false);
  const [isUpdating, toggleIsUpdating] = useStatefulBool(false);
  const [error, setError] = useState<string | null>(null);
  const [localSnippet, setLocalSnippet] = useState<Snippet>(snippet);
  const [isExpanded, toggleIsExpanded] = useStatefulBool(false);
  const [editedContent, setEditedContent] = useState(snippet.content);

  const dropdownOpts = [
    "Edit",
    localSnippet.isFavorite ? "Undo Favorite" : "Favorite",
    "Delete",
  ];

  // Only update specific fields, but return the full updated snippet
  const updateSnippet = async (updates: SnippetUpdateableFields) => {
    if (isUpdating) return;

    try {
      toggleIsUpdating(true);

      // Optimistic update - update locally first
      const optimisticUpdate = { ...localSnippet, ...updates };
      setLocalSnippet(optimisticUpdate);

      // Send update to server
      const response = await api.put(`/snippets/${snippet.id}`, updates);

      // Update with actual server response if available, otherwise keep optimistic update
      const updatedSnippet = response.data || optimisticUpdate;
      setLocalSnippet(updatedSnippet);

      // If content is being edited, update our local state
      if (updates.content) {
        setEditedContent(updates.content);
      }

      // Notify parent about the update
      onUpdate(updatedSnippet);
    } catch (err: any) {
      // Revert to original on error
      setLocalSnippet(snippet);
      setError(err.message);

      // On serious errors, refresh the whole list as fallback
      if (err.status >= 500) {
        await refreshList();
      }
    } finally {
      toggleIsUpdating(false);
    }
  };

  const deleteSnippet = async () => {
    // Can't delete something that is being updated
    if (isUpdating) return;

    try {
      await api.delete(`/snippets/${snippet.id}`);
      toggleIsDeleted(true);
    } catch (err: any) {
      setError(err.message);

      if (err.status >= 500) {
        await refreshList();
      }
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    // Prevent the click from toggling expansion
    e.stopPropagation();
    updateSnippet({ isFavorite: !localSnippet.isFavorite });
  };

  const updateTitle = (newTitle: string) => {
    if (newTitle !== localSnippet.title) {
      updateSnippet({ title: newTitle });
    }
  };

  const saveContent = () => {
    if (editedContent !== localSnippet.content) {
      updateSnippet({ content: editedContent });
    }
  };

  const handleOnOptSelect = (event: MouseEvent<HTMLElement>, opt: string) => {
    switch (opt) {
      case "Edit":
        // Handle editing
        break;
      case "Favorite":
      case "Undo Favorite":
        toggleFavorite(event);
        break;
      case "Delete":
        deleteSnippet();
      default:
        break;
    }
  };

  if (error) {
    return (
      <li className="border border-red-200 bg-red-50 rounded-lg p-4">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => setError(null)}
          className="text-sm text-red-700 underline mt-2"
        >
          Dismiss
        </button>
      </li>
    );
  }

  const snippetItem = (
    <li
      className={`border ${
        isUpdating ? "border-blue-200 bg-blue-50" : "border-gray-200"
      }
      rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer
      ${isExpanded ? "shadow-lg" : ""}`}
      onClick={() => toggleIsExpanded()}
    >
      <div className="flex justify-between items-center">
        <h2 className="flex gap-2 items-center text-lg font-medium text-gray-800">
          {/* Stop propagation to prevent expansion when editing the title */}
          <div onClick={(e) => e.stopPropagation()}>
            <EditableLabel
              text={localSnippet.title}
              placeholder="Snippet Title"
              onChange={updateTitle}
              disabled={isUpdating}
            />
          </div>
          <StarIcon
            onClick={toggleFavorite}
            className={`${
              localSnippet.isFavorite ? "text-yellow-500" : "text-gray-300"
            } hover:cursor-pointer inline-block transition-colors duration-200`}
          />
        </h2>
        <Dropdown opts={dropdownOpts} onOptSelect={handleOnOptSelect}>
          <EllipsesIcon />
        </Dropdown>
      </div>

      <p className="text-gray-500 mt-4">{localSnippet.description}</p>

      {/* Expandable Content Section */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          isExpanded ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-1">
          <div className="flex h-0 justify-end items-end gap-2 mb-2 translate-y-11 -translate-x-3">
            <CopyButton
              text={localSnippet.content}
              className="px-3 py-1 rounded text-xs font-medium"
            />
            <button
              onClick={saveContent}
              disabled={isUpdating || editedContent === localSnippet.content}
              className={`px-3 py-1 rounded text-xs font-medium
                ${
                  isUpdating || editedContent === localSnippet.content
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
          <textarea
            id={`content-${snippet.id}`}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-80 p-2 border border-gray-300 rounded font-mono text-sm resize-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Add your code snippet here..."
            spellCheck="false"
          />
          <div className="flex mt-2 text-xs text-gray-500 justify-between">
            <span>{editedContent.split("\n").length} lines</span>
            <span>{editedContent.length} characters</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {localSnippet.language}
          </span>
          {localSnippet.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-gray-400 text-sm">
          {new Date(localSnippet.createdAt).toDateString()}
        </span>
      </div>

      {isUpdating && <ProgressIndicator label="Saving changes..." />}
    </li>
  );

  return isDeleted ? <></> : snippetItem;
}
