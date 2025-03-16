import { routeLoader$ } from "@builder.io/qwik-city";
import type { DebateResponse } from "~/types/debate";
import type { PollResponse } from "~/types/poll";
import type { ProjectResponse } from "~/types/project";
import type { IssueResponse } from "~/types/issue";

/**
 * Loader to get data for a subregion
 * Returns subregion data or an empty array if an error occurs
 */
export const useGetSubregion = routeLoader$(async ({ params }) => {
    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/search?level=SUBREGIONAL&country=${params.nation}&region=${params.region}&subregion=${params.subregion}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching the subregion:', error);
        return { subregion: null };
    }
});

/**
 * Loader to fetch subregions data
 * Returns localities data or empty array if error occurs
 */
export const useGetLocalities = routeLoader$(async ({ resolveValue }) => {
    const subregion = await resolveValue(useGetSubregion);
    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/subregions/${subregion.subregion_id}/localities`);
        if (!response.ok) {
            throw new Error('Error fetching subregions localities');
        }
        const localities = await response.json();
        return localities;
    } catch (error) {
        console.error('Error fetching subregions localities:', error);
        return [];
    }
});

/**
 * Loader to get subregional polls with pagination
 * Returns poll data or an empty array if an error occurs
 */
export const useGetSubregionalPolls = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const subregion = await resolveValue(useGetSubregion);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', subregion.id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching subregional polls: ${response.statusText}`);
        }

        const data: PollResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetSubregionalPolls:', error);
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
 * Loader to get subregional debates with pagination
 * Returns debate data or an empty array if an error occurs
 */
export const useGetSubregionalDebates = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const subregion = await resolveValue(useGetSubregion);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/debates`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', subregion.id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching subregional debates: ${response.statusText}`);
        }

        const data: DebateResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetSubregionalDebates:', error);
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
 * Loader to get subregional projects with pagination
 * Returns project data or an empty array if an error occurs
 */
export const useGetSubregionalProjects = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const subregion = await resolveValue(useGetSubregion);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/projects`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', subregion.id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching subregional projects: ${response.statusText}`);
        }

        const data: ProjectResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetSubregionalProjects:', error);
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
 * Loader to get subregional issues with pagination
 * Returns issue data or an empty array if an error occurs
 */
export const useGetSubregionalIssues = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const subregion = await resolveValue(useGetSubregion);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/issues`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', subregion.id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching subregional issues: ${response.statusText}`);
        }

        const data: IssueResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetSubregionalIssues:', error);
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
 * Loader to get subregional members with pagination
 * Returns member data or an empty array if an error occurs
 */
export const useGetSubregionalMembers = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const subregion = await resolveValue(useGetSubregion);
    const page = Number(query.get("page") || "1");
    const size = Number(query.get("size") || "100");
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return { items: [], total: 0, page: 1, size: 20, pages: 1 };
    }
    
    const communityId = subregion.id;

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/${communityId}/members?page=${page}&size=${size}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token.value}`
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching subregional members');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching subregional members:', error);
        return { items: [], total: 0, page: 1, size: 20, pages: 1 };
    }
});
