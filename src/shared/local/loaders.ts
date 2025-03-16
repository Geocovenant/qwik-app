import { routeLoader$ } from "@builder.io/qwik-city";
import type { DebateResponse } from "~/types/debate";
import type { PollResponse } from "~/types/poll";
import type { ProjectResponse } from "~/types/project";
import type { IssueResponse } from "~/types/issue";

/**
 * Loader to obtain data for a specific locality
 * Returns locality data or an empty object if an error occurs
 */
export const useGetLocality = routeLoader$(async ({ params }) => {
    try {
        const response = await fetch(
            `${import.meta.env.PUBLIC_API_URL}/api/v1/communities/search?level=LOCAL&country=${params.nation}&region=${params.region}&subregion=${params.subregion}&locality=${params.locality}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching locality:', error);
        return { locality: null };
    }
});

/**
 * Loader to obtain local polls with pagination
 * Returns poll data or an empty array if an error occurs
 */
export const useGetLocalPolls = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const locality = await resolveValue(useGetLocality);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', locality.id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching local polls: ${response.statusText}`);
        }

        const data: PollResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetLocalPolls:', error);
        return {
            items: [],
            total: 0,
            page: 1,
            size: 10,
            pages: 1
        } as PollResponse;
    }
});

/**
 * Loader to obtain local debates with pagination
 * Returns debate data or an empty array if an error occurs
 */
export const useGetLocalDebates = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const locality = await resolveValue(useGetLocality);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/debates`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', locality.id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching local debates: ${response.statusText}`);
        }

        const data: DebateResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetLocalDebates:', error);
        return {
            items: [],
            total: 0,
            page: 1,
            size: 10,
            pages: 1
        } as DebateResponse;
    }
});

/**
 * Loader to obtain local projects with pagination
 * Returns project data or an empty array if an error occurs
 */
export const useGetLocalProjects = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const locality = await resolveValue(useGetLocality);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/projects`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', locality.id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching local projects: ${response.statusText}`);
        }

        const data: ProjectResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetLocalProjects:', error);
        return {
            items: [],
            total: 0,
            page: 1,
            size: 10,
            pages: 1
        } as ProjectResponse;
    }
});

/**
 * Loader to obtain local issues with pagination
 * Returns issue data or an empty array if an error occurs
 */
export const useGetLocalIssues = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const locality = await resolveValue(useGetLocality);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/issues`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', locality.id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching local issues: ${response.statusText}`);
        }

        const data: IssueResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetLocalIssues:', error);
        return {
            items: [],
            total: 0,
            page: 1,
            size: 10,
            pages: 1
        } as IssueResponse;
    }
});

/**
 * Loader to obtain locality members with pagination
 * Returns member data or an empty array if an error occurs
 */
export const useGetLocalMembers = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const locality = await resolveValue(useGetLocality);
    const page = Number(query.get("page") || "1");
    const size = Number(query.get("size") || "100");
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return { items: [], total: 0, page: 1, size: 20, pages: 1 };
    }
    
    const communityId = locality.id;

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/${communityId}/members?page=${page}&size=${size}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token.value}`
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching locality members');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching locality members:', error);
        return { items: [], total: 0, page: 1, size: 20, pages: 1 };
    }
});
