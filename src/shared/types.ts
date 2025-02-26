export enum PollScope {
    GLOBAL = 'GLOBAL',
    INTERNATIONAL = 'INTERNATIONAL',
    NATIONAL = 'NATIONAL',
    REGIONAL = 'REGIONAL',
    // ... otros scopes según necesites
}

export type Poll = {
    id: number;
    title: string;
    description: string;
    scope: PollScope;
    options: { text: string, votes: number, id: number, voted: boolean }[];
    status: string;
    type: string;
    is_anonymous: boolean;
    ends_at: string;
    created_at: string;
    creator_username: string;
    reactions: { LIKE: number, DISLIKE: number };
    comments_count: number;
    countries: string[];
    provinces?: string[];
};

export interface Comment {
    id: number;
    content: string;
    author_username: string;
    created_at: string;
    poll_id: number;
}
