import * as v from 'valibot';
import { _ } from 'compiled-i18n';

export const UserSchema = v.object({
  bio: v.optional(v.pipe(
    v.string(),
    v.maxLength(500, _`Bio cannot exceed 500 characters`)
  )),
  gender: v.optional(v.string()),
  name: v.pipe(
    v.string(),
    v.minLength(2, _`Name must have at least 2 characters`),
    v.maxLength(50, _`Name cannot exceed 50 characters`)
  ),
  website: v.optional(v.pipe(
    v.string(),
    v.maxLength(200, _`Website URL cannot exceed 200 characters`)
  )),
});

export type UserForm = v.InferInput<typeof UserSchema>;