import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { CommunityType } from "~/constants/communityType";
import { PollType } from "~/constants/pollType";
import type { PollForm } from "~/schemas/pollSchema";

// eslint-disable-next-line qwik/loader-location
export const useGetUser = routeLoader$(async ({ cookie }) => {
    const token = cookie.get('authjs.session-token')
    if (!token) {
        return null
    }
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/me`, {
        headers: {
            Accept: 'application/json',
            Authorization: token.value
        }
    })
    const data = await response.json()
    return data
})

// eslint-disable-next-line qwik/loader-location
export const useGetPolls = routeLoader$(async ({ cookie }) => {
    const token = cookie.get('authjs.session-token')
    if (!token) {
        return null
    }
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls`, {
        headers: {
            Accept: 'application/json',
            Authorization: token.value
        }
    })
    const data = await response.json()
    return data
})

// eslint-disable-next-line qwik/loader-location
export const useGetPollsByScope = routeLoader$(async ({ pathname }) => {
    // Obtener el scope del pathname
    const rawScope = pathname === "/" ? "GLOBAL" : pathname.split('/').filter(Boolean)[0].toUpperCase();
    
    // Verificar si el scope es válido
    const isValidScope = Object.values(CommunityType).includes(rawScope as CommunityType);
    
    if (!isValidScope) {
        console.warn(`Scope inválido: ${rawScope}`);
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls?scope=${rawScope}`);
        if (!response.ok) {
            throw new Error('Error al obtener las encuestas');
        }
        const polls = await response.json();
        return polls;
    } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        return [];
    }
});

// eslint-disable-next-line qwik/loader-location
export const useFormPollLoader = routeLoader$<InitialValues<PollForm>>(({ pathname }) => {
    const segments = pathname.split('/').filter(Boolean);
    const communityType = segments[0] || '';
    return {
        community_ids: communityType.toUpperCase() === CommunityType.GLOBAL ? ['1'] : [],
        description: '',
        ends_at: '',
        is_anonymous: false,
        options: ['', ''],
        scope: communityType.toUpperCase(),
        type: PollType.BINARY,
        tags: [],
        title: '',
    };
});

// eslint-disable-next-line qwik/loader-location
export const useGetCountryDivisions = routeLoader$(async ({ params }) => {
    const cca2 = params.cca2;
    if (!cca2) return [];
    
    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/countries/${cca2}/divisions`);
        if (!response.ok) {
            throw new Error('Error al obtener las divisiones del país');
        }
        const divisions = await response.json();
        return divisions;
    } catch (error) {
        console.error('Error al obtener las divisiones:', error);
        return [];
    }
});
