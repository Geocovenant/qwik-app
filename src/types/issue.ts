export enum IssueScope {
    GLOBAL = 'GLOBAL',
    INTERNATIONAL = 'INTERNATIONAL',
    NATIONAL = 'NATIONAL',
    REGIONAL = 'REGIONAL',
    SUBREGIONAL = 'SUBREGIONAL',
    LOCAL = 'LOCAL',
}

export enum IssueStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CLOSED = 'CLOSED',
}

export interface Resource {
    id: number;
    type: string;
    description: string;
    quantity: number;
    unit: string;
}

export interface IssueStep {
    id: number;
    title: string;
    description: string;
    order: number;
    status: string;
    resources: Resource[];
}

export interface Community {
    id: number;
    name: string;
    cca2: string | null;
}

export interface Issue {
    comments_count: number;
    commitments: any[];
    communities: Community[];
    created_at: string;
    creator?: {
        username: string;
        name: string;
        image: string;
    };
    current_amount: number;
    description: string;
    detail?: string;
    donations: any[];
    goal_amount: number;
    id: number;
    images: string[];
    is_anonymous: boolean;
    last_comment_at?: string;
    location: string;
    scope: IssueScope;
    slug: string;
    steps: IssueStep[];
    status: IssueStatus;
    tags?: string[];
    title: string;
    updated_at: string;
    views_count: number;
}

export interface IssueResponse {
    items: Issue[];
    total: number;
    page: number;
    size: number;
    pages: number;
} 