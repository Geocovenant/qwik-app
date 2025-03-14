import { formAction$, valiForm$ } from '@modular-forms/qwik';
import { routeAction$, z, zod$ } from '@builder.io/qwik-city';
import type { UserForm } from '~/schemas/userSchema';
import { UserSchema } from '~/schemas/userSchema';
import type { OpinionForm } from "~/schemas/opinionSchema";
import { OpinionSchema } from "~/schemas/opinionSchema";
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
        const token = cookie.get('authjs.session-token')?.value;
        const { pollId } = data
        const payload = { option_ids: data.optionIds }
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
        const token = cookie.get('authjs.session-token')?.value;
        const payload = { reaction: data.reaction }
        
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
        const token = cookie.get('authjs.session-token')?.value;
        const payload = {
            opinion_id: data.opinionId,
            value: data.reaction === "LIKE" ? 1 : -1
        }
        
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
        const token = cookie.get('authjs.session-token')?.value;
        const payload = { base_name: data.username }
        
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

        const token = event.cookie.get('authjs.session-token')?.value;

        const payload = {
            bio: values.bio || "",
            cover: values.coverImage || "",
            gender: values.gender === "female" ? "F" : values.gender === "male" ? "M" : values.gender === "non-binary" ? "X" : "",
            image: values.image || "",
            name: values.name,
            website: values.website || "",
        };

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
        const token = event.cookie.get('authjs.session-token')?.value;

        const payload = {
            content: values.opinion,
            country_cca2: values.country,
            region_id: values.region_id ? parseInt(values.region_id) : null,
        }

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
                throw new Error(errorData.message || 'Error creating the comment');
            }

            const data = await response.json();

            return {
                success: true,
                message: _`Opinion shared successfully`,
                data: data,
            };
        } catch (error: any) {
            console.error('Error in useFormOpinionAction:', error);
            return {
                success: false,
                message: error.message || 'An unexpected error occurred',
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
        console.log('useFormCommentAction')
        console.log('values', values)

        const token = event.cookie.get('authjs.session-token')?.value;

        const payload = {
            content: values.text,
        };
        console.log('payload', payload)

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
                throw new Error(errorData.message || 'Error creating the comment');
            }

            const data = await response.json();

            return {
                success: true,
                message: _`Comment added successfully`,
                data: data,
            };
        } catch (error: any) {
            console.error('Error in useFormCommentAction:', error);
            return {
                success: false,
                message: error.message || 'An unexpected error occurred',
            };
        }
    },
    valiForm$(CommentSchema)
);

// eslint-disable-next-line qwik/loader-location
export const useCheckUserOpinionInDebate = routeAction$(
    async (data, { cookie }) => {
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
                    message: errorData.message || 'Error checking opinion'
                };
            }
            
            const responseData = await response.json();
            
            return {
                success: true,
                hasOpinion: responseData.hasOpinion || false,
                message: responseData.hasOpinion ? 'You have already expressed an opinion in this debate' : ''
            };
        } catch (err) {
            console.error('err', err)
            return {
                success: false,
                hasOpinion: false,
                message: 'Error checking opinion'
            }
        }
    }
)

// Action to update the user's visibility in a specific community
// eslint-disable-next-line qwik/loader-location
export const useUpdateCommunityVisibility = routeAction$(
    async (data, { cookie }) => {
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

// Action to join a community
// eslint-disable-next-line qwik/loader-location
export const useJoinCommunity = routeAction$(
    async (data, { cookie }) => {
        const { communityId } = data;
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
                throw new Error(errorData.message || 'Error joining the community');
            }

            const result = await response.json();
            return { success: true, message: result.message };
        } catch (error) {
            console.error("Error joining community:", error);
            return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
        }
    }
);

// Action to leave a community
// eslint-disable-next-line qwik/loader-location
export const useLeaveCommunity = routeAction$(
    async (data, { cookie }) => {
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
                throw new Error(errorData.message || 'Error leaving the community');
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
                throw new Error(errorData.detail || 'Error reporting the item');
            }

            const result = await response.json();
            return { success: true, data: result };
        } catch (error) {
            console.error("Error reporting item:", error);
            return { 
                success: false, 
                message: error instanceof Error ? error.message : "An unexpected error occurred while reporting the item" 
            };
        }
    }
);

// Action to delete a poll (only the creator can do it)
// eslint-disable-next-line qwik/loader-location
export const useDeletePoll = routeAction$(
    async (data, { cookie }) => {
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
        const token = event.cookie.get('authjs.session-token')?.value;
        
        if (!token) {
            return {
                success: false,
                error: _`You must be logged in to report content.`
            };
        }

        const payload = {
            item_type: values.itemType,
            item_id: values.itemId,
            reason: values.reason,
            details: values.details || ""
        }

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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error reporting the item');
            }

            await response.json();
            return { 
                success: true, 
                message: _`Report submitted successfully. Thank you for your cooperation.` 
            };
        } catch (error) {
            console.error("Error reporting item:", error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : _`An unexpected error occurred while submitting the report` 
            };
        }
    },
    valiForm$(ReportSchema)
);

// eslint-disable-next-line qwik/loader-location
export const useDeleteOpinion = routeAction$(
    async (data, { fail, cookie }) => {
        const token = cookie.get('authjs.session-token')?.value;
        
        if (!token) {
            return fail(401, {
                success: false,
                message: "You are not authenticated",
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
            
            if (!response.ok) {
                return fail(response.status, {
                    success: false,
                    message: "Error deleting the opinion",
                });
            }
            
            return {
                success: true,
                message: "Opinion deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting the opinion:", error);
            return fail(500, {
                success: false,
                message: "Error deleting the opinion",
            });
        }
    }
);

// eslint-disable-next-line qwik/loader-location
export const useFollowUser = routeAction$(
    async (data, { cookie }) => {

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
                throw new Error(errorData.detail || 'Error following the user');
            }

            return {
                success: true,
                message: "User followed successfully",
            };
        } catch (error) {
            console.error("Error following the user:", error);
            return {
                success: false,
                message: "Error following the user",
            };
        }
    }
);

// eslint-disable-next-line qwik/loader-location
export const useUnfollowUser = routeAction$(
    async (data, { cookie }) => {

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
                throw new Error(errorData.detail || 'Error unfollowing the user');
            }

            return {
                success: true,
                message: "User unfollowed successfully",
            };
        } catch (error) {
            console.error("Error unfollowing the user:", error);
            return {
                success: false,
                message: "Error unfollowing the user",
            };
        }
    }
);

// eslint-disable-next-line qwik/loader-location
export const useDeleteDebate = routeAction$(
    async (data, { cookie }) => {
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
                throw new Error(errorData.detail || 'Error deleting the debate');
            }

            return { success: true };
        } catch (error) {
            console.error("Error deleting the debate:", error);
            return { 
                success: false, 
                message: error instanceof Error ? error.message : "An unexpected error occurred while deleting the debate" 
            };
        }
    }
);

// eslint-disable-next-line qwik/loader-location
export const useDeleteProject = routeAction$(
    async (data, { cookie }) => {
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
        const token = event.cookie.get('authjs.session-token')?.value;
        
        if (!token) {
            return {
                status: "error",
                message: _`You must be logged in to submit requests.`
            };
        }

        const payload = {
            country: values.country,
            region: values.region,
            city: values.city,
            email: values.email
        };
        
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
                throw new Error(errorData.message || 'Error submitting the community request');
            }

            const data = await response.json();

            return {
                status: "success",
                message: _`Request submitted successfully`,
                data: {
                    success: true,
                    message: _`Your request has been received. We will contact you soon.`,
                    request_id: data.request_id || ""
                }
            };
        } catch (error: any) {
            console.error('Error in useFormCommunityRequestAction:', error);
            return {
                status: "error",
                message: error.message || _`An unexpected error occurred`,
                data: {
                    success: false,
                    message: error.message || _`An unexpected error occurred`
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