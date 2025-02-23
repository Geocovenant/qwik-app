import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { CommunityType } from "~/constants/communityType";
import { PollType } from "~/constants/pollType";
import type { PollForm } from "~/schemas/pollSchema";
import { dataArray } from "~/data/countries";

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
export const useGetPolls = routeLoader$(async ({ cookie, url, params }) => {
    console.log('params', params)
    const token = cookie.get('authjs.session-token')
    if (!token) {
        return null
    }

    // Obtener el scope del query parameter
    const scope = url.searchParams.get('scope')
    
    // Obtener el código del país del pathname
    const countryPath = url.pathname.split('/')[1]
    const countryCode = getCountryCode(countryPath) // Necesitaremos implementar esta función

    let endpoint = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls`

    // Si estamos en una ruta de país y el scope es national
    if (countryCode && scope === 'national') {
        endpoint = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls/country/${countryCode}`
    }

    try {
        const response = await fetch(endpoint, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        })
        
        if (!response.ok) {
            throw new Error('Error al obtener las encuestas')
        }
        
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error al obtener las encuestas:', error)
        return null
    }
})

// eslint-disable-next-line qwik/loader-location
export const useGetPollsByScope = routeLoader$(async ({ pathname, cookie }) => {
    const token = cookie.get('authjs.session-token')
    
    const pathSegments = pathname.split('/').filter(Boolean)
    const countryPath = pathSegments[0]
    const countryCode = getCountryCode(countryPath)

    let endpoint = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls`

    // Si estamos en una ruta de país
    if (countryCode) {
        endpoint = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls/country/${countryCode}?scope=NATIONAL`
    } else {
        // Mantener la lógica existente para otros casos
        const rawScope = pathname === "/" ? "GLOBAL" : pathSegments[0].toUpperCase()
        const isValidScope = Object.values(CommunityType).includes(rawScope as CommunityType)
        
        if (!isValidScope) {
            console.warn(`Scope inválido: ${rawScope}`)
            return []
        }
        
        endpoint = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls?scope=${rawScope}`
    }

    try {
        const headers: Record<string, string> = {
            Accept: 'application/json'
        }

        // Añadir el token de autorización si existe
        if (token) {
            headers.Authorization = token.value
        }

        const response = await fetch(endpoint, { headers })
        
        if (!response.ok) {
            throw new Error('Error al obtener las encuestas')
        }
        
        const polls = await response.json()
        return polls
    } catch (error) {
        console.error('Error al obtener las encuestas:', error)
        return []
    }
})

// Función auxiliar para obtener el código del país usando el archivo countries.ts
function getCountryCode(countryPath: string): string | null {
    if (!countryPath) return null
    
    // Normalizar el nombre del país (quitar acentos, convertir a minúsculas)
    const normalizedPath = countryPath
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()

    // Buscar el país en el array de países
    const country = dataArray.find(country => {
        const normalizedName = country.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
        return normalizedName === normalizedPath
    })

    return country ? country.cca2 : null
}

// eslint-disable-next-line qwik/loader-location
export const useFormPollLoader = routeLoader$<InitialValues<PollForm>>(() => {
    return {
        community_ids: [],
        description: '',
        ends_at: '',
        is_anonymous: false,
        options: ['', ''],
        scope: '',
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
