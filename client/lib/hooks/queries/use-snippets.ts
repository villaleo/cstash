import { getSnippet, getSnippets, updateSnippet } from "@/lib/api/snippets";
import { Snippet } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UseSnippetsProps {
  query?: string;
  tags?: string[];
  group?: GroupKey;
  order?: OrderKey;
}

export type GroupKey = "Title" | "Language" | "Favorite" | "Last Modified" | "Created On";
export type OrderKey = "Ascending Order" | "Descending Order";

export const useSnippets = ({ query, tags = [], group = "Last Modified", order = "Descending Order" }: UseSnippetsProps) =>
  useQuery({
    queryKey: ["snippets", query, tags, group, order],
    queryFn: () => getSnippets(tags, query),
    select: (snippets) => sortSnippets(snippets, snippetKeys[group], order),
  });

export const useSnippet = (id: string) =>
  useQuery({
    queryKey: ["snippets", id],
    queryFn: () => getSnippet(id),
  });

export const useUpdateSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation<Snippet, Error, { id: string; updates: Partial<Snippet> }>({
    mutationFn: ({ id, updates }) => updateSnippet(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["snippets"] }),
  });
};

const snippetKeys: Record<GroupKey, keyof Snippet> = {
  Title: "title",
  Language: "language",
  Favorite: "isFavorite",
  "Last Modified": "updatedAt",
  "Created On": "createdAt",
};

const sortSnippets = (snippets: Snippet[], groupBy: keyof Snippet, order: OrderKey) => {
  return [...snippets].sort((a, b) => {
    let comparison = 0;

    if (typeof a[groupBy] === "string" && typeof b[groupBy] === "string") {
      comparison = (a[groupBy] as string).localeCompare(b[groupBy] as string);
    } else if (a[groupBy] instanceof Date && b[groupBy] instanceof Date) {
      comparison = (a[groupBy] as Date).getTime() - (b[groupBy] as Date).getTime();
    } else if (typeof a[groupBy] === "boolean" && typeof b[groupBy] === "boolean") {
      comparison = a[groupBy] === b[groupBy] ? 0 : a[groupBy] ? 1 : -1;
    } else if (typeof a[groupBy] === "number" && typeof b[groupBy] === "number") {
      comparison = (a[groupBy] as number) - (b[groupBy] as number);
    } else {
      comparison = String(a[groupBy]).localeCompare(String(b[groupBy]));
    }

    return order === "Ascending Order" ? comparison : -comparison;
  });
};
