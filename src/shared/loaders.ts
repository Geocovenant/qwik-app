import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import type { UserForm } from "~/schemas/userSchema";
import type { OpinionForm } from "~/schemas/opinionSchema";
import type { CommunityRequestForm } from "~/schemas/communityRequestSchema";
import { useGetRegions } from "./national/loaders";

export const useGetUser = routeLoader$(async ({ cookie }) => {
    const token = cookie.get('authjs.session-token')
    if (!token) {
        return null
    }
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/me`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token.value}`
        }
    })
    const data = await response.json()
    return data
})

export const useGetCommunityIdByName = routeLoader$(async ({ query }) => {
    const name = query.get('name');
    if (!name) {
        return null;
    }
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities?name=${name}`, {
        headers: {
            Accept: 'application/json',
        }
    });
    const data = await response.json();
    return data[0].id;
});

export const useGetRegionalPolls = routeLoader$(async ({ cookie, params, resolveValue }) => {
    console.log('============ useGetRegionalPolls ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }

    const regions = await resolveValue(useGetRegions);

    const normalizedRegionName = params.region
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const regionData = regions.find((r: { name: string; }) => r.name === normalizedRegionName);
    console.log('regionData', regionData)

    const regionId = regionData?.id
    if (!regionId) {
        console.error('Region not found:', params.region);
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
            throw new Error('Error fetching regional polls');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching regional polls:', error);
        return [];
    }
})

export const useGetSubregionalPolls = routeLoader$(async ({ cookie, params, resolveValue }) => {
    console.log('============ useGetSubregionalPolls ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }
    const regions = await resolveValue(useGetRegions);

    const normalizedRegionName = params.region
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const regionData = regions.find((r: { name: string; }) => r.name === normalizedRegionName);
    console.log('regionData', regionData)

    const regionId = regionData?.id
    if (!regionId) {
        console.error('Region not found:', params.region);
        return [];
    }

    // Normalize subregion name
    const normalizedSubregionName = params.subregion
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Fetch subregion data
    try {
        const subregionResponse = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/regions/${regionId}/subregions?name=${normalizedSubregionName}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!subregionResponse.ok) {
            throw new Error('Error fetching subregion data');
        }

        const subregionData = await subregionResponse.json();
        console.log('subregionData', subregionData);

        const subregionId = subregionData?.[0]?.id;
        if (!subregionId) {
            console.error('Subregion not found:', normalizedSubregionName);
            return [];
        }

        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls?scope=SUBREGIONAL&subregion=${subregionId}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching subregional polls');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching subregional polls:', error);
        return [];
    }
})

export const useGetDebateBySlug = routeLoader$(async ({ cookie, params }) => {
    console.log('============ useGetDebateBySlug ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return undefined;
    }
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates/${params.slug}`, {
        headers: {
            Accept: 'application/json',
            Authorization: token.value
        },
    });
    return (await response.json()) as {
        id: number;
        tags: Array<any>;
        type: string;
        title: string;
        slug: string;
        description: string;
        images: string[];
        public: boolean;
        status: string;
        views_count: number;
        likes_count: number;
        dislikes_count: number;
        last_comment_at: string;
        language: string;
        creator: {
            id: number;
            username: string;
            image: string;
        };
        points_of_view: Array<any>;
        created_at: string;
        updated_at: string;
    };
});

export const useGetRegionalDebates = routeLoader$(async ({ cookie, params, resolveValue }) => {
    console.log('============ useGetRegionalDebates ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }

    const regions = await resolveValue(useGetRegions);

    const normalizedRegionName = params.region
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const regionData = regions.find((r: { name: string; }) => r.name === normalizedRegionName);

    const regionId = regionData?.id
    if (!regionId) {
        console.error('Region not found:', params.region);
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates?type=REGIONAL&region=${regionId}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching regional polls');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching regional polls:', error);
        return [];
    }
})

export const useGetSubregions = routeLoader$(async ({ params, resolveValue }) => {
    const nationPath = params.nation;
    const regionPath = params.region;
    const subregionPath = params.subregion;

    if (!nationPath || !regionPath || !subregionPath) return [];

    const regions = await resolveValue(useGetRegions);

    const normalizedRegionName = regionPath
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const regionData = regions.find((r: { name: string; }) => r.name === normalizedRegionName);

    const regionId = regionData?.id
    if (!regionId) {
        console.error('Region not found:', regionPath);
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/regions/${regionId}/subregions`);
        if (!response.ok) {
            throw new Error('Error fetching subregions');
        }
        const subregions = await response.json();
        return subregions;
    } catch (error) {
        console.error('Error fetching subregions:', error);
        return [];
    }
});

export const useGetTags = routeLoader$(async ({ cookie }) => {
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/tags`, {
        headers: {
            Accept: 'application/json',
            Authorization: token.value
        },
    });
    return (await response.json()) as Array<{
        id: string;
        name: string;
    }>;
});

export const useGetUserByUsername = routeLoader$(async ({ cookie, params }) => {
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return undefined;
    }
    const username = params.username;
    if (!username) return null;

    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/${username}`, {
        headers: {
            Accept: 'application/json',
            Authorization: token.value
        },
    });
    if (!response.ok) {
        throw new Error('Error fetching user by username');
    }
    const data = await response.json();
    return data;
});

export const useFormUserLoader = routeLoader$<InitialValues<UserForm>>(async ({ resolveValue }) => {
    const user = await resolveValue(useGetUserByUsername);
    return {
        bio: user.bio || '',
        coverImage: user.cover || '',
        gender: user.gender || '',
        image: user.image || '',
        name: user.name || '',
        website: user.website || '',
    };
});

// eslint-disable-next-line qwik/loader-location
export const useFormOpinionLoader = routeLoader$<InitialValues<OpinionForm>>(async ({ resolveValue }) => {
    const debate = await resolveValue(useGetDebateBySlug)
    return {
        debate_id: debate?.id,
        opinion: '',
        country: '',
        region_id: '',
    };
});

export const useGetPollBySlug = routeLoader$(async ({ cookie, params }) => {
    console.log('============ useGetPollBySlug ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return undefined;
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls/${params.slug}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            },
        });

        if (!response.ok) {
            console.error('Error fetching poll details:', response.statusText);
            return undefined;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching poll details:', error);
        return undefined;
    }
});

export const useGetRegionalProjects = routeLoader$(async ({ params }) => {
    const regionId = params.region;
    if (!regionId) return [];
    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/projects?scope=REGIONAL&region=${regionId}`, {
            headers: {
                Accept: 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching regional projects:', error);
        return [];
    }
});

// eslint-disable-next-line qwik/loader-location
export const useGetRegionalIssues = routeLoader$(async ({ params }) => {
    const regionId = params.region;
    if (!regionId) return [];
    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/issues?scope=REGIONAL&region=${regionId}`, {
            headers: {
                Accept: 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching regional issues:', error);
        return [];
    }
});

export const useGetSubregionalDebates = routeLoader$(async ({ cookie, params, resolveValue }) => {
    console.log('============ useGetSubregionalDebates ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }

    // Obtener primero el region ID
    const regions = await resolveValue(useGetRegions);
    const normalizedRegionName = params.region
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const regionData = regions.find((r: { name: string; }) => r.name === normalizedRegionName);
    const regionId = regionData?.id;

    if (!regionId) {
        console.error('Region not found:', params.region);
        return [];
    }

    // Ahora obtener el subregion ID
    const normalizedSubregionName = params.subregion
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    try {
        const subregionResponse = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/regions/${regionId}/subregions?name=${normalizedSubregionName}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!subregionResponse.ok) {
            throw new Error('Error fetching subregion data');
        }

        const subregionData = await subregionResponse.json();
        const subregionId = subregionData?.[0]?.id;

        if (!subregionId) {
            console.error('Subregion not found:', normalizedSubregionName);
            return [];
        }

        // Finalmente, obtener los debates de la subregión
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates?type=SUBREGIONAL&subregion=${subregionId}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching subregional debates');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching subregional debates:', error);
        return [];
    }
});

export const useGetSubregionalProjects = routeLoader$(async ({ cookie, params, resolveValue }) => {
    console.log('============ useGetSubregionalProjects ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }

    // Obtener primero el region ID
    const regions = await resolveValue(useGetRegions);
    const normalizedRegionName = params.region
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const regionData = regions.find((r: { name: string; }) => r.name === normalizedRegionName);
    const regionId = regionData?.id;

    if (!regionId) {
        console.error('Region not found:', params.region);
        return [];
    }

    // Ahora obtener el subregion ID
    const normalizedSubregionName = params.subregion
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    try {
        const subregionResponse = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/regions/${regionId}/subregions?name=${normalizedSubregionName}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!subregionResponse.ok) {
            throw new Error('Error fetching subregion data');
        }

        const subregionData = await subregionResponse.json();
        const subregionId = subregionData?.[0]?.id;

        if (!subregionId) {
            console.error('Subregion not found:', normalizedSubregionName);
            return [];
        }

        // Finalmente, obtener los proyectos de la subregión
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/projects?scope=SUBREGIONAL&subregion=${subregionId}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching subregional projects');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching subregional projects:', error);
        return [];
    }
});

export const useGetSubregionalIssues = routeLoader$(async ({ cookie, params, resolveValue }) => {
    console.log('============ useGetSubregionalIssues ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }

    // Obtener primero el region ID
    const regions = await resolveValue(useGetRegions);
    const normalizedRegionName = params.region
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    const regionData = regions.find((r: { name: string; }) => r.name === normalizedRegionName);
    const regionId = regionData?.id;

    if (!regionId) {
        console.error('Region not found:', params.region);
        return [];
    }

    // Ahora obtener el subregion ID
    const normalizedSubregionName = params.subregion
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    try {
        const subregionResponse = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/regions/${regionId}/subregions?name=${normalizedSubregionName}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!subregionResponse.ok) {
            throw new Error('Error fetching subregion data');
        }

        const subregionData = await subregionResponse.json();
        const subregionId = subregionData?.[0]?.id;

        if (!subregionId) {
            console.error('Subregion not found:', normalizedSubregionName);
            return [];
        }

        // Finalmente, obtener los issues de la subregión
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/issues?scope=SUBREGIONAL&subregion=${subregionId}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching subregional issues');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching subregional issues:', error);
        return [];
    }
});

export const useGetCountryDivisions = routeLoader$(async ({ cookie, resolveValue }) => {
    console.log('============ useGetCountryDivisions ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }

    // Obtener el debate
    const debate = await resolveValue(useGetDebateBySlug);

    // Necesitamos extraer el código de país de forma segura
    let countryCode = null;

    if (debate) {
        // Corregir el acceso a country_code
        if (debate.tags && debate.tags.some(tag => tag.country_code)) {
            countryCode = debate.tags.find(tag => tag.country_code)?.country_code;
        } else {
            // Usar un valor predeterminado
            countryCode = "US";
        }
    }

    if (!countryCode) {
        console.error('Country code not found', countryCode);
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/countries/${countryCode}/divisions`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

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

export const useCheckCommunityMembership = routeLoader$(async ({ cookie, params }) => {
    console.log('============ useCheckCommunityMembership ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return { isMember: false };
    }

    // Obtener el ID de la comunidad
    const communityId = params.communityId || params.id;
    if (!communityId) {
        console.error('Community ID not provided');
        return { isMember: false };
    }

    try {
        // Usamos el endpoint de miembros y verificamos si el usuario actual está
        // incluido en los resultados, lo que indicaría que es miembro
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/${communityId}/members?size=1`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            return { isMember: false };
        }

        const data = await response.json();
        // Si hay al menos un miembro y ese miembro es el usuario actual
        const isMember = data.items.some((member: any) => member.is_current_user);

        return { isMember };
    } catch (error) {
        console.error('Error checking community membership:', error);
        return { isMember: false };
    }
});

export const useGetLocalityPolls = routeLoader$(async ({ params, query, cookie }) => {
    console.log('============ useGetLocalityPolls ============');
    const page = query.get('page') || '1';
    const size = query.get('size') || '10';
    const nationParam = params.nation;
    const regionParam = params.region;
    const subregionParam = params.subregion;
    const localityParam = params.locality;
    
    if (!nationParam || !regionParam || !subregionParam || !localityParam) {
        console.error('Missing required parameters for locality polls');
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
    
    const token = cookie.get('authjs.session-token');
    
    try {
        let url = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls?scope=LOCALITY`;
        url += `&locality=${localityParam}&page=${page}&size=${size}`;
        
        const headers: Record<string, string> = {
            Accept: 'application/json',
        };
        
        if (token) {
            headers.Authorization = token.value;
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error('Error fetching locality polls');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching locality polls:', error);
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
});

// Loader para obtener debates a nivel de localidad
export const useGetLocalityDebates = routeLoader$(async ({ params, query, cookie }) => {
    console.log('============ useGetLocalityDebates ============');
    const page = query.get('page') || '1';
    const size = query.get('size') || '10';
    const nationParam = params.nation;
    const regionParam = params.region;
    const subregionParam = params.subregion;
    const localityParam = params.locality;
    
    if (!nationParam || !regionParam || !subregionParam || !localityParam) {
        console.error('Missing required parameters for locality debates');
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
    
    const token = cookie.get('authjs.session-token');
    
    try {
        let url = `${import.meta.env.PUBLIC_API_URL}/api/v1/debates?scope=LOCALITY`;
        url += `&locality=${localityParam}&page=${page}&size=${size}`;
        
        const headers: Record<string, string> = {
            Accept: 'application/json',
        };
        
        if (token) {
            headers.Authorization = token.value;
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error('Error fetching locality debates');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching locality debates:', error);
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
});

// Loader para obtener proyectos a nivel de localidad
export const useGetLocalityProjects = routeLoader$(async ({ params, query, cookie }) => {
    console.log('============ useGetLocalityProjects ============');
    const page = query.get('page') || '1';
    const size = query.get('size') || '10';
    const nationParam = params.nation;
    const regionParam = params.region;
    const subregionParam = params.subregion;
    const localityParam = params.locality;
    
    if (!nationParam || !regionParam || !subregionParam || !localityParam) {
        console.error('Missing required parameters for locality projects');
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
    
    const token = cookie.get('authjs.session-token');
    
    try {
        let url = `${import.meta.env.PUBLIC_API_URL}/api/v1/projects?scope=LOCALITY`;
        url += `&locality=${localityParam}&page=${page}&size=${size}`;
        
        const headers: Record<string, string> = {
            Accept: 'application/json',
        };
        
        if (token) {
            headers.Authorization = token.value;
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error('Error fetching locality projects');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching locality projects:', error);
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
});

// Loader para obtener problemas reportados a nivel de localidad
export const useGetLocalityIssues = routeLoader$(async ({ params, query, cookie }) => {
    console.log('============ useGetLocalityIssues ============');
    const page = query.get('page') || '1';
    const size = query.get('size') || '10';
    const nationParam = params.nation;
    const regionParam = params.region;
    const subregionParam = params.subregion;
    const localityParam = params.locality;
    
    if (!nationParam || !regionParam || !subregionParam || !localityParam) {
        console.error('Missing required parameters for locality issues');
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
    
    const token = cookie.get('authjs.session-token');
    
    try {
        let url = `${import.meta.env.PUBLIC_API_URL}/api/v1/issues?scope=LOCALITY`;
        url += `&locality=${localityParam}&page=${page}&size=${size}`;
        
        const headers: Record<string, string> = {
            Accept: 'application/json',
        };
        
        if (token) {
            headers.Authorization = token.value;
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error('Error fetching locality issues');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching locality issues:', error);
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
});

export const useFormCommunityRequestLoader = routeLoader$<InitialValues<CommunityRequestForm>>(() => {
    return {
        country: "",
        region: "",
        city: "",
        email: ""
    };
});
