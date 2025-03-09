export enum DebateScope {
    GLOBAL = 'GLOBAL',
    INTERNATIONAL = 'INTERNATIONAL',
    NATIONAL = 'NATIONAL',
    REGIONAL = 'REGIONAL',
    SUBREGIONAL = 'SUBREGIONAL',
    LOCAL = 'LOCAL',
}

export type PointOfView = {
    country: string;
    comments: {
        id: number;
        user: string;
        text: string;
        likes: number;
        dislikes: number;
    }[];
}

export interface Debate {
    comments_count: number;
    created_at: string;
    creator?: {
        username: string;
        name: string;
        image: string;
    };
    description: string;
    detail?: string;
    id: number;
    images: string[];
    is_anonymous: boolean;
    last_comment_at?: string;
    points_of_view: PointOfView[];
    scope: DebateScope;
    slug: string;
    tags?: string[];
    title: string;
}

export interface DebateResponse {
    items: Debate[];
    total: number;
    page: number;
    size: number;
    pages: number;
} 