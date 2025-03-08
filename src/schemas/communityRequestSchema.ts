import * as v from 'valibot';

export const CommunityRequestSchema = v.object({
  country: v.string(),
  region: v.string(),
  city: v.string(),
  email: v.string()
});

export type CommunityRequestForm = v.InferInput<typeof CommunityRequestSchema>; 