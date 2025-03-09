export enum PollScope {
    GLOBAL = 'GLOBAL',
    INTERNATIONAL = 'INTERNATIONAL',
    NATIONAL = 'NATIONAL',
    REGIONAL = 'REGIONAL',
    SUBREGIONAL = 'SUBREGIONAL',
    LOCAL = 'LOCAL',
}

export interface Poll {
    id: number;
    title: string;
    description: string;
    options: { text: string; votes: number; id: number; voted: boolean }[];
    status: string;
    scope: PollScope;
    type: string;
    slug: string;
    is_anonymous: boolean;
    ends_at?: string | null;
    created_at: string;
    creator?: {
        username: string;
        name: string;
        image: string;
    };
    comments_count: number;
    reactions: {
        LIKE: number;
        DISLIKE: number;
    };
    countries?: string[];
    user_voted_options?: number[];
    user_reaction?: 'LIKE' | 'DISLIKE' | null;
    regions?: string[];
    tags: string[];
}

export interface PollResponse {
    items: Poll[];
    total: number;
    page: number;
    size: number;
    pages: number;
} 