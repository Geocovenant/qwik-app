import { routeLoader$ } from "@builder.io/qwik-city";
import type { DebateResponse } from "~/types/debate";
import type { PollResponse } from "~/types/poll";
import type { ProjectResponse } from "~/types/project";

/**
 * Loader to fetch international polls with pagination
 * Returns polls data or empty array if error occurs
 */
export const useGetInternationalPolls = routeLoader$(async ({ cookie, query }) => {
    const page = query.get('page');
    const authToken = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME)?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls?scope=INTERNATIONAL`;

    try {
        const url = new URL(baseUrl);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch international polls: ${response.statusText}`);
        }

        const data: PollResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetInternationalPolls:', error);
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
 * Loader to fetch international debates with pagination
 * Returns debates data or empty array if error occurs
 */
export const useGetInternationalDebates = routeLoader$(async ({ cookie, query }) => {
    const page = query.get('page');
    const authToken = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME)?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/debates/?type=INTERNATIONAL`;

    try {
        const url = new URL(baseUrl);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch international debates: ${response.statusText}`);
        }

        const data: DebateResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetInternationalDebates:', error);
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
 * Loader to fetch international projects with pagination
 * Returns projects data or empty array if error occurs
 */
export const useGetInternationalProjects = routeLoader$(async ({ cookie, query }) => {
    const page = query.get('page');
    const authToken = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME)?.value;
    const baseUrl = `${import.meta.env.PUBLIC_API_URL}/api/v1/projects?scope=INTERNATIONAL`;

    try {
        const url = new URL(baseUrl);
        if (page) url.searchParams.append('page', page);

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
                ...(authToken && { Authorization: authToken })
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch international projects: ${response.statusText}`);
        }

        const data: ProjectResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Error in useGetInternationalProjects:', error);
        return {
            items: [],
            total: 0,
            page: 1,
            size: 10,
            pages: 1
        } as ProjectResponse;
    }
});