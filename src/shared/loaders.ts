import { routeLoader$ } from "@builder.io/qwik-city";

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