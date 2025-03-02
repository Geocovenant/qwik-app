import { _ } from 'compiled-i18n';
import { array, boolean, enum_, minLength, maxLength, object, optional, string } from 'valibot';
import { CommunityType } from '~/constants/communityType';

export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 2000;

export const IssueSchema = object({
    title: string([
        minLength(5, _`Title must have at least 5 characters`),
        maxLength(MAX_TITLE_LENGTH, _`Title must have ${MAX_TITLE_LENGTH} characters or less`)
    ]),
    description: string([
        minLength(10, _`Description must have at least 10 characters`),
        maxLength(MAX_DESCRIPTION_LENGTH, _`Description must have ${MAX_DESCRIPTION_LENGTH} characters or less`)
    ]),
    status: enum_(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
    scope: enum_([
        CommunityType.GLOBAL,
        CommunityType.INTERNATIONAL,
        CommunityType.NATIONAL,
        CommunityType.REGIONAL,
        CommunityType.SUBREGIONAL
    ]),
    community_ids: array(string(), [
        minLength(1, _`At least one community must be selected`)
    ]),
    is_anonymous: boolean(),
    tags: optional(array(string()))
});

export type IssueForm = {
    title: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    scope: CommunityType;
    community_ids: string[];
    is_anonymous: boolean;
    tags?: string[];
}; 