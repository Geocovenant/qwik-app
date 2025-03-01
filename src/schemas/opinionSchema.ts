import { _ } from 'compiled-i18n';
import * as v from 'valibot';

export const OpinionSchema = v.object({
    opinion: v.pipe(
        v.string(),
        v.minLength(1, _`El comentario no puede estar vacío`),
        v.maxLength(1000, _`El comentario no puede exceder los 1000 caracteres`)
    ),
    country: v.string()
});

export type OpinionForm = v.InferInput<typeof OpinionSchema>;