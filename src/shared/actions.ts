import { formAction$, valiForm$ } from '@modular-forms/qwik';
import { routeAction$, z, zod$ } from '@builder.io/qwik-city';
import { CommunityType } from '~/constants/communityType';
import type { UserForm } from '~/schemas/userSchema';
import { UserSchema } from '~/schemas/userSchema';
import type { OpinionForm } from "~/schemas/opinionSchema";
import { OpinionSchema } from "~/schemas/opinionSchema";
import type { IssueForm } from '~/schemas/issueSchema';
import { IssueSchema } from '~/schemas/issueSchema';
import type { CommentForm } from '~/schemas/commentSchema';
import { CommentSchema } from '~/schemas/commentSchema';
import type { ReportForm } from "~/schemas/reportSchema";
import { ReportSchema } from "~/schemas/reportSchema";
import type { CommunityRequestForm } from "~/schemas/communityRequestSchema";
import { CommunityRequestSchema } from "~/schemas/communityRequestSchema";
import { _ } from 'compiled-i18n';

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

// eslint-disable-next-line qwik/loader-location
export const useReactOpinion = routeAction$(
    async (data, { cookie }) => {
        console.log('### useReactOpinion ###')
        console.log('data', data)
        const token = cookie.get('authjs.session-token')?.value;
        const payload = {
            opinion_id: data.opinionId,
            value: data.reaction === "LIKE" ? 1 : -1
        }
        console.log('payload', payload)
        
        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates/opinions/${data.opinionId}/vote`, {
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
            bio: values.bio || "",
            cover: values.coverImage || "",
            gender: values.gender === "female" ? "F" : values.gender === "male" ? "M" : values.gender === "non-binary" ? "X" : "",
            image: values.image || "",
            name: values.name,
            website: values.website || "",
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
        const { debateId } = data
        const token = cookie.get('authjs.session-token')?.value;
        
        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates/${debateId}/user-has-opinion`, {
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
            
            const responseData = await response.json();
            
            return {
                success: true,
                hasOpinion: responseData.hasOpinion || false,
                message: responseData.hasOpinion ? 'Ya has opinado en este debate' : ''
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
export const useUpdateCommunityVisibility = routeAction$(
    async (data, { cookie }) => {
        console.log('### useUpdateCommunityVisibility ###');
        const { communityId, isPublic } = data
        const token = cookie.get('authjs.session-token');
        if (!token) {
            return { success: false, error: "No authentication token found" };
        }

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/me/community/${communityId}/visibility`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Authorization": token.value,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ is_public: isPublic }),
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
    }
);

// Acción para unirse a una comunidad
// eslint-disable-next-line qwik/loader-location
export const useJoinCommunity = routeAction$(
    async (data, { cookie }) => {
        const { communityId } = data;
        console.log('### useJoinCommunity ###');
        console.log('communityId', communityId)
        const token = cookie.get('authjs.session-token');
        if (!token) {
            return { success: false, error: "No authentication token found" };
        }

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/${communityId}/join`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": token.value,
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
    }
);

// Acción para abandonar una comunidad
// eslint-disable-next-line qwik/loader-location
export const useLeaveCommunity = routeAction$(
    async (data, { cookie }) => {
        console.log('### useLeaveCommunity ###');
        const { communityId } = data;
        const token = cookie.get('authjs.session-token');
        if (!token) {
            return { success: false, error: "No authentication token found" };
        }

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/${communityId}/join`, {
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
    }
);

// eslint-disable-next-line qwik/loader-location
export const useReportItem = routeAction$(
    async (data, { cookie }) => {
        console.log('### useReportItem ###');
        const token = cookie.get('authjs.session-token');
        if (!token) {
            return { success: false, error: "No authentication token found" };
        }

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/reports`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": token.value,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    item_type: data.itemType,
                    item_id: data.itemId,
                    reason: data.reason,
                    details: data.details
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al enviar el reporte');
            }

            const result = await response.json();
            return { success: true, data: result };
        } catch (error) {
            console.error("Error reporting item:", error);
            return { 
                success: false, 
                message: error instanceof Error ? error.message : "Ha ocurrido un error inesperado al enviar el reporte" 
            };
        }
    }
);

// Action to delete a poll (only the creator can do it)
// eslint-disable-next-line qwik/loader-location
export const useDeletePoll = routeAction$(
    async (data, { cookie }) => {
        console.log('### useDeletePoll ###');
        const token = cookie.get('authjs.session-token');
        if (!token) {
            return { success: false, error: "No authentication token found" };
        }

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls/${data.pollId}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": token.value,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error deleting the poll');
            }

            return { success: true };
        } catch (error) {
            console.error("Error deleting poll:", error);
            return { 
                success: false, 
                message: error instanceof Error ? error.message : "An unexpected error occurred while deleting the poll" 
            };
        }
    }
);

export interface ReportResponseData {
    success: boolean;
    message?: string;
    error?: string;
}

export const useFormReportAction = formAction$<ReportForm, ReportResponseData>(
    async (values, event) => {
        console.log('############ useFormReportAction ############');
        const token = event.cookie.get('authjs.session-token')?.value;
        
        if (!token) {
            return {
                success: false,
                error: _`Debes iniciar sesión para reportar contenido.`
            };
        }

        console.log('values', values)
        const payload = {
            item_type: values.itemType,
            item_id: values.itemId,
            reason: values.reason,
            details: values.details || ""
        }
        console.log('payload', payload)

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/reports`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            console.log('response', response)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al enviar el reporte');
            }

            await response.json();
            return { 
                success: true, 
                message: _`Reporte enviado correctamente. Gracias por tu colaboración.` 
            };
        } catch (error) {
            console.error("Error reporting item:", error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : _`Ha ocurrido un error inesperado al enviar el reporte` 
            };
        }
    },
    valiForm$(ReportSchema)
);

// eslint-disable-next-line qwik/loader-location
export const useDeleteOpinion = routeAction$(
    async (data, { fail, cookie }) => {
        console.log('### useDeleteOpinion ###')
        console.log('data', data)
        const token = cookie.get('authjs.session-token')?.value;
        console.log('token', token)
        
        if (!token) {
            return fail(401, {
                success: false,
                message: "No estás autenticado",
            });
        }
        
        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates/opinions/${data.opinionId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            console.log('response', response)
            
            if (!response.ok) {
                return fail(response.status, {
                    success: false,
                    message: "Error al eliminar la opinión",
                });
            }
            
            return {
                success: true,
                message: "Opinión eliminada correctamente",
            };
        } catch (error) {
            console.error("Error al eliminar la opinión:", error);
            return fail(500, {
                success: false,
                message: "Error al eliminar la opinión",
            });
        }
    }
);

// eslint-disable-next-line qwik/loader-location
export const useFollowUser = routeAction$(
    async (data, { cookie }) => {
        console.log('### useFollowUser ###');
        console.log('data', data);

        const token = cookie.get('authjs.session-token')?.value;
        if (!token) {
            return { success: false, error: "No authentication token found" };
        }

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/${data.username}/follow`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al seguir al usuario');
            }

            return {
                success: true,
                message: "Usuario seguido correctamente",
            };
        } catch (error) {
            console.error("Error al seguir al usuario:", error);
            return {
                success: false,
                message: "Error al seguir al usuario",
            };
        }
    }
);

// eslint-disable-next-line qwik/loader-location
export const useUnfollowUser = routeAction$(
    async (data, { cookie }) => {
        console.log('### useUnfollowUser ###');
        console.log('data', data);

        const token = cookie.get('authjs.session-token')?.value;
        if (!token) {
            return { success: false, error: "No authentication token found" };
        }

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/${data.username}/follow`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al seguir al usuario');
            }

            return {
                success: true,
                message: "Usuario dejado de seguir correctamente",
            };
        } catch (error) {
            console.error("Error al seguir al usuario:", error);
            return {
                success: false,
                message: "Error al dejar de seguir al usuario",
            };
        }
    }
);

// eslint-disable-next-line qwik/loader-location
export const useDeleteDebate = routeAction$(
    async (data, { cookie }) => {
        console.log('### useDeleteDebate ###');
        const token = cookie.get('authjs.session-token');
        if (!token) {
            return { success: false, error: "No authentication token found" };
        }

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates/${data.debateId}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": token.value,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al eliminar el debate');
            }

            return { success: true };
        } catch (error) {
            console.error("Error al eliminar el debate:", error);
            return { 
                success: false, 
                message: error instanceof Error ? error.message : "Ha ocurrido un error inesperado al eliminar el debate" 
            };
        }
    }
);

// eslint-disable-next-line qwik/loader-location
export const useDeleteProject = routeAction$(
    async (data, { cookie }) => {
        console.log('### useDeleteProject ###');
        const token = cookie.get('authjs.session-token');
        if (!token) {
            return { success: false, error: "No authentication token found" };
        }

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/projects/${data.projectId}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": token.value,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error deleting the project');
            }

            return { success: true };
        } catch (error) {
            console.error("Error deleting the project:", error);
            return { 
                success: false, 
                message: error instanceof Error ? error.message : "An unexpected error occurred while deleting the project" 
            };
        }
    }
);

export interface CommunityRequestResponseData {
    success: boolean;
    message: string;
    data?: {
        request_id: string;
    };
}

export const useFormCommunityRequestAction = formAction$<CommunityRequestForm, CommunityRequestResponseData>(
    async (values, event) => {
        console.log('############ useFormCommunityRequestAction ############');
        const token = event.cookie.get('authjs.session-token')?.value;
        
        if (!token) {
            return {
                status: "error",
                message: _`Debes iniciar sesión para enviar solicitudes.`
            };
        }

        console.log('values', values);
        
        const payload = {
            country: values.country,
            region: values.region,
            city: values.city,
            email: values.email
        };
        
        console.log('payload', payload);

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/requests/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al enviar la solicitud de comunidad');
            }

            const data = await response.json();

            return {
                status: "success",
                message: _`Solicitud enviada correctamente`,
                data: {
                    success: true,
                    message: _`Tu solicitud ha sido recibida. Te contactaremos pronto.`,
                    request_id: data.request_id || ""
                }
            };
        } catch (error: any) {
            console.error('Error in useFormCommunityRequestAction:', error);
            return {
                status: "error",
                message: error.message || _`Ha ocurrido un error inesperado`,
                data: {
                    success: false,
                    message: error.message || _`Ha ocurrido un error inesperado`
                }
            };
        }
    },
    valiForm$(CommunityRequestSchema)
);

export const useReactProject = routeAction$(async (data, { cookie, fail }) => {
    const token = cookie.get('authjs.session-token')
    if (!token) {
        return fail(401, {
            message: 'Unauthorized'
        })
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/projects/${data.projectId}/react`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token.value
            },
            body: JSON.stringify({
                reaction: data.reaction
            })
        })

        if (!response.ok) {
            return fail(response.status, {
                message: 'Failed to react to project'
            })
        }

        const result = await response.json()
        return {
            status: 200,
            message: 'Reaction updated successfully',
            data: result
        }
    } catch (error) {
        console.error('Error reacting to project:', error)
        return fail(500, {
            message: 'Internal server error'
        })
    }
})