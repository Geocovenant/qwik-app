import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import type { UserForm } from "~/schemas/userSchema";
import type { OpinionForm } from "~/schemas/opinionSchema";
import type { CommunityRequestForm } from "~/schemas/communityRequestSchema";
import { useGetRegions } from "./national/loaders";

export const useGetUser = routeLoader$(async ({ cookie, redirect, url }) => {
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME)
    if (!token) {
        return {
            id: null,
            username: null,
            email: null,
            image: null,
            communities: null,
            bio: null,
            website: null,
            gender: null,
            last_login: null
        }
    }
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/me`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token.value}`
        }
    })
    const data = await response.json()
    if (data.id && !data.username) {
        if (url.pathname === '/onboarding/username/') {
            return data
        }
        throw redirect(302, '/onboarding/username')
    }
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
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME);
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
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls/?scope=REGIONAL&region=${regionId}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token.value}`
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching regional polls');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }
})

export const useGetDebateBySlug = routeLoader$(async ({ cookie, params }) => {
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME);
    if (!token) {
        return undefined;
    }
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates/${params.slug}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token.value}`
        },
    });
    return (await response.json()) as {
        communities: Array<any>;
        creator: {
            id: number;
            username: string;
            image: string;
        };
        created_at: string;
        description: string;
        dislikes_count: number;
        divisions: Array<any>;
        id: number;
        images: string[];
        language: string;
        last_comment_at: string;
        likes_count: number;
        points_of_view: Array<any>;
        public: boolean;
        slug: string;
        status: string;
        tags: Array<any>;
        title: string;
        type: string;
        updated_at: string;
        views_count: number;
    };
});

export const useGetRegionalDebates = routeLoader$(async ({ cookie, params, resolveValue }) => {
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME);
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
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/debates/?type=REGIONAL&region=${regionId}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token.value}`
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching regional polls');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }
})

export const useGetTags = routeLoader$(async ({ cookie }) => {
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME);
    if (!token) {
        return [];
    }
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/tags`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token.value}`
        },
    });
    return (await response.json()) as Array<{
        id: string;
        name: string;
    }>;
});

export const useGetUserByUsername = routeLoader$(async ({ cookie, params }) => {
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME);
    if (!token) {
        return {
            id: null,
            username: null,
            email: null,
            image: null,
            communities: null,
            bio: null,
            website: null,
            gender: null,
            last_login: null
        };
    }
    const username = params.username;
    if (!username) return null;

    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/users/${username}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token.value}`
        },
    });
    if (!response.ok) {
        return null;
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
        debate_type: debate?.type,
        community_id: '',
        opinion: '',
    };
});

export const useGetPollBySlug = routeLoader$(async ({ cookie, params }) => {
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME);
    if (!token) {
        return undefined;
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls/${params.slug}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token.value}`
            },
        });

        if (!response.ok) {
            return undefined;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return undefined;
    }
});

export const useGetCountryDivisions = routeLoader$(async ({ cookie, resolveValue }) => {
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME);
    if (!token) {
        return [];
    }

    // Get the debate
    const debate = await resolveValue(useGetDebateBySlug);

    // We need to safely extract the country code
    let countryCode = null;

    if (debate) {
        // Correct access to country_code
        if (debate.tags.some(tag => tag.country_code)) {
            countryCode = debate.tags.find(tag => tag.country_code)?.country_code;
        } else {
            // Use a default value
            countryCode = "US";
        }
    }

    if (!countryCode) {
        return [];
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/countries/${countryCode}/divisions`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token.value}`
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching country divisions');
        }

        const divisions = await response.json();
        return divisions;
    } catch (error) {
        return [];
    }
});

export const useCheckCommunityMembership = routeLoader$(async ({ cookie, params }) => {
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME);
    if (!token) {
        return { isMember: false };
    }

    // Get the community ID
    const communityId = params.communityId || params.id;
    if (!communityId) {
        return { isMember: false };
    }

    try {
        // We use the members endpoint and check if the current user is
        // included in the results, which would indicate that they are a member
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/communities/${communityId}/members?size=1`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token.value}`
            }
        });

        if (!response.ok) {
            return { isMember: false };
        }

        const data = await response.json();
        // If there is at least one member and that member is the current user
        const isMember = data.items.some((member: any) => member.is_current_user);

        return { isMember };
    } catch (error) {
        return { isMember: false };
    }
});

export const useGetLocalityPolls = routeLoader$(async ({ params, query, cookie }) => {
    const page = query.get('page') || '1';
    const size = query.get('size') || '10';
    const nationParam = params.nation;
    const regionParam = params.region;
    const subregionParam = params.subregion;
    const localityParam = params.locality;
    
    if (!nationParam || !regionParam || !subregionParam || !localityParam) {
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
    
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME);
    
    try {
        let url = `${import.meta.env.PUBLIC_API_URL}/api/v1/polls/?scope=LOCALITY`;
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
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
});

// Loader to get debates at the locality level
export const useGetLocalityDebates = routeLoader$(async ({ params, query, cookie }) => {
    const page = query.get('page') || '1';
    const size = query.get('size') || '10';
    const nationParam = params.nation;
    const regionParam = params.region;
    const subregionParam = params.subregion;
    const localityParam = params.locality;
    
    if (!nationParam || !regionParam || !subregionParam || !localityParam) {
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
    
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME);
    
    try {
        let url = `${import.meta.env.PUBLIC_API_URL}/api/v1/debates/?scope=LOCALITY`;
        url += `&locality=${localityParam}&page=${page}&size=${size}`;
        
        const headers: Record<string, string> = {
            Accept: 'application/json',
        };
        
        if (token) {
            headers.Authorization = `Bearer ${token.value}`;
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error('Error fetching locality debates');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
});

// Loader to get projects at the locality level
export const useGetLocalityProjects = routeLoader$(async ({ params, query, cookie }) => {
    const page = query.get('page') || '1';
    const size = query.get('size') || '10';
    const nationParam = params.nation;
    const regionParam = params.region;
    const subregionParam = params.subregion;
    const localityParam = params.locality;
    
    if (!nationParam || !regionParam || !subregionParam || !localityParam) {
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
    
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME);
    
    try {
        let url = `${import.meta.env.PUBLIC_API_URL}/api/v1/projects?scope=LOCALITY`;
        url += `&locality=${localityParam}&page=${page}&size=${size}`;
        
        const headers: Record<string, string> = {
            Accept: 'application/json',
        };
        
        if (token) {
            headers.Authorization = `Bearer ${token.value}`;
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error('Error fetching locality projects');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
});

// Loader to get reported issues at the locality level
export const useGetLocalityIssues = routeLoader$(async ({ params, query, cookie }) => {
    const page = query.get('page') || '1';
    const size = query.get('size') || '10';
    const nationParam = params.nation;
    const regionParam = params.region;
    const subregionParam = params.subregion;
    const localityParam = params.locality;
    
    if (!nationParam || !regionParam || !subregionParam || !localityParam) {
        return { items: [], total: 0, page: 1, size: 10, pages: 1 };
    }
    
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME);
    
    try {
        let url = `${import.meta.env.PUBLIC_API_URL}/api/v1/issues?scope=LOCALITY`;
        url += `&locality=${localityParam}&page=${page}&size=${size}`;
        
        const headers: Record<string, string> = {
            Accept: 'application/json',
        };
        
        if (token) {
            headers.Authorization = `Bearer ${token.value}`;
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error('Error fetching locality issues');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
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

export const useGetProjectBySlug = routeLoader$(async ({ cookie, params }) => {
    const token = cookie.get(import.meta.env.PUBLIC_AUTH_COOKIE_NAME)
    if (!token) {
        return undefined
    }

    try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/projects/${params.slug}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token.value}`
            },
        })

        if (!response.ok) {
            return undefined
        }

        const data = await response.json()
        return {
            ...data,
            is_creator: data.creator?.id === data.current_user_id
        }
    } catch (error) {
        return undefined
    }
})
