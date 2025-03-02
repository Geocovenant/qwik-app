import { _ } from 'compiled-i18n';
import { array, boolean, enum_, minLength, maxLength, object, optional, string } from 'valibot';
import { CommunityType } from '~/constants/communityType';

// Definición del esquema de recursos
export const ResourceSchema = object({
    type: enum_(['LABOR', 'MATERIAL', 'ECONOMIC']),
    description: string([
        minLength(1, _`Description is required`)
    ]),
    quantity: optional(string()),
    unit: optional(string())
});

// Definición del esquema de pasos
export const StepSchema = object({
    title: string([
        minLength(1, _`Title is required`)
    ]),
    description: optional(string()),
    order: optional(string()),
    status: enum_(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
    resources: array(ResourceSchema, [])
});

// Definición del esquema principal del proyecto
export const ProjectSchema = object({
    title: string([
        minLength(1, _`Title is required`),
        maxLength(100, _`Title must be less than 100 characters`)
    ]),
    description: optional(
        string([
            maxLength(5000, _`Description must be less than 5000 characters`)
        ])
    ),
    goal_amount: optional(string()),
    status: enum_(['DRAFT', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
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
    tags: optional(array(string())),
    steps: array(StepSchema, [
        minLength(1, _`At least one step is required`)
    ])
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