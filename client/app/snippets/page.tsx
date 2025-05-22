"use client";

import { isAxiosError } from "axios";

import { useSnippets, useUpdateSnippet } from "@/lib/hooks/queries/snippets";
import { Snippet } from "@/lib/types";

export default function SnippetsPage() {
  const { data: snippets, error: snippetsError } = useSnippets({});
  const { mutate: updateSnippet } = useUpdateSnippet();

  const handleFavorite = (snippet: Snippet) =>
    updateSnippet({
      id: snippet.id,
      updates: { isFavorite: !snippet.isFavorite },
    });

  return (
    <div>
      {snippetsError && isAxiosError(snippetsError) && (
        <>
          <p className="font-bold text-red-400 text-xl">An error occurred</p>
          <p className="font-bold text-red-400">{snippetsError.status}</p>
          <p className="font-bold text-red-400">{snippetsError.message}</p>
        </>
      )}
      {snippets ? (
        <>
          <p>Snippets:</p>
          <ul>
            {snippets.map((s) => (
              <li key={s.id}>
                <div className="flex justify-between">
                  <div>
                    <span className="mr-4 text-gray-500 dark:text-gray-400 text-sm">{s.id}</span>
                    <span>{s.title}</span>
                  </div>
                  <button onClick={() => handleFavorite(s)}>{s.isFavorite ? "Unfavorite" : "Favorite"}</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No snippets</p>
      )}
    </div>
  );
}
