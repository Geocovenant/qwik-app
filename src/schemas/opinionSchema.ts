import * as v from 'valibot';
import { _ } from 'compiled-i18n';

export const OpinionSchema = v.object({
    debate_id: v.number(),
    debate_type: v.string(),
    community_id: v.string(),
    opinion: v.pipe(
        v.string(),
        v.minLength(1, _`Opinion is required`)
    ),
});

export type OpinionForm = v.InferInput<typeof OpinionSchema>;