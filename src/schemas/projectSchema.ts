import * as v from 'valibot';
import { _ } from 'compiled-i18n';
import { CommunityType } from '~/constants/communityType';

// Constants for length limits
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 5000;

// Define appropriate Enum objects
const RESOURCE_TYPE_ENUM = {
    LABOR: 'LABOR',
    MATERIAL: 'MATERIAL',
    ECONOMIC: 'ECONOMIC'
} as const;

const STEP_STATUS_ENUM = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED'
} as const;

const PROJECT_STATUS_ENUM = {
    DRAFT: 'DRAFT',
    OPEN: 'OPEN',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
} as const;

const COMMUNITY_TYPE_ENUM = {
    GLOBAL: CommunityType.GLOBAL,
    INTERNATIONAL: CommunityType.INTERNATIONAL,
    NATIONAL: CommunityType.NATIONAL,
    REGIONAL: CommunityType.REGIONAL,
    SUBREGIONAL: CommunityType.SUBREGIONAL,
    LOCAL: CommunityType.LOCAL
} as const;

// Definition of the resource schema
export const ResourceSchema = v.object({
    type: v.enum(RESOURCE_TYPE_ENUM),
    description: v.pipe(
        v.string(),
        v.minLength(1, _`Description is required`)
    ),
    quantity: v.optional(v.string()),
    unit: v.optional(v.string())
});

// Definition of the step schema
export const StepSchema = v.object({
    title: v.pipe(
        v.string(),
        v.minLength(1, _`Title is required`)
    ),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
    status: v.enum(STEP_STATUS_ENUM),
    resources: v.array(ResourceSchema)
});

// Definition of the main project schema
export const ProjectSchema = v.object({
    // TODO: replace scope string with enum
    scope: v.string(),
    // scope: v.enum(COMMUNITY_TYPE_ENUM),
    community_ids: v.pipe(
        v.array(v.string()),
        v.minLength(1, _`At least one community must be selected`)
    ),
    title: v.pipe(
        v.string(),
        v.minLength(5, _`Title must have at least 5 characters`),
        v.maxLength(MAX_TITLE_LENGTH, _`Title must have ${MAX_TITLE_LENGTH} characters or less`)
    ),
    description: v.optional(
        v.pipe(
            v.string(),
            v.maxLength(MAX_DESCRIPTION_LENGTH, _`Description must have ${MAX_DESCRIPTION_LENGTH} characters or less`)
        )
    ),
    status: v.enum(PROJECT_STATUS_ENUM),
    goal_amount: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    is_anonymous: v.boolean(),
    steps: v.pipe(
        v.array(StepSchema),
        v.minLength(1, _`At least one step is required`)
    )
});

// Inferred type from the schema
export type ProjectForm = v.InferInput<typeof ProjectSchema>;

export interface ProjectResponseData {
    success: boolean;
    message: string;
    data?: {
        project_id: string;
        share_link: string;
    };
}