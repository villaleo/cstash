"use client";

import { useState, useEffect, useCallback, MouseEvent, Suspense } from "react";

import api from "@/lib/api";
import { Snippet } from "@/lib/types";

import SnippetListItem from "@/components/snippets/snippets-list-item";
import Picker from "@/components/ui/picker";
import SearchBar from "@/components/ui/search-bar";
import { ArrowsUpDownIcon, FilterIcon, TagIcon } from "@/components/ui/icons";
import { GroupKey, OrderKey, useSnippets, useUpdateSnippet } from "@/lib/hooks/queries/use-snippets";

export default function SnippetsPage() {
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>(["Algorithms", "Data Structures"]);

  const [searchValue, setSearchValue] = useState("");
  const [groupBy, setGroupBy] = useState<GroupKey>("Last Modified");
  const [order, setOrder] = useState<OrderKey>("Descending Order");
  const {
    data: snippets,
    refetch: refetchSnippets,
    isFetching: isFetchingSnippets,
    isRefetching: isRefetchingSnippets,
    isError: isSnippetsError,
    error: snippetsError,
  } = useSnippets({ query: searchValue, tags, group: groupBy, order: order });

  const GroupButton = () => {
    const groupByLabel: Record<string, GroupKey> = {
      isFavorite: "Favorite",
      title: "Title",
      language: "Language",
      createdAt: "Created On",
      updatedAt: "Last Modified",
    };

    const handleSelect = (_event: MouseEvent<HTMLElement>, selection: string) => {
      setGroupBy(selection as GroupKey);
    };

    return (
      <Picker value={groupBy} opts={Object.values(groupByLabel)} onSelect={handleSelect}>
        <FilterIcon className="p-2 border border-gray-200 rounded" label={groupByLabel[groupBy]} />
      </Picker>
    );
  };

  const OrderButton = () => {
    const orderOptLabel: Record<string, string> = {
      asc: "Ascending",
      desc: "Descending",
    };

    const handleSelect = (_event: MouseEvent<HTMLElement>, selection: string) => {
      setOrder(selection as OrderKey);
    };

    return (
      <Picker opts={["Ascending", "Descending"]} onSelect={handleSelect}>
        <ArrowsUpDownIcon className="p-2 border border-gray-200 rounded" label={orderOptLabel[order]} />
      </Picker>
    );
  };

  const TagButton = () => {
    const handleSelect = (_event: MouseEvent<HTMLElement>, tagSelected: string) => {
      if (searchTags.includes(tagSelected)) {
        const index = searchTags.indexOf(tagSelected);

        const updatedSearchTags = [...searchTags];
        updatedSearchTags.splice(index, 1);

        setSearchTags(updatedSearchTags);
        return;
      }

      setSearchTags([...searchTags, tagSelected]);
    };

    return (
      <div>
        <Picker value={searchTags} opts={tags} onSelect={handleSelect}>
          <TagIcon className="p-2 border border-gray-200 rounded" />
        </Picker>

        {/* Badge with the number of selected search tags */}
        {searchTags.length > 0 && (
          <span
            className={`absolute -translate-y-10 translate-x-6 px-1.5 py-0 bg-gray-700 text-white text-xs text-center rounded-full`}
          >
            {searchTags.length}
          </span>
        )}
      </div>
    );
  };

  const handleSearchValueChange = (changes: string) => {
    setSearchValue(changes);
  };

  return (
    <Suspense fallback={<p>Loading..</p>}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">SnipStash</h1>

        <div className="flex justify-between md:mb-4">
          <div className="flex items-center gap-2 w-[100%] md:w-[50%]">
            <TagButton />
            <SearchBar className="w-[100%]" placeholder="Search snippets..." onChange={handleSearchValueChange} />
          </div>

          {/* Inline filter and order buttons are hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
            <GroupButton />
            <OrderButton />
          </div>
        </div>

        {/* Filter and order buttons are on a different line on mobile */}
        <div className="flex md:hidden items-center gap-1 my-4">
          <GroupButton />
          <OrderButton />
        </div>

        {(isFetchingSnippets || isRefetchingSnippets) && (
          <p className="text-gray-600 bg-gray-50 text-center rounded py-4">
            {isFetchingSnippets && "Loading snippets.."}
            {isRefetchingSnippets && "Reloading snippets.."}
          </p>
        )}

        {isSnippetsError && <p className="text-red-500 text-center py-8">{snippetsError.message}</p>}

        {snippets && (
          <ul className="space-y-4">
            {snippets.map((snippet) => (
              <SnippetListItem key={snippet.id} snippetId={snippet.id} onUpdate={refetchSnippets} />
            ))}
          </ul>
        )}
      </div>
    </Suspense>
  );
}
