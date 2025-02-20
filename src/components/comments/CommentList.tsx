import { component$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { type Comment } from "~/shared/types";

interface CommentListProps {
    comments: Comment[];
}

export default component$<CommentListProps>(({ comments }) => {
    return (
        <div class="space-y-4 max-h-[400px] overflow-y-auto">
            {comments.length > 0 ? (
                <ul class="space-y-4">
                    {comments.map((comment) => (
                        <li key={comment.id} class="bg-poll-option-bg rounded-lg p-4">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-medium text-text-primary">
                                    {comment.author_username}
                                </span>
                                <span class="text-sm text-text-secondary">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p class="text-text-primary">{comment.content}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p class="text-center text-text-secondary">{_`No comments yet`}</p>
            )}
        </div>
    );
}); 