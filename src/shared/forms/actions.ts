import { formAction$, valiForm$ } from "@modular-forms/qwik";
import { CommunityType } from "~/constants/communityType";
import { type PollForm, type PollResponseData, PollSchema } from "~/schemas/pollSchema";
import { type DebateForm, type DebateResponseData, DebateSchema } from "~/schemas/debateSchema";
import { type ProjectForm, type ProjectResponseData, ProjectSchema } from "~/schemas/projectSchema";
import { type IssueForm, type IssueResponseData, IssueSchema } from "~/schemas/issueSchema";
import { _ } from "compiled-i18n";

export const useFormPollAction = formAction$<PollForm, PollResponseData>(
    async (values, event) => {
        const token = event.cookie.get('authjs.session-token')?.value;

        // Validate token existence
        if (!token) {
            return {
                success: false,
                message: _`Authentication required to create a poll`,
            };
        }

        // Validate maximum number of options
        if (values.options.length > 10) {
            return {
                success: false,
                message: _`Maximum number of options exceeded. Please limit to 10 options.`,
            };
        }

        // Validate maximum number of tags
        if (values.tags && values.tags.length > 10) {
            return {
                success: false,
                message: _`Maximum number of tags exceeded. Please limit to 10 tags.`,
            };
        }

        // Prepare payload according to the scope
        const payload = {
            title: values.title,
            description: values.description,
            type: values.type,
            options: values.options.map(o => ({ text: o })),
            is_anonymous: values.is_anonymous,
            scope: values.scope,
            ends_at: values.ends_at !== '' ? values.ends_at : null,
            tags: values.tags || [],
        };
        
        // Add specific fields according to the scope
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
            case CommunityType.SUBREGIONAL:
            case CommunityType.LOCAL:
                Object.assign(payload, { community_ids: values.community_ids });
                break;
            default:
                break;
        }

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            // Check if the response is correct, otherwise throw an error
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

export const useFormDebateAction = formAction$<DebateForm, DebateResponseData>(
    async (values, event) => {

        const token = event.cookie.get('authjs.session-token')?.value;

        if (!token) {
            return {
                success: false,
                message: _`Authentication required to create a debate`,
            };
        }

        // Validate maximum number of tags
        if (values.tags && values.tags.length > 10) {
            return {
                success: false,
                message: _`Maximum number of tags exceeded. Please limit to 10 tags.`,
            };
        }

        // Image validations
        // if (values.image && typeof values.image === 'object' && 'size' in values.image && values.image.size > 0) {
        //     // 1. File size validation (12MB max)
        //     const maxSize = 12 * 1024 * 1024; // 12MB in bytes
        //     if (values.image.size > maxSize) {
        //         return {
        //             success: false,
        //             message: _`Image is too large. Maximum size allowed is 12MB.`,
        //         };
        //     }

        //     // 2. File type validation
        //     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        //     if (values.image.type && !allowedTypes.includes(values.image.type)) {
        //         return {
        //             success: false,
        //             message: _`Invalid image format. Allowed formats are: JPG, PNG, GIF, and WEBP.`,
        //         };
        //     }
        // }

        // Define payload with a more complete type
        const payload: {
            title: string;
            description: string;
            tags: string[] | undefined;
            is_anonymous: boolean;
            type: string;
            images?: string[];
        } = {
            title: values.title,
            description: values.description,
            tags: values.tags,
            is_anonymous: values.is_anonymous,
            type: values.scope,
        };

        // Upload image if valid
        // if (values.image && typeof values.image === 'object' && 'size' in values.image && values.image.size > 0) {
        //     const cloudinaryResponse = await uploadImage(values.image as Blob);
        //     payload.images = [cloudinaryResponse.secureUrl];
        // }

        // Add specific fields according to the scope
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
            case CommunityType.SUBREGIONAL:
            case CommunityType.LOCAL:
                Object.assign(payload, { community_ids: values.community_ids });
                break;
            default:
                break;
        }
        
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

export const useFormProjectAction = formAction$<ProjectForm, ProjectResponseData>(
    async (values, event) => {

        const token = event.cookie.get('authjs.session-token')?.value;

        if (!token) {
            return {
                success: false,
                message: _`Authentication required to create a debate`,
            };
        }

        // Preparar payload según el scope
        const payload = {
            title: values.title,
            description: values.description,
            goal_amount: values.goal_amount,
            status: values.status,
            scope: values.scope,
            tags: values.tags || [],
            steps: values.steps.map(step => ({
                title: step.title,
                description: step.description || "",
                order: step.order || "0",
                status: step.status,
                resources: step.resources?.map(resource => ({
                    type: resource.type,
                    description: resource.description,
                    quantity: resource.quantity || "",
                    unit: resource.unit || ""
                })) || []
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
            case CommunityType.SUBREGIONAL:
            case CommunityType.LOCAL:
                Object.assign(payload, { community_ids: values.community_ids });
                break;
            default:
                break;
        }

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

export const useFormIssueAction = formAction$<IssueForm, IssueResponseData>(
    async (values, event) => {

        const token = event.cookie.get('authjs.session-token')?.value;

        // Preparar payload según el scope
        const payload = {
            title: values.title,
            description: values.description,
            organization_name: values.organization_name || null,
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
            case CommunityType.SUBREGIONAL:
            case CommunityType.LOCAL:
                Object.assign(payload, { community_ids: values.community_ids });
                break;
            default:
                break;
        }

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

// TODO: use this function in the useFormDebateAction
// const uploadImage = async (file: Blob) => {
//     const response_signature = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/cloudinary/generate_signature`, {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json'
//         },
//     });
//     const data_signature = await response_signature.json();
//     const formdata = new FormData();
//     formdata.append("signature", data_signature.signature);
//     formdata.append("timestamp", data_signature.timestamp);
//     formdata.append("api_key", data_signature.api_key);
//     formdata.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
//     formdata.append("file", file);
//     const endpoint = "https://api.cloudinary.com/v1_1/" + import.meta.env.VITE_CLOUDINARY_CLOUD_NAME + "/auto/upload";
//     const res = await fetch(endpoint, {
//         body: formdata,
//         method: "post",
//     });
//     const data = await res.json();
//     return {
//         secureUrl: data.secure_url,
//     };
// }