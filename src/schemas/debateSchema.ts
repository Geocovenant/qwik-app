import * as v from 'valibot';
import { _ } from 'compiled-i18n';
import type { NoSerialize } from '@builder.io/qwik';

const isBlob = (input: unknown) => input instanceof Blob;

export const MAX_TITLE_LENGTH = 150;
export const MAX_DESCRIPTION_LENGTH = 2000;

export const DebateSchema = v.object({
    community_ids: v.union([
        v.array(v.string()),
        v.string(),
    ]),
    description: v.pipe(
        v.string(),
        v.minLength(10, _`Your description must have at least 10 characters.`),
        v.maxLength(
            MAX_DESCRIPTION_LENGTH,
            _`Your description must have ${MAX_DESCRIPTION_LENGTH} characters or less.`
        )
    ),
    image: v.optional(v.custom<NoSerialize<Blob>>(isBlob)),
    is_anonymous: v.string(),
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
    )
});

export type DebateForm = v.InferInput<typeof DebateSchema>; 