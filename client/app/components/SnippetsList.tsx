"use client";

import { useState, useEffect, useCallback } from "react";

import api from "@/lib/api";
import { Snippet } from "@/lib/types";
import { urlEncodeQueryArray } from "@/lib/common";
import SnippetListItem from "./SnippetsListItem";

interface SnippetsListProps {
  tags?: string[];
  sortBy?: keyof Snippet;
  sortDirection?: "asc" | "desc";
}

export default function SnippetsList({
  tags,
  sortBy = "createdAt", // Default sort
  sortDirection = "desc", // Default direction (newest first)
}: SnippetsListProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all snippets
  const fetchSnippets = useCallback(async () => {
    let endpoint = "/snippets";

    if (tags && tags.length > 0) {
      const query = urlEncodeQueryArray("tags", tags);
      endpoint += "?" + query;
    }

    try {
      setLoading(true);
      const response = await api.get(endpoint);
      // Sort snippets consistently
      const sortedSnippets = sortSnippets(response.data, sortBy, sortDirection);
      setSnippets(sortedSnippets);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tags, sortBy, sortDirection]);

  // Function to update a single snippet in the local state
  const updateSnippetLocally = useCallback(
    (updatedSnippet: Snippet) => {
      setSnippets((prevSnippets) => {
        const updated = prevSnippets.map((snippet) =>
          snippet.id === updatedSnippet.id ? updatedSnippet : snippet
        );
        // Re-sort to maintain consistency
        return sortSnippets(updated, sortBy, sortDirection);
      });
    },
    [sortBy, sortDirection]
  );

  // Helper function to sort snippets consistently
  const sortSnippets = (
    snippets: Snippet[],
    field: keyof Snippet,
    direction: "asc" | "desc"
  ) => {
    return [...snippets].sort((a, b) => {
      let comparison = 0;

      // Handle different field types
      if (typeof a[field] === "string" && typeof b[field] === "string") {
        comparison = (a[field] as string).localeCompare(b[field] as string);
      } else if (a[field] instanceof Date && b[field] instanceof Date) {
        comparison =
          (a[field] as Date).getTime() - (b[field] as Date).getTime();
      } else if (
        typeof a[field] === "boolean" &&
        typeof b[field] === "boolean"
      ) {
        comparison = a[field] === b[field] ? 0 : a[field] ? 1 : -1;
      } else {
        // Fallback for other types
        comparison = String(a[field]).localeCompare(String(b[field]));
      }

      return direction === "asc" ? comparison : -comparison;
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  if (loading && snippets.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">Loading snippets...</p>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">Error: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Snippets</h1>

      {snippets.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No snippets found</p>
      ) : (
        <ul className="space-y-4">
          {snippets.map((snippet) => (
            <SnippetListItem
              key={snippet.id}
              snippet={snippet}
              onUpdate={updateSnippetLocally}
              refreshList={fetchSnippets}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
