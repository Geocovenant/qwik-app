import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import type { PollForm } from "~/schemas/pollSchema";
import type { DebateForm } from "~/schemas/debateSchema";
import type { ProjectForm } from "~/schemas/projectSchema";
import { PollType } from "~/constants/pollType";

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

export const useFormDebateLoader = routeLoader$<InitialValues<DebateForm>>(() => {
    return {
        community_ids: [],
        description: '',
        image: undefined,
        is_anonymous: 'off',
        scope: '',
        tags: [],
        title: '',
    };
});

export const useFormProjectLoader = routeLoader$<InitialValues<ProjectForm>>(() => {
    return {
        scope: '',
        community_ids: [],
        title: '',
        description: '',
        status: 'DRAFT',
        goal_amount: 0,
        tags: [],
        is_anonymous: false,
        steps: [
            {
                title: '',
                description: '',
                order: 0,
                status: 'PENDING',
                resources: []
            }
        ]
    };
});