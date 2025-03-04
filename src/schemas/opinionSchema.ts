import * as v from 'valibot';
import { _ } from 'compiled-i18n';

export const OpinionSchema = v.object({
    debate_id: v.number(),
    opinion: v.pipe(
        v.string(),
        v.minLength(1, _`Opinion is required`)
    ),
    country: v.optional(v.string()),
    region_id: v.optional(v.string()),
});

export type OpinionForm = v.InferInput<typeof OpinionSchema>;