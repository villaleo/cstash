export interface Snippet {
    id: string;
    title: string;
    description: string;
    content: string;
    language: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    isFavorite: boolean;
}
