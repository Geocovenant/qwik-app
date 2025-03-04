import { _ } from 'compiled-i18n';
import { array, boolean, enum_, minLength, maxLength, object, optional, pipe, string } from 'valibot';
import { CommunityType } from '~/constants/communityType';

// Definir objetos Enum adecuados
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
    SUBREGIONAL: CommunityType.SUBREGIONAL
} as const;

// Definición del esquema de recursos
export const ResourceSchema = object({
    type: enum_(RESOURCE_TYPE_ENUM),
    description: pipe(
        string(),
        minLength(1, _`Description is required`)
    ),
    quantity: optional(string()),
    unit: optional(string())
});

// Definición del esquema de pasos
export const StepSchema = object({
    title: pipe(
        string(),
        minLength(1, _`Title is required`)
    ),
    description: optional(string()),
    order: optional(string()),
    status: enum_(STEP_STATUS_ENUM),
    resources: array(ResourceSchema)
});

// Definición del esquema principal del proyecto
export const ProjectSchema = object({
    title: pipe(
        string(),
        minLength(1, _`Title is required`),
        maxLength(100, _`Title must be less than 100 characters`)
    ),
    description: optional(
        pipe(
            string(),
            maxLength(5000, _`Description must be less than 5000 characters`)
        )
    ),
    goal_amount: optional(string()),
    status: enum_(PROJECT_STATUS_ENUM),
    scope: enum_(COMMUNITY_TYPE_ENUM),
    community_ids: pipe(
        array(string()),
        minLength(1, _`At least one community must be selected`)
    ),
    is_anonymous: boolean(),
    tags: optional(array(string())),
    steps: pipe(
        array(StepSchema),
        minLength(1, _`At least one step is required`)
    )
});

// Definición del tipo basado en el esquema
export type ProjectForm = {
    title: string;
    description?: string;
    goal_amount?: string;
    status: 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    scope: CommunityType;
    community_ids: string[];
    is_anonymous: boolean;
    tags?: string[];
    steps: {
        title: string;
        description?: string;
        order?: string;
        status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
        resources: {
            type: 'LABOR' | 'MATERIAL' | 'ECONOMIC';
            description: string;
            quantity?: string;
            unit?: string;
        }[];
    }[];
}; 