import * as v from 'valibot';

export const UserSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, "Name must have at least 2 characters"),
    v.maxLength(50, "Name cannot exceed 50 characters")
  ),
  username: v.pipe(
    v.string(),
    v.minLength(3, "Username must have at least 3 characters"),
    v.maxLength(30, "Username cannot exceed 30 characters")
  ),
  email: v.pipe(
    v.string(),
    v.minLength(1, "Email is required"),
    v.email("Please enter a valid email")
  ),
  bio: v.optional(v.pipe(
    v.string(),
    v.maxLength(500, "Bio cannot exceed 500 characters")
  )),
  location: v.optional(v.pipe(
    v.string(),
    v.maxLength(100, "Location cannot exceed 100 characters")
  )),
  website: v.optional(v.pipe(
    v.string(),
    v.maxLength(200, "Website URL cannot exceed 200 characters")
  )),
  gender: v.optional(v.string()),
  profileImage: v.optional(v.string()),
  coverImage: v.optional(v.string())
});

export type UserForm = v.InferInput<typeof UserSchema>;