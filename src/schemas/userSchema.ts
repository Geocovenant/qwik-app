import { email, maxLength, minLength, object, optional, string, type Output } from "valibot";

export const UserSchema = object({
  name: string([
    minLength(2, "Name must have at least 2 characters"),
    maxLength(50, "Name cannot exceed 50 characters")
  ]),
  username: string([
    minLength(3, "Username must have at least 3 characters"),
    maxLength(30, "Username cannot exceed 30 characters")
  ]),
  email: string([
    minLength(1, "Email is required"),
    email("Please enter a valid email")
  ]),
  bio: optional(string([
    maxLength(500, "Bio cannot exceed 500 characters")
  ])),
  location: optional(string([
    maxLength(100, "Location cannot exceed 100 characters")
  ])),
  website: optional(string([
    maxLength(200, "Website URL cannot exceed 200 characters")
  ])),
  gender: optional(string()),
  profileImage: optional(string()),
  coverImage: optional(string())
});

export type UserForm = Output<typeof UserSchema>; 