import { $, component$, useSignal, useStore } from "@builder.io/qwik"
import type { QRL } from "@builder.io/qwik"
import { _ } from "compiled-i18n"
import { LuArrowBigDown, LuArrowBigUp, LuCalendar, LuFlag, LuTrash2 } from "@qwikest/icons/lucide"
import { Avatar } from "~/components/ui"
import { formatDateISO } from "~/utils/formatDateISO"
import Modal from "~/components/Modal"
import FormReport from "~/components/forms/FormReport"
import ConfirmationModal from "~/components/ConfirmationModal"
import { useReactOpinion, useDeleteOpinion } from "~/shared/actions"

export interface OpinionProps {
  opinion: {
    id: number
    content: string
    created_at: string
    user: {
      id: number
      username: string
      image: string | null
    }
    upvotes: number
    downvotes: number
    updated_at?: string | null
    score?: number
    user_vote?: number | null
  }
  isAuthenticated: boolean
  currentUsername?: string
  onShowLoginModal$: QRL<() => void>
}

export default component$<OpinionProps>(({
  opinion,
  isAuthenticated,
  currentUsername = "",
  onShowLoginModal$
}) => {
  const showReportModal = useSignal(false)
  const showConfirmDeleteModal = useSignal(false)
  const actionReactOpinion = useReactOpinion()
  const actionDeleteOpinion = useDeleteOpinion()
  
  // Determine if the user is the creator of the opinion
  const isCreator = currentUsername === opinion.user.username
  
  // Initialize the reaction state based on user_vote
  const getUserReactionFromVote = (userVote: number | null | undefined) => {
    if (userVote === 1) return "LIKE"
    if (userVote === -1) return "DISLIKE"
    return null
  }
  
  const reactionState = useStore({
    userReaction: getUserReactionFromVote(opinion.user_vote),
    upvotes: opinion.upvotes,
    downvotes: opinion.downvotes
  })

  const handleReaction = $(async (newReaction: "LIKE" | "DISLIKE") => {
    if (!isAuthenticated) {
      onShowLoginModal$()
      return
    }

    const previousReaction = reactionState.userReaction

    // Optimistic update
    if (newReaction === previousReaction) {
      // If the same reaction is clicked, it is removed
      reactionState.userReaction = null
      if (newReaction === "LIKE") {
        reactionState.upvotes--
      } else {
        reactionState.downvotes--
      }
    } else {
      // If the reaction is changed or a new one is added
      reactionState.userReaction = newReaction

      if (previousReaction === "LIKE") {
        reactionState.upvotes--;
      } else if (previousReaction === "DISLIKE") {
        reactionState.downvotes--;
      }

      if (newReaction === "LIKE") {
        reactionState.upvotes++;
      } else {
        reactionState.downvotes++;
      }
    }

    // Call the API to save the reaction
    const result = await actionReactOpinion.submit({
      opinionId: opinion.id,
      reaction: newReaction,
    });
    
    // If there is an error, revert the changes
    if (!result.value?.success) {
      reactionState.userReaction = previousReaction;
      
      // Restore original counters
      reactionState.upvotes = opinion.upvotes;
      reactionState.downvotes = opinion.downvotes;
      
      // Apply the previous state
      if (previousReaction === "LIKE") {
        reactionState.upvotes++;
      } else if (previousReaction === "DISLIKE") {
        reactionState.downvotes++;
      }
    }
  })
  
  const handleDelete = $(async () => {
    console.log('handleDelete')
    const result = await actionDeleteOpinion.submit({
      opinionId: opinion.id
    });
    
    if (result.value?.success) {
      // The deletion will be handled in the parent component
      showConfirmDeleteModal.value = false;
    }
  })

  return (
    <div class="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
      <div class="flex items-center gap-3 mb-4">
        <Avatar.Root class="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900/30">
          <Avatar.Image src={opinion.user.image || ""} alt={opinion.user.username} />
          <Avatar.Fallback class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            {opinion.user.username.charAt(0).toUpperCase()}
          </Avatar.Fallback>
        </Avatar.Root>
        <div>
          <span class="font-medium text-gray-900 dark:text-white text-sm">{opinion.user.username}</span>
          <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <LuCalendar class="w-3 h-3" />
            {formatDateISO(opinion.created_at)}
          </p>
        </div>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-700/50">
        {opinion.content}
      </div>
      <div class="flex items-center gap-6 mt-4">
        <button
          class={`flex items-center gap-2 transition-colors duration-200 ${
            reactionState.userReaction === "LIKE" 
              ? "text-green-600 dark:text-green-400" 
              : "text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
          }`}
          onClick$={() => handleReaction("LIKE")}
        >
          <LuArrowBigUp class="w-5 h-5" />
          <span class="text-sm font-medium">{reactionState.upvotes}</span>
        </button>
        <button
          class={`flex items-center gap-2 transition-colors duration-200 ${
            reactionState.userReaction === "DISLIKE" 
              ? "text-red-600 dark:text-red-400" 
              : "text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
          }`}
          onClick$={() => handleReaction("DISLIKE")}
        >
          <LuArrowBigDown class="w-5 h-5" />
          <span class="text-sm font-medium">{reactionState.downvotes}</span>
        </button>
        
        {/* Conditional button: Delete for the creator, Report for other users */}
        {isAuthenticated && (
          isCreator ? (
            <button 
              class="ml-auto text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
              onClick$={() => showConfirmDeleteModal.value = true}
            >
              <LuTrash2 class="w-4 h-4" />
            </button>
          ) : (
            <button 
              class="ml-auto text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200"
              onClick$={() => showReportModal.value = true}
            >
              <LuFlag class="w-4 h-4" />
            </button>
          )
        )}
      </div>
      
      {/* Report modal for this opinion */}
      <Modal
        title={_`Report opinion`}
        show={showReportModal}
      >
        <FormReport 
          type="COMMENT" 
          itemId={opinion.id} 
        />
      </Modal>
      
      {/* Confirmation modal for deleting opinion */}
      <ConfirmationModal
        title={_`Delete opinion`}
        description={_`Are you sure you want to delete this opinion? This action cannot be undone.`}
        confirmText={_`Delete`}
        variant="danger"
        show={showConfirmDeleteModal}
        onConfirm$={handleDelete}
      />
    </div>
  )
}) 