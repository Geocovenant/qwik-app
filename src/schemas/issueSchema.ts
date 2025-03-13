import { _ } from 'compiled-i18n';
import { array, boolean, enum_, minLength, maxLength, object, optional, pipe, string } from 'valibot';
import { CommunityType } from '~/constants/communityType';

export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MAX_ORGANIZATION_NAME_LENGTH = 100;

// Crear un objeto Enum adecuado para el tipo de status
const STATUS_ENUM = {
    OPEN: 'OPEN',
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED',
    CLOSED: 'CLOSED'
} as const;

// Crear un objeto Enum adecuado para el tipo de comunidad
const COMMUNITY_TYPE_ENUM = {
    GLOBAL: CommunityType.GLOBAL,
    INTERNATIONAL: CommunityType.INTERNATIONAL,
    NATIONAL: CommunityType.NATIONAL,
    REGIONAL: CommunityType.REGIONAL,
    SUBREGIONAL: CommunityType.SUBREGIONAL
} as const;

export const IssueSchema = object({
    title: pipe(
        string(),
        minLength(5, _`Title must have at least 5 characters`),
        maxLength(MAX_TITLE_LENGTH, _`Title must have ${MAX_TITLE_LENGTH} characters or less`)
    ),
    description: pipe(
        string(),
        minLength(10, _`Description must have at least 10 characters`),
        maxLength(MAX_DESCRIPTION_LENGTH, _`Description must have ${MAX_DESCRIPTION_LENGTH} characters or less`)
    ),
    organization_name: optional(pipe(
        string(),
        maxLength(MAX_ORGANIZATION_NAME_LENGTH, _`Organization name must have ${MAX_ORGANIZATION_NAME_LENGTH} characters or less`)
    )),
    status: enum_(STATUS_ENUM),
    scope: enum_(COMMUNITY_TYPE_ENUM),
    community_ids: pipe(
        array(string()),
        minLength(1, _`At least one community must be selected`)
    ),
    is_anonymous: boolean(),
    tags: optional(array(string()))
});

export type IssueForm = {
    title: string;
    description: string;
    organization_name?: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    scope: CommunityType;
    community_ids: string[];
    is_anonymous: boolean;
    tags?: string[];
}; 

export interface IssueResponseData {
    success: boolean;
    message: string;
    data?: {
        issue_id: string;
        share_link: string;
    };
}