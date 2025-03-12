import { minLength, object, pipe, string } from "valibot";
import { _ } from 'compiled-i18n';

export const CommentProjectSchema = object({
  projectId: string(),
  text: pipe(
    string(),
    minLength(1, _("The comment cannot be empty")),
    minLength(3, _("The comment must be at least 3 characters long"))
  ),
});

export type CommentProjectForm = {
  projectId: string;
  text: string;
}; 

export interface CommentProjectResponseData {
  success: boolean;
  message: string;
  data?: {
    comment_id: string;
  };
}