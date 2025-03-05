import * as v from 'valibot';

export const UserSchema = v.object({
  bio: v.optional(v.pipe(
    v.string(),
    v.maxLength(500, "Bio cannot exceed 500 characters")
  )),
  coverImage: v.optional(v.string()),
  gender: v.optional(v.string()),
  image: v.optional(v.string()),
  name: v.pipe(
    v.string(),
    v.minLength(2, "Name must have at least 2 characters"),
    v.maxLength(50, "Name cannot exceed 50 characters")
  ),
  website: v.optional(v.pipe(
    v.string(),
    v.maxLength(200, "Website URL cannot exceed 200 characters")
  )),
});

export type UserForm = v.InferInput<typeof UserSchema>;