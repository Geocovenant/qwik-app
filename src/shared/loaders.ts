import { routeLoader$ } from "@builder.io/qwik-city";
import { InitialValues } from "@modular-forms/qwik";
import { CommunityType } from "~/constants/communityType";
import { PollType } from "~/constants/pollType";
import { PollForm } from "~/schemas/pollSchema";

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
    console.log('data', data)
    return data
})

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
    console.log('data', data)
    return data
})

export const useFormPollLoader = routeLoader$<InitialValues<PollForm>>(({ pathname }) => {
    const segments = pathname.split('/').filter(Boolean);
    const communityType = segments[0];
    return {
        community_ids: communityType.toUpperCase() === CommunityType.GLOBAL ? ['1'] : [],
        description: '',
        endDate: '',
        is_anonymous: false,
        options: ['', ''],
        scope: communityType.toUpperCase(),
        type: PollType.Binary,
        tags: [],
        title: '',
    };
});