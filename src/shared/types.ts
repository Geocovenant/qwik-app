export enum PollScope {
    GLOBAL = 'GLOBAL',
    INTERNATIONAL = 'INTERNATIONAL',
    NATIONAL = 'NATIONAL',
    REGIONAL = 'REGIONAL',
    // ... otros scopes según necesites
}

export interface Poll {
    id: number;
    title: string;
    description: string;
    options: { text: string; votes: number; id: number; voted: boolean }[];
    status: string;
    scope: PollScope;
    type: string;
    is_anonymous: boolean;
    ends_at?: string | null;
    created_at: string;
    creator_username: string;
    comments_count: number;
    reactions: {
        LIKE: number;
        DISLIKE: number;
    };
    countries?: string[];
    user_voted_options?: number[];
    user_reaction?: 'LIKE' | 'DISLIKE' | null;
    regions?: string[];
}

export interface Comment {
    id: number;
    content: string;
    author_username: string;
    created_at: string;
    poll_id: number;
}

export type Debate = {
    id: number;
    title: string;
    description: string;
    scope: PollScope;
    images: string[];
    creator: {
        username: string;
        name: string;
        image: string;
    };
    created_at: string;
    last_comment_at?: string;
    slug: string;
    tags?: string[];
    comments_count: number;
    points_of_view: PointOfView[];
    detail: string;
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

// Tipos específicos para debates
export interface DebateComment {
    id: number;
    user: {
        id: number;
        country: string;
        username: string;
        image: string;
    };
    content: string;
    upvotes: number;
    downvotes: number;
    created_at: string;
}

export interface CountryView {
    id: number;
    name: string;
    created_at: string;
    created_by: {
        id: number;
        username: string;
        image: string;
    };
    community: {
        id: number;
        name: string;
        cca2: string;
    };
    opinions: DebateComment[];
}

export interface DetailedDebate extends Debate {
    images: string[];
    detail?: string;
    views_count: number;
    likes_count: number;
    dislikes_count: number;
    status: 'OPEN' | 'CLOSED';
    type: 'GLOBAL' | 'INTERNATIONAL';
    creator: {
        username: string;
        name: string;
        image: string;
    };
}

// Mantener el tipo Comment existente para polls pero renombrarlo para claridad
export interface PollComment {
    id: number;
    content: string;
    author_username: string;
    created_at: string;
    poll_id: number;
}

// Renombrar el tipo Comment actual a PollComment
export type { Comment as PollComment } from './types';