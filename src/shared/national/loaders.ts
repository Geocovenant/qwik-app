import { routeLoader$ } from "@builder.io/qwik-city";
import type { DebateResponse } from "~/types/debate";
import type { PollResponse } from "~/types/poll";
import type { ProjectResponse } from "~/types/project";
import type { IssueResponse } from "~/types/issue";
import { getCountryCode } from "~/data/countries";

/**
 * Loader to fetch country data
 * Returns country data or empty array if error occurs
 */
export const useGetCountry = routeLoader$(async ({ params }) => {
    const cca2 = getCountryCode(params.nation);
    if (!cca2) {
        console.error('Country not found!', params.nation);
        return [];
    }
    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/countries/${cca2}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching country:', error);
        return { country: null };
    }
});

/**
 * Loader to fetch regions data
 * Returns regions data or empty array if error occurs
 */
export const useGetRegions = routeLoader$(async ({ params }) => {
    const nationPath = params.nation;
    if (!nationPath) return [];

    const cca2 = getCountryCode(nationPath);
    if (!cca2) {
        console.error('Country not found:', nationPath);
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/countries/${cca2}/divisions`);
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
 * Loader to fetch national polls with pagination
 * Returns polls data or empty array if error occurs
 */
export const useGetNationalPolls = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const country = await resolveValue(useGetCountry);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', country.community_id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch national polls: ${response.statusText}`);
        }

        const data: PollResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetNationalPolls:', error);
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
 * Loader to fetch national debates with pagination
 * Returns debates data or empty array if error occurs
 */
export const useGetNationalDebates = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const country = await resolveValue(useGetCountry);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/debates`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', country.community_id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch national debates: ${response.statusText}`);
        }

        const data: DebateResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetNationalDebates:', error);
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
 * Loader to fetch national projects with pagination
 * Returns projects data or empty array if error occurs
 */
export const useGetNationalProjects = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const country = await resolveValue(useGetCountry);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/projects`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('community_id', country.community_id);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch national projects: ${response.statusText}`);
        }

        const data: ProjectResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetNationalProjects:', error);
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
 * Loader to fetch national issues with pagination
 * Returns issues data or empty array if error occurs
 */
export const useGetNationalIssues = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const country = await resolveValue(useGetCountry);
    const page = query.get('page');
    const authToken = cookie.get('authjs.session-token')?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/issues`;

    try {
        const url = new URL(baseUrl);
        url.searchParams.append('country', country.cca2);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch national issues: ${response.statusText}`);
        }

        const data: IssueResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetNationalIssues:', error);
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
 * Loader to fetch national members with pagination
 * Returns members data or empty array if error occurs
 */
export const useGetNationalMembers = routeLoader$(async ({ cookie, query, resolveValue }) => {
    const country = await resolveValue(useGetCountry);
    const page = Number(query.get("page") || "1");
    const size = Number(query.get("size") || "100");
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return { items: [], total: 0, page: 1, size: 20, pages: 1 };
    }
    
    const communityId = country.community_id;

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/${communityId}/members?page=${page}&size=${size}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching national members');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching national members:', error);
        return { items: [], total: 0, page: 1, size: 20, pages: 1 };
    }
});