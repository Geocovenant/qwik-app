import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik"
import { type DocumentHead } from "@builder.io/qwik-city"
import { _ } from "compiled-i18n"
import { 
    LuArrowBigUp, 
    LuArrowBigDown, 
    LuMessageSquare, 
    LuEye,
    LuShield, 
    LuClock,
    LuGlobe,
    LuUser2
} from "@qwikest/icons/lucide"
import { Avatar, Badge, Button, Breadcrumb } from "~/components/ui"
import { useSession } from "~/routes/plugin@auth"
import { timeAgo } from "~/utils/dateUtils"
import { useGetPollBySlug } from "~/shared/loaders"
import { useVotePoll, useReactPoll } from "~/shared/actions"
import CommentsList from "~/components/comments/CommentsList"
import CommentForm from "~/components/comments/CommentForm"
import Modal from "~/components/Modal"
import SocialLoginButtons from "~/components/SocialLoginButtons"

// Export necessary loaders and actions
export { useGetPollBySlug } from "~/shared/loaders"
export { useVotePoll, useReactPoll } from "~/shared/actions"

export default component$(() => {
    const session = useSession()
    const isAuthenticated = !!session.value?.user
    const pollData = useGetPollBySlug()
    const showLoginModal = useSignal(false)
    
    // Action for voting and reactions
    const actionVote = useVotePoll()
    const actionReact = useReactPoll()
    
    // States for handling votes and reactions
    const userVotedOptions = useSignal<number[]>(pollData.value?.user_voted_options || [])
    const reactionState = useSignal({
        userReaction: pollData.value?.user_reaction,
        likesCount: pollData.value?.reactions.LIKE || 0,
        dislikesCount: pollData.value?.reactions.DISLIKE || 0
    })
    
    // Calculate total votes
    const totalVotes = useComputed$(() => {
        if (!pollData.value?.options) return 0
        return pollData.value.options.reduce((sum, option) => sum + option.votes, 0)
    })
    
    const isClosed = useComputed$(() => {
        if (!pollData.value?.ends_at) return false
        return new Date(pollData.value.ends_at) < new Date()
    })
    
    const onShowLoginModal = $(() => {
        showLoginModal.value = true
    })

    const onCommentAdded = $(() => {
        console.log("Comment added")
    })
    
    // Function to handle voting
    const handleVote = $(async (optionId: number) => {
        if (!isAuthenticated) {
            onShowLoginModal()
            return
        }
        if (!pollData.value) return
        
        const poll = pollData.value
        const isVoted = userVotedOptions.value.includes(optionId)
        let newVotedOptions: number[] = []
        
        // Optimistic update
        if (poll.type === "BINARY" || poll.type === "SINGLE_CHOICE") {
            newVotedOptions = isVoted ? [] : [optionId]
            
            // Update votes in UI
            poll.options = poll.options.map(opt => ({
                ...opt,
                votes: opt.id === optionId 
                    ? opt.votes + (isVoted ? -1 : 1)
                    : isVoted 
                        ? opt.votes 
                        : opt.votes - (opt.voted ? 1 : 0),
                voted: opt.id === optionId ? !isVoted : false
            }))
        } else if (poll.type === "MULTIPLE_CHOICE") {
            newVotedOptions = isVoted
                ? userVotedOptions.value.filter(id => id !== optionId)
                : [...userVotedOptions.value, optionId]
                
            // Update votes in UI
            poll.options = poll.options.map(opt => ({
                ...opt,
                votes: opt.id === optionId ? opt.votes + (isVoted ? -1 : 1) : opt.votes,
                voted: opt.id === optionId ? !isVoted : opt.voted
            }))
        }
        
        // Update user's voted options state
        userVotedOptions.value = newVotedOptions
        
        // API call
        const result = await actionVote.submit({
            pollId: poll.id,
            optionIds: newVotedOptions
        })
        
        // If there's an error, revert changes
        if (result.status !== 200) {
            poll.options = pollData.value.options
            userVotedOptions.value = pollData.value.user_voted_options
        }
    })
    
    // Function to handle reactions
    const handleReaction = $(async (newReaction: "LIKE" | "DISLIKE") => {
        if (!isAuthenticated) {
            onShowLoginModal()
            return
        }
        if (!pollData.value) return
        
        const previousReaction = reactionState.value.userReaction
        
        // Optimistic update
        if (newReaction === previousReaction) {
            // If clicking the same reaction, remove it
            reactionState.value = {
                ...reactionState.value,
                userReaction: null
            }
            
            if (newReaction === "LIKE") {
                reactionState.value.likesCount--
            } else {
                reactionState.value.dislikesCount--
            }
        } else {
            // If changing the reaction or adding a new one
            reactionState.value.userReaction = newReaction
            
            if (previousReaction === "LIKE") {
                reactionState.value.likesCount--
            } else if (previousReaction === "DISLIKE") {
                reactionState.value.dislikesCount--
            }
            
            if (newReaction === "LIKE") {
                reactionState.value.likesCount++
            } else {
                reactionState.value.dislikesCount++
            }
        }
        
        // API call
        const result = await actionReact.submit({
            pollId: pollData.value.id,
            reaction: newReaction
        })
        
        // If there's an error, revert changes
        if (result.status !== 200) {
            reactionState.value = {
                userReaction: pollData.value.user_reaction,
                likesCount: pollData.value.reactions.LIKE,
                dislikesCount: pollData.value.reactions.DISLIKE
            }
        }
    })

    if (!pollData.value) {
        return (
            <div class="flex items-center justify-center h-screen">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
            </div>
        )
    }

    const poll = pollData.value
    const commentsCount = poll.comments_count || poll.comments?.length || 0

    return (
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Login modal */}
            <Modal
                title={_`Log in to participate`}
                show={showLoginModal}
            >
                <div class="p-4 text-center">
                    <p class="mb-6 text-gray-600 dark:text-gray-300">
                        {_`You need to log in to vote, comment, and participate in the community.`}
                    </p>
                    <SocialLoginButtons />
                </div>
            </Modal>

            {/* Breadcrumb */}
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/">{_`Global`}</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/global">{_`Poll`}</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link>{poll.title}</Breadcrumb.Link>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Main column */}
                <div class="lg:col-span-2 space-y-8">
                    {/* Poll header */}
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-2">
                                {getPollTypeBadge(poll.type)}
                                {getPollScopeBadge(poll.scope)}
                                {poll.ends_at && getPollStatusBadge(poll.ends_at)}
                            </div>
                            
                            <div class="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                <LuEye class="w-4 h-4 mr-1" />
                                <span>{poll.views_count} {_`views`}</span>
                            </div>
                        </div>
                        
                        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                            {poll.title}
                        </h1>
                        
                        {poll.description && (
                            <p class="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                                {poll.description}
                            </p>
                        )}
                        
                        <div class="flex items-center justify-between mt-6 text-sm border-t pt-4 border-gray-200 dark:border-gray-700">
                            <div class="flex items-center">
                                {poll.is_anonymous ? (
                                    <div class="flex items-center">
                                        <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <LuUser2 class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <span class="text-gray-600 dark:text-gray-400 italic ml-1">
                                            {_`Anonymous`}
                                        </span>
                                    </div>
                                ) : (
                                    <div class="flex items-center">
                                        <Avatar.Root>
                                            <Avatar.Image
                                                src={poll.creator.image}
                                                alt={poll.creator.username}
                                                class="w-6 h-6 rounded-full"
                                            />
                                        </Avatar.Root>
                                        <span class="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer ml-1">
                                            {poll.creator.username}
                                        </span>
                                    </div>
                                )}
                                
                                <span class="mx-2">•</span>
                                
                                <div class="flex items-center">
                                    <LuClock class="w-4 h-4 mr-1 text-gray-500" />
                                    <span>{timeAgo(new Date(poll.created_at))}</span>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                {/* Reaction buttons */}
                                <div class="vote-buttons-container flex rounded-md overflow-hidden shadow-sm">
                                    <button
                                        onClick$={() => handleReaction("LIKE")}
                                        class={`group btn-interaction btn-like py-1.5 px-3 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-l-md transition-colors duration-300 ${reactionState.value.userReaction === "LIKE"
                                                ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                                                : "bg-white dark:bg-gray-800"
                                            }`}
                                        title={_`Like`}
                                    >
                                        <LuArrowBigUp
                                            class={`w-4 h-4 mr-1.5 ${reactionState.value.userReaction === "LIKE"
                                                    ? "text-green-500"
                                                    : "text-gray-500 group-hover:text-green-500"
                                                } transition-colors duration-300`}
                                        />
                                        <span
                                            class={`font-medium ${reactionState.value.userReaction === "LIKE"
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-gray-700 dark:text-gray-300 group-hover:text-green-500"
                                                } transition-colors duration-300`}
                                        >
                                            {reactionState.value.likesCount}
                                        </span>
                                    </button>
                                    <button
                                        onClick$={() => handleReaction("DISLIKE")}
                                        class={`group btn-interaction btn-dislike py-1.5 px-3 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 border-l-0 rounded-r-md transition-colors duration-300 ${reactionState.value.userReaction === "DISLIKE"
                                                ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                                                : "bg-white dark:bg-gray-800"
                                            }`}
                                        title={_`Dislike`}
                                    >
                                        <LuArrowBigDown
                                            class={`w-4 h-4 mr-1.5 ${reactionState.value.userReaction === "DISLIKE" ? "text-red-500" : "text-gray-500 group-hover:text-red-500"
                                                } transition-colors duration-300`}
                                        />
                                        <span
                                            class={`font-medium ${reactionState.value.userReaction === "DISLIKE"
                                                    ? "text-red-600 dark:text-red-400"
                                                    : "text-gray-700 dark:text-gray-300 group-hover:text-red-500"
                                                } transition-colors duration-300`}
                                        >
                                            {reactionState.value.dislikesCount}
                                        </span>
                                    </button>
                                </div>
                                
                                <div class="flex items-center text-sm">
                                    <LuMessageSquare class="w-4 h-4 mr-1.5 text-gray-500" />
                                    <span class="text-gray-700 dark:text-gray-300">
                                        {commentsCount} {_`comments`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Voting options */}
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            {_`Voting Options`}
                            {poll.type === "MULTIPLE_CHOICE" && (
                                <span class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                                    ({_`You can select multiple options`})
                                </span>
                            )}
                        </h2>
                        
                        <div class="space-y-4 mt-4">
                            {poll.options.map(option => {
                                const isSelected = option.voted || userVotedOptions.value.includes(option.id)
                                
                                // Helper functions for classes
                                const getBorderColorClass = () => {
                                    switch(poll.type) {
                                        case "BINARY": return "border-cyan-400 dark:border-cyan-600"
                                        case "SINGLE_CHOICE": return "border-purple-400 dark:border-purple-600"
                                        case "MULTIPLE_CHOICE": return "border-emerald-400 dark:border-emerald-600"
                                        default: return "border-blue-400 dark:border-blue-600"
                                    }
                                }
                                
                                const getBadgeColorClass = () => {
                                    switch(poll.type) {
                                        case "BINARY": return "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300"
                                        case "SINGLE_CHOICE": return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                        case "MULTIPLE_CHOICE": return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                        default: return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                    }
                                }
                                
                                const getProgressBarColor = (selected: boolean) => {
                                    if (!selected) return "bg-gray-300 dark:bg-gray-600"
                                    
                                    switch(poll.type) {
                                        case "BINARY": return "bg-cyan-500 dark:bg-cyan-600"
                                        case "SINGLE_CHOICE": return "bg-purple-500 dark:bg-purple-600"
                                        case "MULTIPLE_CHOICE": return "bg-emerald-500 dark:bg-emerald-600"
                                        default: return "bg-blue-500 dark:bg-blue-600"
                                    }
                                }
                                
                                const percentage = totalVotes.value > 0 ? (option.votes / totalVotes.value) * 100 : 0
                                
                                return (
                                    <div
                                        key={option.id}
                                        class={`poll-option p-4 rounded-lg cursor-pointer transition-all duration-300 transform ${
                                            isSelected
                                                ? "bg-gray-50 dark:bg-gray-700 border-2 shadow-md scale-[1.01]"
                                                : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border hover:scale-[1.01] border-gray-200 dark:border-gray-700"
                                            } ${isSelected ? getBorderColorClass() : ""}`}
                                        onClick$={() => !isClosed.value && handleVote(option.id)}
                                    >
                                        <div class="flex justify-between items-center mb-2">
                                            <span class={`${isSelected ? "text-lg font-bold" : "text-gray-700 dark:text-gray-300 font-medium"}`}>
                                                {option.text}
                                            </span>
                                            <span
                                                class={`text-sm font-medium ${isSelected ? "px-2 py-1 rounded-full" : "text-gray-500 dark:text-gray-400"
                                                    } ${isSelected ? getBadgeColorClass() : ""}`}
                                            >
                                                {option.votes} {_`votes`} ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                        <div class="poll-progress h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                class={`poll-progress-bar h-full transition-all duration-500 ease-out ${getProgressBarColor(isSelected)}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        
                        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                {_`Total votes`}: <span class="font-medium text-gray-700 dark:text-gray-300">{totalVotes.value}</span>
                            </div>
                            
                            {!isAuthenticated && (
                                <Button
                                    class="bg-cyan-600 hover:bg-cyan-700 text-white"
                                    onClick$={onShowLoginModal}
                                >
                                    {_`Log in to vote`}
                                </Button>
                            )}
                            
                            {isClosed.value && (
                                <div class="text-sm text-red-500 font-medium">
                                    {_`This poll has ended`}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments section */}
                    <div class="mt-8">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            {_`Comments`} ({commentsCount})
                        </h2>
                        
                        {isAuthenticated ? (
                            <CommentForm 
                                pollId={poll.id} 
                                onSubmitCompleted={onCommentAdded} 
                            />
                        ) : (
                            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center mb-6">
                                <p class="text-gray-600 dark:text-gray-300 mb-2">
                                    {_`Sign in to leave a comment`}
                                </p>
                                <button 
                                    class="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"
                                    onClick$={onShowLoginModal}
                                >
                                    {_`Sign in`}
                                </button>
                            </div>
                        )}
                        
                        <div class="mt-6">
                            <CommentsList 
                                comments={poll.comments || []}
                                isAuthenticated={isAuthenticated}
                                onShowLoginModal$={onShowLoginModal}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Sidebar */}
                <div class="lg:col-span-1 space-y-6">
                    {/* Poll information */}
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <h3 class="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                            <LuShield class="w-5 h-5 mr-2 text-gray-500" />
                            {_`Poll Information`}
                        </h3>
                        
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {_`Created by`}
                                </span>
                                <div class="flex items-center">
                                    {poll.is_anonymous ? (
                                        <span class="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                            <LuUser2 class="w-4 h-4 mr-1 text-gray-500" /> 
                                            {_`Anonymous`}
                                        </span>
                                    ) : (
                                        <div class="flex items-center">
                                            <Avatar.Root>
                                                <Avatar.Image 
                                                    src={poll.creator.image} 
                                                    alt={poll.creator.username} 
                                                    class="w-5 h-5 rounded-full mr-1" 
                                                />
                                            </Avatar.Root>
                                            <span class="font-medium text-gray-800 dark:text-gray-200">
                                                {poll.creator.username}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {_`Created on`}
                                </span>
                                <span class="font-medium text-gray-800 dark:text-gray-200">
                                    {new Date(poll.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            
                            {poll.scope && (
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-500 dark:text-gray-400">
                                        {_`Scope`}
                                    </span>
                                    <span class="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                        <LuGlobe class="w-4 h-4 mr-1 text-gray-500" />
                                        {getScopeLabel(poll.scope)}
                                    </span>
                                </div>
                            )}
                            
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {_`Type`}
                                </span>
                                <span class="font-medium text-gray-800 dark:text-gray-200">
                                    {getTypeLabel(poll.type)}
                                </span>
                            </div>
                            
                            {poll.ends_at && (
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(poll.ends_at) < new Date() ? _`Ended on` : _`Ends on`}
                                    </span>
                                    <span class="font-medium text-gray-800 dark:text-gray-200">
                                        {new Date(poll.ends_at).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                            
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {_`Views`}
                                </span>
                                <span class="font-medium text-gray-800 dark:text-gray-200">
                                    {poll.views_count}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Related polls - could be implemented in the future */}
                </div>
            </div>
        </div>
    )
})

// Helper functions for badges and information
function getPollTypeBadge(type: string) {
    switch(type) {
        case "BINARY":
            return (
                <Badge class="bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300">
                    {_`Binary`}
                </Badge>
            )
        case "SINGLE_CHOICE":
            return (
                <Badge class="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                    {_`Single Choice`}
                </Badge>
            )
        case "MULTIPLE_CHOICE":
            return (
                <Badge class="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                    {_`Multiple Choice`}
                </Badge>
            )
        default:
            return (
                <Badge class="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                    {type}
                </Badge>
            )
    }
}

function getPollScopeBadge(scope: string) {
    switch(scope) {
        case "GLOBAL":
            return (
                <Badge class="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                    {_`Global`}
                </Badge>
            )
        case "NATIONAL":
            return (
                <Badge class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                    {_`National`}
                </Badge>
            )
        case "REGIONAL":
            return (
                <Badge class="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                    {_`Regional`}
                </Badge>
            )
        default:
            return (
                <Badge class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {scope}
                </Badge>
            )
    }
}

function getPollStatusBadge(endsAt: string) {
    const isExpired = new Date(endsAt) < new Date()
    return isExpired ? (
        <Badge class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300">
            {_`Ended`}
        </Badge>
    ) : (
        <Badge class="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
            {_`Active`}
        </Badge>
    )
}

function getScopeLabel(scope: string) {
    switch(scope) {
        case "GLOBAL": return _`Global`
        case "INTERNATIONAL": return _`International`
        case "NATIONAL": return _`National`
        case "REGIONAL": return _`Regional`
        case "SUBREGIONAL": return _`Subregional`
        default: return scope
    }
}

function getTypeLabel(type: string) {
    switch(type) {
        case "BINARY": return _`Binary`
        case "SINGLE_CHOICE": return _`Single Choice`
        case "MULTIPLE_CHOICE": return _`Multiple Choice`
        default: return type
    }
}

export const head: DocumentHead = ({ resolveValue }) => {
    const poll = resolveValue(useGetPollBySlug)
    return {
        title: poll?.title || _`Poll Details`,
        meta: [
            {
                name: "description",
                content: poll?.description || _`View poll details and join the conversation`,
            },
        ],
    }
}
