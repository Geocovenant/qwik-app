import { $, component$, useSignal } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { LuReply } from "@qwikest/icons/lucide";
import { timeAgo } from "~/utils/dateUtils";
import { Avatar } from "../ui";

interface Comment {
  id: number;
  user_id: number;
  poll_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  username: string;
  can_edit: boolean | null;
  replies?: Comment[];
}

interface CommentsListProps {
  comments: Comment[];
}

export default component$<CommentsListProps>(({ comments }) => {
  const expandedReplies = useSignal<number[]>([]);
  
  const toggleReplies = $(async (commentId: number) => {
    if (expandedReplies.value.includes(commentId)) {
      expandedReplies.value = expandedReplies.value.filter(id => id !== commentId);
    } else {
      expandedReplies.value = [...expandedReplies.value, commentId];
    }
  });

  return (
    <div class="comments-container space-y-4 w-full">
      {comments.length === 0 ? (
        <div class="text-center py-6">
          <p class="text-gray-500 dark:text-gray-400">{_`No hay comentarios aún. ¡Sé el primero en comentar!`}</p>
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} class="comment-item bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="flex items-start gap-3">
              <Avatar.Root>
                <Avatar.Image 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`} 
                  alt={comment.username} 
                  class="w-10 h-10 rounded-full"
                />
              </Avatar.Root>
              
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <span class="font-medium text-gray-900 dark:text-white">
                    {comment.username}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {timeAgo(new Date(comment.created_at))}
                  </span>
                </div>
                
                <p class="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                  {comment.content}
                </p>
                
                <div class="flex items-center gap-4 mt-3">
                  {comment.replies && comment.replies.length > 0 && (
                    <button 
                      onClick$={() => toggleReplies(comment.id)}
                      class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <LuReply class="w-4 h-4" />
                      <span>{comment.replies.length} {_`respuestas`}</span>
                    </button>
                  )}
                </div>
                
                {comment.replies && comment.replies.length > 0 && expandedReplies.value.includes(comment.id) && (
                  <div class="mt-3 pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} class="reply-item">
                        <div class="flex items-start gap-2">
                          <Avatar.Root>
                            <Avatar.Image 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.username}`}
                              alt={reply.username}
                              class="w-8 h-8 rounded-full"
                            />
                          </Avatar.Root>
                          
                          <div class="flex-1 min-w-0">
                            <div class="flex flex-wrap items-center gap-2 mb-1">
                              <span class="font-medium text-gray-900 dark:text-white">
                                {reply.username}
                              </span>
                              <span class="text-xs text-gray-500 dark:text-gray-400">
                                {timeAgo(new Date(reply.created_at))}
                              </span>
                            </div>
                            
                            <p class="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}); 