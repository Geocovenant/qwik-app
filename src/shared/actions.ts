import { formAction$, valiForm$ } from '@modular-forms/qwik';
import type { PollForm } from '~/schemas/pollSchema';
import { PollSchema } from '~/schemas/pollSchema';
import { _ } from 'compiled-i18n';
import { routeAction$, z, zod$ } from '@builder.io/qwik-city';
import { CommunityType } from '~/constants/communityType';
import type { DebateForm } from '~/schemas/debateSchema';
import { DebateSchema } from '~/schemas/debateSchema';
import type { UserForm } from '~/schemas/userSchema';
import { UserSchema } from '~/schemas/userSchema';
import type { OpinionForm } from "~/schemas/opinionSchema";
import { OpinionSchema } from "~/schemas/opinionSchema";
import type { ProjectForm } from '~/schemas/projectSchema';
import { ProjectSchema } from '~/schemas/projectSchema';
import type { IssueForm } from '~/schemas/issueSchema';
import { IssueSchema } from '~/schemas/issueSchema';
import type { CommentForm } from '~/schemas/commentSchema';
import { CommentSchema } from '~/schemas/commentSchema';

export interface PollResponseData {
    success: boolean; // Indica si la operación fue exitosa
    message: string; // Mensaje de respuesta (ej. "Poll shared successfully")
    data?: {
        poll_id: string; // ID de la encuesta compartida
        share_link: string; // Link generado para compartir
        timestamp?: string; // Opcional: Hora/fecha en que se compartió
    };
}

export const useFormPollAction = formAction$<PollForm, PollResponseData>(
    async (values, event) => {
        console.log('############ useFormPollAction ############');
        console.log('values', values);

        const token = event.cookie.get('authjs.session-token')?.value;

        // Preparar payload según el scope
        const payload = {
            title: values.title,
            description: values.description,
            type: values.type,
            options: values.options.map(o => ({ text: o })),
            is_anonymous: values.is_anonymous,
            scope: values.scope,
            ends_at: values.ends_at !== '' ? values.ends_at : null,
        };

        // Añadir los campos específicos según el scope
        switch (values.scope) {
            case CommunityType.GLOBAL:
                Object.assign(payload, { community_ids: [1] });
                break;
            case CommunityType.INTERNATIONAL:
                Object.assign(payload, { country_codes: values.community_ids });
                break;
            case CommunityType.NATIONAL:
                Object.assign(payload, { country_code: values.community_ids[0] });
                break;
            case CommunityType.REGIONAL:
                Object.assign(payload, { region_id: values.community_ids[0] });
                break;
            case CommunityType.SUBREGIONAL:
                Object.assign(payload, { subregion_id: values.community_ids[0] });
                break;
        }

        console.log('payload', payload);

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            // Verificar si la respuesta es correcta, de lo contrario lanzar un error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create poll');
            }

            const data = await response.json();

            return {
                success: true,
                message: _`Poll created successfully`,
                data: data,
            };
        } catch (error: any) {
            console.error('Error in useFormPollAction:', error);
            return {
                success: false,
                message: error.message || 'An unexpected error occurred',
            };
        }
    },
    valiForm$(PollSchema)
);

// eslint-disable-next-line qwik/loader-location
export const useVotePoll = routeAction$(
    async (data, { cookie }) => {
        console.log('### useVotePoll ###')
        const token = cookie.get('authjs.session-token')?.value;
        console.log('token', token)
        const { pollId } = data
        console.log('data: ', data)
        const payload = { option_ids: data.optionIds }
        console.log('payload', payload)
        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls/${pollId}/vote`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            return (await response.json());
        } catch (err) {
            console.error('err', err)
            return err
        }
    }
)

// eslint-disable-next-line qwik/loader-location
export const useReactPoll = routeAction$(
    async (data, { cookie }) => {
        console.log('### useReactPoll ###')
        console.log('data', data)
        const token = cookie.get('authjs.session-token')?.value;
        const payload = { reaction: data.reaction }
        console.log('payload', payload)
        
        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls/${data.pollId}/react`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            return (await response.json());
        } catch (err) {
            console.error('err', err)
            return err
        }
    }
)

export interface DebateResponseData {
    success: boolean;
    message: string;
    data?: {
        debate_id: string;
        share_link: string;
    };
}

export const useFormDebateAction = formAction$<DebateForm, DebateResponseData>(
    async (values, event) => {
        console.log('############ useFormDebateAction ############');
        console.log('values', values);

        const token = event.cookie.get('authjs.session-token')?.value;

        // Preparar payload según el scope
        const payload = {
            title: values.title,
            description: values.description,
            tags: values.tags,
            is_anonymous: values.is_anonymous,
            type: values.scope,
        };

        // Añadir los campos específicos según el scope
        switch (values.scope) {
            case CommunityType.GLOBAL:
                Object.assign(payload, { community_ids: [1] });
                break;
            case CommunityType.INTERNATIONAL:
                Object.assign(payload, { country_codes: values.community_ids });
                break;
            case CommunityType.NATIONAL:
                Object.assign(payload, { country_code: values.community_ids[0] });
                break;
            case CommunityType.REGIONAL:
                Object.assign(payload, { region_id: values.community_ids[0] });
                break;
            case CommunityType.SUBREGIONAL:
                Object.assign(payload, { subregion_id: values.community_ids[0] });
                break;
        }

        console.log('payload', payload);

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create debate');
            }

            const data = await response.json();

            return {
                success: true,
                message: _`Debate created successfully`,
                data: data,
            };
        } catch (error: any) {
            console.error('Error in useFormDebateAction:', error);
            return {
                success: false,
                message: error.message || 'An unexpected error occurred',
            };
        }
    },
    valiForm$(DebateSchema)
);

// eslint-disable-next-line qwik/loader-location
export const useSetUsername = routeAction$(
    async (data, { cookie }) => {
        console.log('### useSetUsername ###')
        console.log('data', data)
        const token = cookie.get('authjs.session-token')?.value;
        const payload = { base_name: data.username }
        console.log('payload', payload)
        
        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/generate-username`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            return (await response.json());
        } catch (err) {
            console.error('err', err)
            return err
        }
    },
    zod$({
        username: z.string().min(3).max(15).regex(/^[a-zA-Z0-9_]+$/, {
            message: _`Username must contain only letters, numbers, and underscores`,
        }),
    })
)

export interface UserResponseData {
    success: boolean;
    message: string;
    data?: {
        user_id: string;
    };
}

export const useFormUserAction = formAction$<UserForm, UserResponseData>(
    async (values, event) => {
        console.log('############ useFormUserAction ############');
        console.log('values', values);

        const token = event.cookie.get('authjs.session-token')?.value;

        const payload = {
            name: values.name,
            username: values.username,
            email: values.email,
            bio: values.bio || "",
            location: values.location || "",
            website: values.website || "",
            gender: values.gender || "",
            image: values.profileImage || "",
            banner: values.coverImage || ""
        };

        console.log('payload', payload);

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user profile');
            }

            const data = await response.json();

            return {
                success: true,
                message: _`Profile updated successfully`,
                data: data,
            };
        } catch (error: any) {
            console.error('Error in useFormUserAction:', error);
            return {
                success: false,
                message: error.message || 'An unexpected error occurred',
            };
        }
    },
    valiForm$(UserSchema)
);

export interface OpinionResponseData {
    success: boolean;
    message: string;
    data?: {
        comment_id: string;
    };
}

export const useFormOpinionAction = formAction$<OpinionForm, OpinionResponseData>(
    async (values, event) => {
        console.log('############ useFormOpinionAction ############');
        const token = event.cookie.get('authjs.session-token')?.value;

        console.log('values', values)

        const payload = {
            content: values.opinion,
            country_cca2: values.country,
            region_id: values.region_id ? parseInt(values.region_id) : null,
        }

        console.log('payload', payload)

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates/${values.debate_id}/opinions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el comentario');
            }

            const data = await response.json();

            return {
                success: true,
                message: _`Opinión compartida exitosamente`,
                data: data,
            };
        } catch (error: any) {
            console.error('Error in useFormOpinionAction:', error);
            return {
                success: false,
                message: error.message || 'Ocurrió un error inesperado',
            };
        }
    },
    valiForm$(OpinionSchema)
);

export interface ProjectResponseData {
    success: boolean;
    message: string;
    data?: {
        project_id: string;
        share_link: string;
    };
}

export const useFormProjectAction = formAction$<ProjectForm, ProjectResponseData>(
    async (values, event) => {
        console.log('############ useFormProjectAction ############');
        console.log('values', values);

        const token = event.cookie.get('authjs.session-token')?.value;

        // Preparar payload según el scope
        const payload = {
            title: values.title,
            description: values.description,
            goal_amount: values.goal_amount,
            status: values.status,
            is_anonymous: values.is_anonymous,
            scope: values.scope,
            tags: values.tags || [],
            steps: values.steps.map(step => ({
                title: step.title,
                description: step.description || "",
                order: step.order || "0",
                status: step.status,
                resources: step.resources.map(resource => ({
                    type: resource.type,
                    description: resource.description,
                    quantity: resource.quantity || "",
                    unit: resource.unit || ""
                }))
            }))
        };

        // Añadir los campos específicos según el scope
        switch (values.scope) {
            case CommunityType.GLOBAL:
                Object.assign(payload, { community_ids: [1] });
                break;
            case CommunityType.INTERNATIONAL:
                Object.assign(payload, { country_codes: values.community_ids });
                break;
            case CommunityType.NATIONAL:
                Object.assign(payload, { country_code: values.community_ids[0] });
                break;
            case CommunityType.REGIONAL:
                Object.assign(payload, { region_id: values.community_ids[0] });
                break;
            case CommunityType.SUBREGIONAL:
                Object.assign(payload, { subregion_id: values.community_ids[0] });
                break;
        }

        console.log('payload', payload);

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create project');
            }

            const data = await response.json();

            return {
                success: true,
                message: _`Project created successfully`,
                data: data,
            };
        } catch (error: any) {
            console.error('Error in useFormProjectAction:', error);
            return {
                success: false,
                message: error.message || 'An unexpected error occurred',
            };
        }
    },
    valiForm$(ProjectSchema)
);

export interface IssueResponseData {
    success: boolean;
    message: string;
    data?: {
        issue_id: string;
        share_link: string;
    };
}

export const useFormIssueAction = formAction$<IssueForm, IssueResponseData>(
    async (values, event) => {
        console.log('############ useFormIssueAction ############');
        console.log('values', values);

        const token = event.cookie.get('authjs.session-token')?.value;

        // Preparar payload según el scope
        const payload = {
            title: values.title,
            description: values.description,
            status: values.status,
            is_anonymous: values.is_anonymous,
            scope: values.scope,
            tags: values.tags || [],
        };

        // Añadir los campos específicos según el scope
        switch (values.scope) {
            case CommunityType.GLOBAL:
                Object.assign(payload, { community_ids: [1] });
                break;
            case CommunityType.INTERNATIONAL:
                Object.assign(payload, { country_codes: values.community_ids });
                break;
            case CommunityType.NATIONAL:
                Object.assign(payload, { country_code: values.community_ids[0] });
                break;
            case CommunityType.REGIONAL:
                Object.assign(payload, { region_id: values.community_ids[0] });
                break;
            case CommunityType.SUBREGIONAL:
                Object.assign(payload, { subregion_id: values.community_ids[0] });
                break;
        }

        console.log('payload', payload);

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/issues`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create issue');
            }

            const data = await response.json();

            return {
                success: true,
                message: _`Issue reported successfully`,
                data: data,
            };
        } catch (error: any) {
            console.error('Error in useFormIssueAction:', error);
            return {
                success: false,
                message: error.message || 'An unexpected error occurred',
            };
        }
    },
    valiForm$(IssueSchema)
);

export interface CommentResponseData {
    success: boolean;
    message: string;
    data?: {
        comment_id: string;
    };
}

export const useFormCommentAction = formAction$<CommentForm, CommentResponseData>(
    async (values, event) => {
        console.log('############ useFormCommentAction ############');
        console.log('values', values);

        const token = event.cookie.get('authjs.session-token')?.value;

        const payload = {
            content: values.text,
        };

        console.log('payload', payload);

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls/${values.pollId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el comentario');
            }

            const data = await response.json();

            return {
                success: true,
                message: _`Comentario añadido exitosamente`,
                data: data,
            };
        } catch (error: any) {
            console.error('Error in useFormCommentAction:', error);
            return {
                success: false,
                message: error.message || 'Ocurrió un error inesperado',
            };
        }
    },
    valiForm$(CommentSchema)
);

// eslint-disable-next-line qwik/loader-location
export const useCheckUserOpinionInDebate = routeAction$(
    async (data, { cookie }) => {
        console.log('### useCheckUserOpinionInDebate ###')
        console.log('data', data)
        const token = cookie.get('authjs.session-token')?.value;
        
        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates/${data.debateId}/user-has-opinion`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                return {
                    success: false,
                    hasOpinion: false,
                    message: errorData.message || 'Error al verificar opinión'
                };
            }
            
            const data = await response.json();
            
            return {
                success: true,
                hasOpinion: data.hasOpinion || false,
                message: data.hasOpinion ? 'Ya has opinado en este debate' : ''
            };
        } catch (err) {
            console.error('err', err)
            return {
                success: false,
                hasOpinion: false,
                message: 'Error al verificar opinión'
            }
        }
    }
)

// Acción para actualizar la visibilidad del usuario en una comunidad específica
// eslint-disable-next-line qwik/loader-location
export const useUpdateCommunityVisibility = routeAction$(async (data: { communityId: number, isPublic: boolean }, { cookie }) => {
    console.log('### useUpdateCommunityVisibility ###');
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return { success: false, error: "No authentication token found" };
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/me/community/${data.communityId}/visibility`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Authorization": token.value,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ is_public: data.isPublic }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error updating visibility');
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating visibility:", error);
        return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
    }
});

// Acción para unirse a una comunidad
// eslint-disable-next-line qwik/loader-location
export const useJoinCommunity = routeAction$(async (data: { communityId: number }, { cookie }) => {
    console.log('### useJoinCommunity ###');
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return { success: false, error: "No authentication token found" };
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/${data.communityId}/join`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": token.value,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al unirse a la comunidad');
        }

        const result = await response.json();
        return { success: true, message: result.message };
    } catch (error) {
        console.error("Error joining community:", error);
        return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
    }
});

// Acción para abandonar una comunidad
// eslint-disable-next-line qwik/loader-location
export const useLeaveCommunity = routeAction$(async (data: { communityId: number }, { cookie }) => {
    console.log('### useLeaveCommunity ###');
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return { success: false, error: "No authentication token found" };
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/${data.communityId}/join`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Authorization": token.value,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al abandonar la comunidad');
        }

        const result = await response.json();
        return { success: true, message: result.message };
    } catch (error) {
        console.error("Error leaving community:", error);
        return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
    }
});
