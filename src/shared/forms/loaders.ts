import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import type { PollForm } from "~/schemas/pollSchema";
import type { DebateForm } from "~/schemas/debateSchema";
import type { ProjectForm } from "~/schemas/projectSchema";
import type { ReportForm } from "~/schemas/reportSchema";
import type { IssueForm } from "~/schemas/issueSchema";
import { PollType } from "~/constants/pollType";
import { CommunityType } from "~/constants/communityType";

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
        // image: undefined,
        is_anonymous: false,
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

export const useFormIssueLoader = routeLoader$<InitialValues<IssueForm>>(() => {
    return {
        title: '',
        description: '',
        organization_name: '',
        status: 'OPEN',
        scope: CommunityType.NATIONAL,
        community_ids: [],
        is_anonymous: false,
        tags: []
    };
});

export const useFormReportLoader = routeLoader$<InitialValues<ReportForm>>((requestEvent) => {
    const itemId = parseInt(requestEvent.query.get('itemId') || '0');
    const itemType = requestEvent.query.get('itemType') || 'POLL';

    return {
        itemId: itemId,
        itemType: itemType as any,
        reason: 'INAPPROPRIATE',
        details: '',
    };
});