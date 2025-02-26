import { formAction$, valiForm$ } from '@modular-forms/qwik';
import type { PollForm } from '~/schemas/pollSchema';
import { PollSchema } from '~/schemas/pollSchema';
import { _ } from 'compiled-i18n';
import { routeAction$ } from '@builder.io/qwik-city';
import { CommunityType } from '~/constants/communityType';

export interface PollResponseData {
    success: boolean; // Indica si la operación fue exitosa
    message: string; // Mensaje de respuesta (ej. "Poll shared successfully")
    data?: {
        poll_id: string; // ID de la encuesta compartida
        share_link: string; // Link generado para compartir
        timestamp?: string; // Opcional: Hora/fecha en que se compartió
    };
}

export const useFormPollAction = formAction$<PollForm, PollResponseData>(
    async (values, event) => {
        console.log('############ useFormPollAction ############');
        console.log('values', values);

        const token = event.cookie.get('authjs.session-token')?.value;

        // Preparar payload según el scope
        const payload = {
            title: values.title,
            description: values.description,
            type: values.type,
            options: values.options.map(o => ({ text: o })),
            is_anonymous: values.is_anonymous,
            scope: values.scope,
            ends_at: values.ends_at !== '' ? values.ends_at : null,
        };

        // Añadir los campos específicos según el scope
        switch (values.scope) {
            case CommunityType.GLOBAL:
                Object.assign(payload, { community_ids: [1] });
                break;
            case CommunityType.INTERNATIONAL:
                Object.assign(payload, { country_codes: values.community_ids });
                break;
            case CommunityType.NATIONAL:
                Object.assign(payload, { country_code: values.community_ids[0] });
                break;
            case CommunityType.REGIONAL:
                Object.assign(payload, { region_id: values.community_ids[0] });
                break;
            case CommunityType.SUBREGIONAL:
                Object.assign(payload, { subregion_id: values.community_ids[0] });
                break;
            // Para GLOBAL no necesitamos añadir campos adicionales
        }

        console.log('payload', payload);

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            // Verificar si la respuesta es correcta, de lo contrario lanzar un error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create poll');
            }

            const data = await response.json();

            return {
                success: true,
                message: _`Poll created successfully`,
                data: data,
            };
        } catch (error: any) {
            console.error('Error in useFormPollAction:', error);
            return {
                success: false,
                message: error.message || 'An unexpected error occurred',
            };
        }
    },
    valiForm$(PollSchema)
);

// eslint-disable-next-line qwik/loader-location
export const useVotePoll = routeAction$(
    async (data, { cookie }) => {
        console.log('### useVotePoll ###')
        const token = cookie.get('authjs.session-token')?.value;
        console.log('token', token)
        const { pollId } = data
        console.log('data: ', data)
        const payload = { option_ids: data.optionIds }
        console.log('payload', payload)
        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls/${pollId}/vote`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            return (await response.json());
        } catch (err) {
            console.error('err', err)
            return err
        }
    }
)

// eslint-disable-next-line qwik/loader-location
export const useReactPoll = routeAction$(
    async (data, { cookie }) => {
        console.log('### useReactPoll ###')
        console.log('data', data)
        const token = cookie.get('authjs.session-token')?.value;
        const payload = { reaction: data.reaction }
        console.log('payload', payload)
        
        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/v1/polls/${data.pollId}/react`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            return (await response.json());
        } catch (err) {
            console.error('err', err)
            return err
        }
    }
)