"use client";

import { useState, useEffect } from "react";

import api from "@/lib/api";
import { Snippet } from "@/lib/types";
import { urlEncodeQueryArray } from "@/lib/common";

interface SnippetsListProps {
  tags?: string[];
}

export default function SnippetsList({ tags }: SnippetsListProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSnippets() {
      let endpoint = "/snippets";

      if (tags) {
        const query = urlEncodeQueryArray("tags", tags);
        endpoint += "?" + query;
      }

      try {
        const response = await api.get(endpoint);
        setSnippets(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSnippets();
  }, []);

  if (loading) {
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
            <SnippetListItem key={snippet.id} snippet={snippet} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SnippetListItem({ snippet }: { snippet: Snippet }) {
  return (
    <li className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-medium text-gray-800">
          {snippet.title}
          {snippet.isFavorite && (
            <span className="text-yellow-500 ml-2">★</span>
          )}
        </h2>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {snippet.language}
        </span>
      </div>

      <p className="text-gray-600 mt-2">{snippet.description}</p>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {snippet.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-gray-400 text-sm">
          {formatDate(snippet.createdAt)}
        </span>
      </div>
    </li>
  );
}

function formatDate(date: Date): string {
  return new Date(date).toDateString();
}
