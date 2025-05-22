import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { Snippet } from "../../types";
import { AxiosError } from "axios";
import { createSnippet, deleteSnippet, getSnippet, getSnippets, updateSnippet } from "../../api/snippets";

type SortByKey =
  // keys of Snippet, capitalized and excluding the keys "updatedAt", "isFavorite", "createdAt", "tags", "id", and "content".
  | Capitalize<keyof Omit<{ [K in keyof Snippet]: K }, "updatedAt" | "isFavorite" | "createdAt" | "tags" | "id" | "content">>
  // Include the following string variants with the previous variants
  | "Last Modified"
  | "Date Created"
  | "Favorites";
type OrderKey = "Ascending" | "Descending";

export const useCreateSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation<Snippet, AxiosError, Partial<Snippet>>(
    {
      mutationFn: (snippet) => createSnippet(snippet),
      onSuccess: (_createdSnippet) => queryClient.invalidateQueries({ queryKey: ["snippets"] }),
    },
    queryClient
  );
};

interface UseSnippetsProps {
  query?: string;
  filter?: SortByKey;
  order?: OrderKey;
}

export const useSnippets = ({ query = "", filter = "Last Modified", order = "Descending" }: UseSnippetsProps) =>
  useQuery<Snippet[], AxiosError>({
    queryKey: ["snippets", query],
    queryFn: () => getSnippets(query),
    select: (snippets) => sortSnippets(snippets, filter, order),
  });

export const useSnippet = (id: string) =>
  useQuery<Snippet, AxiosError>({
    queryKey: ["snippets", id],
    queryFn: () => getSnippet(id),
  });

export const useUpdateSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation<Snippet, AxiosError, { id: string; updates: Partial<Snippet> }>({
    mutationFn: ({ id, updates }) => updateSnippet(id, updates),
    onSuccess: (_updatedSnippet) => queryClient.invalidateQueries({ queryKey: ["snippets"] }),
  });
};

export const useDeleteSnippet = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteSnippet(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["snippets"] }),
  });
};

function sortSnippets(snippets: Snippet[], sortBy: SortByKey, order: OrderKey): Snippet[] {
  let key: keyof Snippet;

  switch (sortBy) {
    case "Title":
      key = "title";
      break;
    case "Description":
      key = "description";
      break;
    case "Language":
      key = "language";
      break;
    case "Last Modified":
      key = "updatedAt";
      break;
    case "Date Created":
      key = "createdAt";
      break;
    case "Favorites":
      key = "isFavorite";
      break;
  }

  return [...snippets].sort((a, b) => {
    let comparison = 0;

    if (typeof a[key] === "string" && typeof b[key] === "string") {
      comparison = (a[key] as string).localeCompare(b[key] as string);
    } else if (a[key] instanceof Date && b[key] instanceof Date) {
      comparison = (a[key] as Date).getTime() - (b[key] as Date).getTime();
    } else if (typeof a[key] === "boolean" && typeof b[key] === "boolean") {
      comparison = a[key] === b[key] ? 0 : a[key] ? 1 : -1;
    }

    return order === "Ascending" ? comparison : -comparison;
  });
}
