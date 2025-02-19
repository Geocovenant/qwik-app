export enum PollScope {
    GLOBAL = 'GLOBAL',
    INTERNATIONAL = 'INTERNATIONAL',
    ARGENTINA = 'ARGENTINA',
    // ... otros scopes según necesites
}

export type Poll = {
    id: number;
    title: string;
    description: string;
    scope: PollScope;
    options: { text: string, votes: number, id: number }[];
    status: string;
    type: string;
    is_anonymous: boolean;
    ends_at: string;
    created_at: string;
};
