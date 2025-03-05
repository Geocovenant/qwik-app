import * as v from 'valibot';
import { _ } from 'compiled-i18n';

export const MAX_DETAILS_LENGTH = 1000;

// Define appropriate Enum objects
const REPORT_TYPE_ENUM = {
  POLL: 'POLL',
  DEBATE: 'DEBATE', 
  PROJECT: 'PROJECT', 
  ISSUE: 'ISSUE', 
  COMMENT: 'COMMENT', 
  USER: 'USER'
} as const;

const REPORT_REASON_ENUM = {
  INAPPROPRIATE: 'INAPPROPRIATE',
  SPAM: 'SPAM',
  HARMFUL: 'HARMFUL',
  MISINFORMATION: 'MISINFORMATION',
  HATE_SPEECH: 'HATE_SPEECH',
  SCAM: 'SCAM',
  FALSE_INFO: 'FALSE_INFO',
  DUPLICATED: 'DUPLICATED',
  FAKE: 'FAKE',
  OTHER: 'OTHER'
} as const;

// Schema for report validation
export const ReportSchema = v.object({
  itemType: v.enum(REPORT_TYPE_ENUM),
  itemId: v.pipe(
    v.number(),
    v.minValue(1, _`The item ID must be a positive number.`)
  ),
  reason: v.enum(REPORT_REASON_ENUM),
  details: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(MAX_DETAILS_LENGTH, _`Details cannot exceed ${MAX_DETAILS_LENGTH} characters.`)
    )
  ),
});

// Type definition based on the schema
export type ReportForm = {
  itemType: keyof typeof REPORT_TYPE_ENUM;
  itemId: number;
  reason: keyof typeof REPORT_REASON_ENUM;
  details?: string;
}; 