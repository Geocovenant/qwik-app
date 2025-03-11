export enum PollScope {
    GLOBAL = 'GLOBAL',
    INTERNATIONAL = 'INTERNATIONAL',
    NATIONAL = 'NATIONAL',
    REGIONAL = 'REGIONAL',
    SUBREGIONAL = 'SUBREGIONAL',
    LOCAL = 'LOCAL',
}

export interface Poll {
    comments_count: number;
    countries?: string[];
    created_at: string;
    creator?: {
        username: string;
        name: string;
        image: string;
    };
    description: string;
    ends_at?: string | null;
    id: number;
    is_anonymous: boolean;
    options: { text: string; votes: number; id: number; voted: boolean }[];
    reactions: {
        LIKE: number;
        DISLIKE: number;
    };
    regions?: string[];
    scope: PollScope;
    slug: string;
    status: string;
    tags: string[];
    title: string;
    type: string;
    user_voted_options?: number[];
    user_reaction?: 'LIKE' | 'DISLIKE' | null;
    votes_count: number;
}

export interface PollResponse {
    items: Poll[];
    total: number;
    page: number;
    size: number;
    pages: number;
} 