import { routeLoader$ } from "@builder.io/qwik-city";
import type { DebateResponse } from "~/types/debate";
import type { PollResponse } from "~/types/poll";
import type { ProjectResponse } from "~/types/project";

/**
 * Loader to fetch global polls with pagination
 * Returns polls data or empty array if error occurs
 */
export const useGetGlobalPolls = routeLoader$(async ({ cookie, query }) => {
    const page = query.get('page');
    const authToken = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME)?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', '1');
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch global polls: ${response.statusText}`);
        }

        const data: PollResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetGlobalPolls:', error);
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
 * Loader to fetch global debates with pagination
 * Returns debates data or empty array if error occurs
 */
export const useGetGlobalDebates = routeLoader$(async ({ cookie, query }) => {
    const page = query.get('page');
    const authToken = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME)?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/debates`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', '1');
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch global debates: ${response.statusText}`);
        }

        const data: DebateResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetGlobalDebates:', error);
        return {
            items: [],
            total: 0,
            page: 1,
            size: 10,
            pages: 1
        } as DebateResponse;
    }
})

/**
 * Loader to fetch global projects with pagination
 * Returns projects data or empty array if error occurs
 */
export const useGetGlobalProjects = routeLoader$(async ({ cookie, query }) => {
    const page = query.get('page');
    const authToken = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME)?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/projects`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', '1');
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch global projects: ${response.statusText}`);
        }

        const data: ProjectResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetGlobalProjects:', error);
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
 * Loader to fetch global community members with pagination
 * Returns members data or empty object if error occurs
 */
export const useGetGlobalMembers = routeLoader$(async ({ cookie, query }) => {
    const page = query.get('page') || '1';
    const size = query.get('size') || '100';
    const authToken = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME)?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/communities/1/members`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('page', page);
        url.searchParams.append('size', size);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch global members: ${response.statusText}`);
        }

        const data = await response.json();
        
        data.items = data.items.map((member: any) => ({
            ...member,
            is_public: member.is_public || false
        }));

        return data;

    } catch (error) {
        console.error('Error in useGetGlobalMembers:', error);
        return {
            items: [], 
            total_public: 0,
            total_anonymous: 0,
            page: 1, 
            size: 100, 
            pages: 1
        };
    }
});