import server from "./client";
import { Snippet } from "../types";

export const createSnippet = async (snippet: Partial<Snippet>) => {
  const { data: newSnippet } = await server.post<Snippet>("/snippets", snippet);
  return newSnippet;
};

export const getSnippets = async (tags: string[] = [], query: string = "") => {
  let queryValues = "?";

  if (tags.length > 0) {
    queryValues += urlEncodeQueryArray("tags", tags) + `${query && "&"}`;
  }

  if (query) {
    queryValues += `q=${query}`;
  }

  const { data: snippets } = await server.get<Snippet[]>(`/snippets${queryValues}`);
  return snippets;
};

export const getSnippet = async (id: string) => {
  const { data: snippet } = await server.get<Snippet>(`/snippets/${id}`);
  return snippet;
};

export const updateSnippet = async (id: string, updates: Partial<Snippet>) => {
  const { data: updatedSnippet } = await server.put<Snippet>(`/snippets/${id}`, updates);
  return updatedSnippet;
};

export const deleteSnippet = async (id: string) => {
  await server.delete<void>(`/snippets/${id}`);
};

/**
 * Encodes an array of data for use in a URL query string. Spaces are replaced
 * with a '&' and each element in data is prefixed with key=.
 *
 * For example, if data=[a, b, c] and key="tags", then
 * urlEncodeQueryArray(key, data) will return "tags=a&tags=b&tags=c".
 * @param key The query key to repeat for each item in data
 * @param data The data to be encoded
 * @returns Array data encoded to safely be used as a URL query value
 */
export function urlEncodeQueryArray(key: string, data: string[]): string {
  return data.map((tag) => `${key}=${tag}`).join("&");
}
