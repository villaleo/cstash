import client from "./client";
import { Snippet } from "../types";

/**
 * Write a new snippet to the database, provided a snippet.
 *
 * An error will be thrown if the request fails.
 * @throws
 * @param snippet The snippet to write to the database.
 * @returns The freshly created snippet, with its ID set.
 */
export const createSnippet = async (snippet: Partial<Snippet>) => {
  const { data: newSnippet } = await client.post<Snippet>("/snippets", snippet);
  return newSnippet;
};

/**
 * Fetch all the snippets in the database, optionally filtered by a query.
 *
 * If a query is provided, each snippet must contain `query` as a subtring in at least
 * one field. An error will be thrown if the request fails.
 * @throws
 * @param query The query to filter snippets.
 * @returns An array of Snippets.
 */
export const getSnippets = async (query: string = "") => {
  let queryValues = "?";

  if (query) {
    queryValues += `q=${query}`;
  }

  const { data: snippets } = await client.get<Snippet[]>(`/snippets${queryValues}`);
  return snippets;
};

/**
 * Fetch a single snippet from the database, provided a snippet ID.
 *
 * An error will be thrown if the request fails.
 * @throws
 * @param id The ID of the snippet to fetch.
 * @returns A snippet.
 */
export const getSnippet = async (id: string) => {
  const { data: snippet } = await client.get<Snippet>(`/snippets/${id}`);
  return snippet;
};

/**
 * Update a single snippet from the database, provided a snippet ID.
 *
 * An error will be thrown if the request fails.
 * @throws
 * @param id The ID of the snippet to update.
 * @param updates The updates to apply to the snippet.
 * @returns The freshly updated snippet.
 */
export const updateSnippet = async (id: string, updates: Partial<Snippet>) => {
  const { data: updatedSnippet } = await client.put<Snippet>(`/snippets/${id}`, updates);
  return updatedSnippet;
};

/**
 * Delete a snippet from the database, provided a snippet ID.
 *
 * An error will be thrown if the request fails.
 * @throws
 * @param id The ID of the snippet to delete.
 */
export const deleteSnippet = async (id: string) => {
  await client.delete<void>(`/snippets/${id}`);
};
