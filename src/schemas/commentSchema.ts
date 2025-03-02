import { minLength, object, pipe, string } from "valibot";
import { _ } from 'compiled-i18n';

export const CommentSchema = object({
  pollId: string(),
  text: pipe(
    string(),
    minLength(1, _`El comentario no puede estar vacío`),
    minLength(3, _`El comentario debe tener al menos 3 caracteres`)
  ),
});

export type CommentForm = {
  pollId: string;
  text: string;
}; 