"use client";

import { useState, useEffect, useCallback } from "react";

import api from "@/lib/api";
import { Snippet } from "@/lib/types";
import { urlEncodeQueryArray } from "@/lib/common";
import SnippetListItem from "./SnippetsListItem";
import Dropdown from "./DropDown";

export default function SnippetsList() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<keyof Snippet>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
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
      const sortedSnippets = sortSnippets(response.data, sortBy, sortOrder);
      setSnippets(sortedSnippets);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tags, sortBy, sortOrder]);

  // Function to update a single snippet in the local state
  const updateSnippetLocally = useCallback(
    (updatedSnippet: Snippet) => {
      setSnippets((prevSnippets) => {
        const updated = prevSnippets.map((snippet) =>
          snippet.id === updatedSnippet.id ? updatedSnippet : snippet
        );
        // Re-sort to maintain consistency
        return sortSnippets(updated, sortBy, sortOrder);
      });
    },
    [sortBy, sortOrder]
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

  const FilterButton = () => {
    const filterOptLabel: Record<string, string> = {
      isFavorite: "Favorites",
      title: "Title",
      description: "Description",
      content: "Content",
      language: "Language",
      createdAt: "Date Created",
      updatedAt: "Date Updated",
    };

    return (
      <Dropdown
        label={filterOptLabel[sortBy]}
        opts={Object.values(filterOptLabel)}
        onOptSelect={(event, opt) => {
          switch (opt) {
            case "Favorites":
              setSortBy("isFavorite");
              break;
            case "Title":
              setSortBy("title");
              break;
            case "Description":
              setSortBy("description");
              break;
            case "Content":
              setSortBy("content");
              break;
            case "Language":
              setSortBy("language");
              break;
            case "Date Created":
              setSortBy("createdAt");
              break;
            case "Date Updated":
              setSortBy("updatedAt");
              break;
            default:
              setSortBy("createdAt");
              break;
          }
        }}
        role="filter"
      />
    );
  };

  const OrderButton = () => {
    const orderOptLabel: Record<string, string> = {
      asc: "Ascending",
      desc: "Descending",
    };

    return (
      <Dropdown
        label={orderOptLabel[sortOrder]}
        opts={["Ascending", "Descending"]}
        onOptSelect={(event, opt) => {
          switch (opt) {
            case "Ascending":
              setSortOrder("asc");
              break;
            case "Descending":
              setSortOrder("desc");
              break;
            default:
              setSortOrder("desc");
              break;
          }
        }}
        role="order"
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Code Stash</h1>

      <div className="flex justify-between md:mb-4">
        <input
          className="w-[100%] md:w-[50%] border border-gray-200 p-1 px-2 rounded"
          type="search"
          placeholder="Search snippets..."
        />
        {/* Inline filter and order buttons are hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <FilterButton />
          <OrderButton />
        </div>
      </div>

      {/* Filter and order buttons are on a different line on mobile */}
      <div className="flex md:hidden items-center gap-4 my-4">
        <FilterButton />
        <OrderButton />
      </div>

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
