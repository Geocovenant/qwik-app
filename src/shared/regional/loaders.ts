import { routeLoader$ } from "@builder.io/qwik-city";
import type { DebateResponse } from "~/types/debate";
import type { PollResponse } from "~/types/poll";
import type { ProjectResponse } from "~/types/project";
import type { IssueResponse } from "~/types/issue";

/**
 * Loader to get data for a region
 * Returns region data or an empty array if an error occurs
 */
export const useGetRegion = routeLoader$(async ({ params }) => {
    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/search?level=REGIONAL&country=${params.nation}&region=${params.region}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching the region:', error);
        return { region: null };
    }
});

/**
 * Loader to fetch regions data
 * Returns regions data or empty array if error occurs
 */
export const useGetSubregions = routeLoader$(async ({ resolveValue }) => {
    const region = await resolveValue(useGetRegion);
    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/regions/${region.region_id}/subregions`);
        if (!response.ok) {
            throw new Error('Error fetching country divisions');
        }
        const divisions = await response.json();
        return divisions;
    } catch (error) {
        console.error('Error fetching country divisions:', error);
        return [];
    }
});

/**
 * Loader to get regional polls with pagination
 * Returns poll data or an empty array if an error occurs
 */
export const useGetRegionalPolls = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const region = await resolveValue(useGetRegion);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', region.id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching regional polls: ${response.statusText}`);
        }

        const data: PollResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetRegionalPolls:', error);
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
 * Loader to get regional debates with pagination
 * Returns debate data or an empty array if an error occurs
 */
export const useGetRegionalDebates = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const region = await resolveValue(useGetRegion);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/debates`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', region.id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching regional debates: ${response.statusText}`);
        }

        const data: DebateResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetRegionalDebates:', error);
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
 * Loader to get regional projects with pagination
 * Returns project data or an empty array if an error occurs
 */
export const useGetRegionalProjects = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const region = await resolveValue(useGetRegion);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/projects`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', region.id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching regional projects: ${response.statusText}`);
        }

        const data: ProjectResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetRegionalProjects:', error);
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
 * Loader to get regional issues with pagination
 * Returns issue data or an empty array if an error occurs
 */
export const useGetRegionalIssues = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const region = await resolveValue(useGetRegion);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/issues`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('scope', 'REGIONAL');
        url.searchParams.append('region', region.id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching regional issues: ${response.statusText}`);
        }

        const data: IssueResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetRegionalIssues:', error);
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
 * Loader to get regional members with pagination
 * Returns member data or an empty array if an error occurs
 */
export const useGetRegionalMembers = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const region = await resolveValue(useGetRegion);
    const page = Number(query.get("page") || "1");
    const size = Number(query.get("size") || "100");
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return { items: [], total: 0, page: 1, size: 20, pages: 1 };
    }
    
    const communityId = region.id;

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/${communityId}/members?page=${page}&size=${size}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching regional members');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching regional members:', error);
        return { items: [], total: 0, page: 1, size: 20, pages: 1 };
    }
});
