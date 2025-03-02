import { $, component$, useSignal, type QRL } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { LuArrowBigUp, LuArrowBigDown, LuReply } from "@qwikest/icons/lucide";
import { timeAgo } from "~/utils/dateUtils";
import { Avatar } from "../ui";

// Estructura basada en los datos reales de la API
interface Comment {
  id: number;
  user_id: number;
  poll_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  username: string;
  can_edit: boolean | null;
}

interface CommentsListProps {
  comments: Comment[];
  isAuthenticated: boolean;
  onShowLoginModal$: QRL<() => void>;
}

export default component$<CommentsListProps>(({ comments, isAuthenticated, onShowLoginModal$ }) => {
  const expandedReplies = useSignal<number[]>([]);
  
  const toggleReplies = $(async (commentId: number) => {
    if (expandedReplies.value.includes(commentId)) {
      expandedReplies.value = expandedReplies.value.filter(id => id !== commentId);
    } else {
      expandedReplies.value = [...expandedReplies.value, commentId];
    }
  });

  const handleReaction = $(async (commentId: number, reaction: "LIKE" | "DISLIKE") => {
    if (!isAuthenticated) {
      onShowLoginModal$();
      return;
    }
    
    // Aquí iría la lógica para reaccionar al comentario
    console.log("Reacción", commentId, reaction);
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
                  <button 
                    onClick$={() => handleReaction(comment.id, "LIKE")}
                    class={`flex items-center gap-1 text-sm ${comment.userReaction === "LIKE" 
                      ? "text-green-600 dark:text-green-400 font-medium" 
                      : "text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"}`}
                  >
                    <LuArrowBigUp class="w-4 h-4" />
                    <span>{comment.likesCount}</span>
                  </button>
                  
                  <button 
                    onClick$={() => handleReaction(comment.id, "DISLIKE")}
                    class={`flex items-center gap-1 text-sm ${comment.userReaction === "DISLIKE" 
                      ? "text-red-600 dark:text-red-400 font-medium" 
                      : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"}`}
                  >
                    <LuArrowBigDown class="w-4 h-4" />
                    <span>{comment.dislikesCount}</span>
                  </button>
                  
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
                              src={reply.user.image} 
                              alt={reply.user.username} 
                              class="w-8 h-8 rounded-full"
                            />
                          </Avatar.Root>
                          
                          <div class="flex-1 min-w-0">
                            <div class="flex flex-wrap items-center gap-2 mb-1">
                              <span class="font-medium text-gray-900 dark:text-white">
                                {reply.user.username}
                              </span>
                              <span class="text-xs text-gray-500 dark:text-gray-400">
                                {timeAgo(new Date(reply.created_at))}
                              </span>
                            </div>
                            
                            <p class="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                              {reply.text}
                            </p>
                            
                            <div class="flex items-center gap-4 mt-2">
                              <button 
                                onClick$={() => handleReaction(reply.id, "LIKE")}
                                class={`flex items-center gap-1 text-xs ${reply.userReaction === "LIKE" 
                                  ? "text-green-600 dark:text-green-400 font-medium" 
                                  : "text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"}`}
                              >
                                <LuArrowBigUp class="w-3 h-3" />
                                <span>{reply.likesCount}</span>
                              </button>
                              
                              <button 
                                onClick$={() => handleReaction(reply.id, "DISLIKE")}
                                class={`flex items-center gap-1 text-xs ${reply.userReaction === "DISLIKE" 
                                  ? "text-red-600 dark:text-red-400 font-medium" 
                                  : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"}`}
                              >
                                <LuArrowBigDown class="w-3 h-3" />
                                <span>{reply.dislikesCount}</span>
                              </button>
                            </div>
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