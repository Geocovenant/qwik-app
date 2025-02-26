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
export const useGetGlobalPolls = routeLoader$(async ({ cookie, params, pathname }) => {
    console.log('============ useGetGlobalPolls ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls?scope=GLOBAL`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las encuestas');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las encuestas globales:', error);
        return [];
    }
})

// eslint-disable-next-line qwik/loader-location
export const useGetInternationalPolls = routeLoader$(async ({ cookie, params }) => {
    console.log('============ useGetInternationalPolls ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls?scope=INTERNATIONAL`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las encuestas');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las encuestas internacionales:', error);
        return [];
    }
})

// eslint-disable-next-line qwik/loader-location
export const useGetNationalPolls = routeLoader$(async ({ cookie, params }) => {
    console.log('============ useGetNationalPolls ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }
    const cca2 = getCountryCode(params.nation);
    if (!cca2) {
        console.error('País no encontrado:', params.nation);
        return [];
    }
    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls?scope=NATIONAL&country=${cca2}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las encuestas');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        return [];
    }
})

// eslint-disable-next-line qwik/loader-location
export const useGetRegionalPolls = routeLoader$(async ({ cookie, params, resolveValue }) => {
    console.log('============ useGetRegionalPolls ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }
    
    const regions = await resolveValue(useGetRegions);
    console.log('regions', regions)

    const normalizedRegionName = params.region
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const regionData = regions.find((r: { name: string; }) => r.name === normalizedRegionName);
    console.log('regionData', regionData)

    const regionId = regionData?.id
    if (!regionId) {
        console.error('Región no encontrada:', params.region);
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls?scope=REGIONAL&region=${regionId}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las encuestas');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        return [];
    }
})

// eslint-disable-next-line qwik/loader-location
export const useGetSubregionalPolls = routeLoader$(async ({ cookie, params, resolveValue }) => {
    console.log('============ useGetSubregionalPolls ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }
    const regions = await resolveValue(useGetRegions);

    const normalizedRegionName = params.region
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const regionData = regions.find((r: { name: string; }) => r.name === normalizedRegionName);
    console.log('regionData', regionData)

    const regionId = regionData?.id
    if (!regionId) {
        console.error('Región no encontrada:', params.region);
        return [];
    }

    // Normalizar el nombre de la subregión
    const normalizedSubregionName = params.subregion
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Obtener los datos de la subregión
    try {
        const subregionResponse = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/regions/${regionId}/subregions?name=${normalizedSubregionName}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!subregionResponse.ok) {
            throw new Error('Error al obtener datos de la subregión');
        }

        const subregionData = await subregionResponse.json();
        console.log('subregionData', subregionData);

        const subregionId = subregionData?.[0]?.id;
        if (!subregionId) {
            console.error('Subregión no encontrada:', normalizedSubregionName);
            return [];
        }

        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls?scope=SUBREGIONAL&subregion=${subregionId}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las encuestas');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        return [];
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
export const useGetRegions = routeLoader$(async ({ params }) => {
    const nationPath = params.nation;
    if (!nationPath) return [];
    
    const cca2 = getCountryCode(nationPath);
    if (!cca2) {
        console.error('País no encontrado:', nationPath);
        return [];
    }

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

// eslint-disable-next-line qwik/loader-location
export const useGetSubregions = routeLoader$(async ({ params, resolveValue }) => {
    const nationPath = params.nation;
    const regionPath = params.region;
    const subregionPath = params.subregion;

    if (!nationPath || !regionPath || !subregionPath) return [];
    
    const regions = await resolveValue(useGetRegions);
    console.log('regions', regions)

    const normalizedRegionName = regionPath
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const regionData = regions.find((r: { name: string; }) => r.name === normalizedRegionName);

    const regionId = regionData?.id
    if (!regionId) {
        console.error('Región no encontrada:', regionPath);
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/regions/${regionId}/subregions`);
        if (!response.ok) {
            throw new Error('Error al obtener las subregiones');
        }
        const subregions = await response.json();
        return subregions;
    } catch (error) {
        console.error('Error al obtener las subregiones:', error);
        return [];
    }
}); 