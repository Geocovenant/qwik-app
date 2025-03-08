import * as v from 'valibot';
import { PollType } from '~/constants/pollType';
import { _ } from 'compiled-i18n';

export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 5000;

export const PollSchema = v.object({
    community_ids: v.union([
        v.array(v.string()),
        v.string(),
    ]),
    description: v.pipe(
        v.string(),
        v.maxLength(
            MAX_DESCRIPTION_LENGTH,
            _`Your description must have ${MAX_DESCRIPTION_LENGTH} characters or less.`
        )
    ),
    ends_at: v.string(),
    is_anonymous: v.boolean(),
    options: v.pipe(
        v.array(
            v.pipe(
                v.string(),
                v.nonEmpty(_`Please enter a name for the option.`)
            )
        ),
        v.minLength(2, _`You must have at least 2 options.`),
        v.maxLength(10, _`You must have at most 10 options.`)
    ),
    scope: v.string(),
    tags: v.optional(v.array(v.string())),
    title: v.pipe(
        v.string(),
        v.nonEmpty(_`Please enter a title.`),
        v.minLength(5, _`The title must have 5 characters or more.`),
        v.maxLength(
            MAX_TITLE_LENGTH,
            _`The title must have ${MAX_TITLE_LENGTH} characters or less.`
        )
    ),
    type: v.enum(PollType),
});

export type PollForm = v.InferInput<typeof PollSchema>;
