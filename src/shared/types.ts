import type { Session } from "@auth/qwik";

export interface CustomUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    // Propiedades adicionales
    emailVerified?: string | null;
    username?: string | null;
    is_active?: boolean | null;
    role?: string | null;
    bio?: string | null;
    country?: string | null;
    website?: string | null;
    cover?: string | null;
    gender?: string | null;
    last_login?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface CustomSession extends Session {
    user?: CustomUser;
}

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
    slug: string;
    is_anonymous: boolean;
    ends_at?: string | null;
    created_at: string;
    creator: {
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
    detail?: string;
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
    created_by: User;
    community: {
        id: number;
        name: string;
        cca2: string | null;
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

// Add these types to your shared/types.ts file

export enum ProjectStatus {
    DRAFT = "DRAFT",
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum ResourceType {
    LABOR = "LABOR",
    MATERIAL = "MATERIAL",
    ECONOMIC = "ECONOMIC",
}

export enum CommitmentType {
    TIME = "TIME",
    MATERIAL = "MATERIAL",
    ECONOMIC = "ECONOMIC",
}

export interface ProjectResourceRead {
    id: number
    type: ResourceType
    description: string
    quantity?: number
    unit?: string
}

export interface ProjectStepRead {
    id: number
    title: string
    description?: string
    order: number
    status: string
    resources: ProjectResourceRead[]
}

export interface UserMinimal {
    id: number
    username: string
    image?: string
}

export interface CommunityMinimal {
    id: number
    name: string
    cca2?: string
}

export interface ProjectCommitmentRead {
    id: number
    user: UserMinimal
    type: CommitmentType
    description: string
    quantity?: number
    unit?: string
    fulfilled: boolean
}

export interface ProjectDonationRead {
    id: number
    user: UserMinimal
    amount: number
    donated_at: string
}

export interface ProjectRead {
    id: number
    title: string
    description?: string
    status: ProjectStatus
    goal_amount?: number
    current_amount: number
    scope: string
    slug: string
    created_at: string
    updated_at: string
    creator: UserMinimal
    steps: ProjectStepRead[]
    commitments: ProjectCommitmentRead[]
    donations: ProjectDonationRead[]
    communities: CommunityMinimal[]
}

export enum IssueStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}

export interface IssueRead {
    id: number;
    title: string;
    description: string;
    status: IssueStatus;
    scope: string;
    slug: string;
    created_at: string;
    updated_at: string;
    views_count: number;
    creator: UserMinimal;
    communities: CommunityMinimal[];
}

export interface User {
    id: number;
    username?: string;
    name?: string;
    image: string;
    country?: string;
}


