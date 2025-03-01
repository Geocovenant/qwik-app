import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { PollType } from "~/constants/pollType";
import type { PollForm } from "~/schemas/pollSchema";
import { dataArray } from "~/data/countries";
import type { DebateForm } from "~/schemas/debateSchema";
import type { UserForm } from "~/schemas/userSchema";
import type { OpinionForm } from "~/schemas/opinionSchema";

// eslint-disable-next-line qwik/loader-location
export const useGetUser = routeLoader$(async ({ cookie }) => {
    const token = cookie.get('authjs.session-token')
    console.log('token', token)
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
export const useGetGlobalPolls = routeLoader$(async ({ cookie }) => {
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
            throw new Error('Error fetching global polls');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching global polls:', error);
        return [];
    }
})

// eslint-disable-next-line qwik/loader-location
export const useGetInternationalPolls = routeLoader$(async ({ cookie }) => {
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
            throw new Error('Error fetching international polls');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching international polls:', error);
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
        console.error('Country not found:', params.nation);
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
            throw new Error('Error fetching national polls');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching national polls:', error);
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

    const normalizedRegionName = params.region
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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
        console.error('Region not found:', params.region);
        return [];
    }

    // Normalize subregion name
    const normalizedSubregionName = params.subregion
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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

// eslint-disable-next-line qwik/loader-location
export const useGetGlobalDebates = routeLoader$(async ({ cookie }) => {
    console.log('============ useGetGlobalDebates ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates?type=GLOBAL`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching global debates');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching global debates:', error);
        return [];
    }
})

// eslint-disable-next-line qwik/loader-location
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
        id: string;
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

// eslint-disable-next-line qwik/loader-location
export const useGetInternationalDebates = routeLoader$(async ({ cookie }) => {
    console.log('============ useGetInternationalDebates ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates?type=INTERNATIONAL`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching international debates');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching international debates:', error);
        return [];
    }
})

// eslint-disable-next-line qwik/loader-location
export const useGetNationalDebates = routeLoader$(async ({ cookie, params }) => {
    console.log('============ useGetNationalDebates ============')
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return [];
    }

    const cca2 = getCountryCode(params.nation);
    if (!cca2) {
        console.error('Country not found:', params.nation);
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates?type=NATIONAL&country=${cca2}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching national debates');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching national debates:', error);
        return [];
    }
})

// eslint-disable-next-line qwik/loader-location
export const useGetRegionalDebates = routeLoader$(async ({ cookie, params, resolveValue }) => {
    console.log('============ useGetRegionalDebates ============')
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


// Helper function to get country code using countries.ts file
function getCountryCode(countryPath: string): string | null {
    if (!countryPath) return null
    
    // Normalize country name (remove accents, convert to lowercase)
    const normalizedPath = countryPath
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()

    // Find the country in the array of countries
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

// eslint-disable-next-line qwik/loader-location
export const useGetSubregions = routeLoader$(async ({ params, resolveValue }) => {
    const nationPath = params.nation;
    const regionPath = params.region;
    const subregionPath = params.subregion;

    if (!nationPath || !regionPath || !subregionPath) return [];
    
    const regions = await resolveValue(useGetRegions);

    const normalizedRegionName = regionPath
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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

// eslint-disable-next-line qwik/loader-location
export const useFormDebateLoader = routeLoader$<InitialValues<DebateForm>>(() => {
    return {
        community_ids: [],
        description: '',
        is_anonymous: false,
        scope: '',
        tags: [],
        title: '',
    };
}); 

// eslint-disable-next-line qwik/loader-location
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

// eslint-disable-next-line qwik/loader-location
export const useGetUserByUsername = routeLoader$(async ({ params }) => {
    const username = params.username;
    if (!username) return null;
    
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/${username}`);
    if (!response.ok) {
        throw new Error('Error fetching user by username');
    }
    const data = await response.json();
    return data;
});

// eslint-disable-next-line qwik/loader-location
export const useFormUserLoader = routeLoader$<InitialValues<UserForm>>(async ({ cookie }) => {
    const token = cookie.get('authjs.session-token');
    if (!token) {
        return {
            name: '',
            username: '',
            email: '',
            bio: '',
            location: '',
            website: '',
            gender: 'prefer-not-to-say',
            profileImage: '',
            coverImage: ''
        };
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/me`, {
            headers: {
                Accept: 'application/json',
                Authorization: token.value
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        
        return {
            name: userData.name || '',
            username: userData.username || '',
            email: userData.email || '',
            bio: userData.bio || '',
            location: userData.location || '',
            website: userData.website || '',
            gender: userData.gender || 'prefer-not-to-say',
            profileImage: userData.image || '',
            coverImage: userData.banner || ''
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            name: '',
            username: '',
            email: '',
            bio: '',
            location: '',
            website: '',
            gender: 'prefer-not-to-say',
            profileImage: '',
            coverImage: ''
        };
    }
});

// eslint-disable-next-line qwik/loader-location
export const useFormOpinionLoader = routeLoader$<InitialValues<OpinionForm>>(() => {
    return {
        opinion: '',
        country: '',
    };
});
