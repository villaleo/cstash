"use client";

import {
  useState,
  useEffect,
  useCallback,
  MouseEventHandler,
  MouseEvent,
} from "react";

import api from "@/lib/api";
import { Snippet } from "@/lib/types";
import { urlEncodeQueryArray } from "@/lib/common";
import SnippetListItem from "./SnippetsListItem";
import Dropdown from "./Dropdown";
import SearchBar from "./SearchBar";
import TagIcon from "../icons/TagIcon";
import ArrowsUpDownIcon from "../icons/ArrowsUpDownIcon";
import FilterIcon from "../icons/FilterIcon";
import MultipleChoiceDropdown from "./MultipleChoiceDropdown";

export default function SnippetsList() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<keyof Snippet>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all snippets
  const fetchSnippets = useCallback(async () => {
    const tagsQuery = urlEncodeQueryArray("tags", searchTags);
    const query = encodeURI(searchValue);

    try {
      setLoading(true);
      const snippetsResponse = await api.get(
        `/snippets?q=${query}&${tagsQuery}`
      );

      // Sort snippets consistently
      const sortedSnippets = sortSnippets(
        snippetsResponse.data,
        sortBy,
        sortOrder
      );
      setSnippets(sortedSnippets);

      const tagsResponse = await api.get("/tags");
      const tags: string[] = tagsResponse.data;

      // Sort tags alphabetically
      const sortedTags = tags.toSorted((a, b) => a.localeCompare(b));
      setTags(sortedTags);
    } catch (err: any) {
      if (err.status === 404) {
        setSnippets([]);
        return;
      }

      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder, searchValue, searchTags]);

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

    const handleOptSelect = (event: MouseEvent<HTMLElement>, opt: string) => {
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
    };

    return (
      <Dropdown
        opts={Object.values(filterOptLabel)}
        onOptSelect={handleOptSelect}
      >
        <FilterIcon
          className="p-1 px-2 border border-gray-200 rounded"
          label={filterOptLabel[sortBy]}
        />
      </Dropdown>
    );
  };

  const OrderButton = () => {
    const orderOptLabel: Record<string, string> = {
      asc: "Ascending",
      desc: "Descending",
    };

    const handleOptSelect = (event: MouseEvent<HTMLElement>, opt: string) => {
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
    };

    return (
      <Dropdown
        opts={["Ascending", "Descending"]}
        onOptSelect={handleOptSelect}
      >
        <ArrowsUpDownIcon
          className="p-1 px-2 border border-gray-200 rounded"
          label={orderOptLabel[sortOrder]}
        />
      </Dropdown>
    );
  };

  const TagButton = () => {
    return (
      <div>
        <MultipleChoiceDropdown
          value={searchTags}
          opts={tags}
          onSelect={(event, tag) => {
            if (searchTags.includes(tag)) {
              const index = searchTags.indexOf(tag)!;
              const updatedSearchTags = [...searchTags];

              updatedSearchTags.splice(index, 1);
              setSearchTags(updatedSearchTags);

              return;
            }

            setSearchTags([...searchTags, tag]);
          }}
        >
          <TagIcon className="p-2 border border-gray-200 rounded" />
        </MultipleChoiceDropdown>

        {searchTags.length > 0 && (
          <span
            className={`absolute -translate-y-10 translate-x-6 px-1.5 py-0 bg-red-500 text-white text-xs text-center rounded-full`}
          >
            {searchTags.length}
          </span>
        )}
      </div>
    );
  };

  const handleSearchChanges = (changes: string) => {
    setSearchValue(changes);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Code Stash</h1>

      <div className="flex justify-between md:mb-4">
        <div className="flex items-center gap-2 w-[100%] md:w-[50%]">
          <TagButton />
          <SearchBar
            className="w-[100%]"
            placeholder="Search snippets..."
            onChange={handleSearchChanges}
          />
        </div>
        {/* Inline filter and order buttons are hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <FilterButton />
          <OrderButton />
        </div>
      </div>

      {/* Filter and order buttons are on a different line on mobile */}
      <div className="flex md:hidden items-center gap-2 my-4">
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
