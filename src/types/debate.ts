import type { Community } from "./project";

export enum DebateType {
    GLOBAL = 'GLOBAL',
    INTERNATIONAL = 'INTERNATIONAL',
    NATIONAL = 'NATIONAL',
    REGIONAL = 'REGIONAL',
    SUBREGIONAL = 'SUBREGIONAL',
    LOCAL = 'LOCAL',
}

export interface Division {
    id: number;
    name: string;
    type: string;
    community_id: number;
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
    communities: Community[];
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
    slug: string;
    tags?: string[];
    type: DebateType;
    divisions?: Division[];
    title: string;
    views_count: number;
}

export interface DebateResponse {
    items: Debate[];
    total: number;
    page: number;
    size: number;
    pages: number;
} 