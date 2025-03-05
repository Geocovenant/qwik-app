import { component$, $, useStore, useComputed$, useSignal, type QRL } from "@builder.io/qwik"
import { Link } from "@builder.io/qwik-city"
import {
    LuArrowBigUp,
    LuArrowBigDown,
    LuMessageSquare,
    LuTimer,
    LuLink,
    LuGlobe,
    LuUser2,
    LuTrash2,
    LuFlag,
} from "@qwikest/icons/lucide"
import { timeAgo } from "~/utils/dateUtils"
import { useVotePoll, useReactPoll } from "~/shared/actions"
import { dataArray } from "~/data/countries"
import { CommunityType } from "~/constants/communityType"
import { Avatar } from "~/components/ui"
import FormReport from "~/components/forms/FormReport";
import Modal from "~/components/Modal";
import { _ } from "compiled-i18n"
interface PollCardProps {
    id: number
    title: string
    slug: string
    description: string
    options: { text: string; votes: number; id: number; voted: boolean }[]
    status: string
    type: string
    scope: string
    isAnonymous: boolean
    endsAt?: string | null
    createdAt: string
    creatorUsername: string
    creatorAvatar: string
    commentsCount: number
    likesCount: number
    dislikesCount: number
    countries?: string[]
    userVotedOptions?: number[]
    userReaction?: "LIKE" | "DISLIKE" | null
    isAuthenticated?: boolean
    currentUsername?: string
    onShowLoginModal$: QRL<() => void>
    onDelete$?: QRL<(pollId: number) => void>
}

export default component$<PollCardProps>(
    ({
        id,
        title,
        slug,
        description,
        options,
        type,
        scope,
        isAnonymous,
        endsAt,
        createdAt,
        creatorUsername,
        creatorAvatar,
        commentsCount,
        likesCount: initialLikesCount,
        dislikesCount: initialDislikesCount,
        countries = [],
        userVotedOptions = [],
        userReaction: initialUserReaction = null,
        isAuthenticated = true,
        currentUsername = "",
        onShowLoginModal$,
        onDelete$,
    }) => {
        const actionVote = useVotePoll()
        const actionReact = useReactPoll()

        // Internal state for votes and reactions
        const pollState = useStore({
            options,
            userVotedOptions: userVotedOptions,
        })

        const reactionState = useStore({
            userReaction: initialUserReaction,
            likesCount: initialLikesCount,
            dislikesCount: initialDislikesCount,
        })

        const showReportModal = useSignal(false)

        const totalVotes = useComputed$(() => pollState.options.reduce((sum, option) => sum + option.votes, 0))

        const isClosed = useComputed$(() => (endsAt && new Date(endsAt) < new Date()) || false)

        const handleVote = $(async (optionId: number) => {
            if (!isAuthenticated) {
                onShowLoginModal$();
                return;
            }

            let newVotedOptions: number[] = []
            const isVoted = pollState.userVotedOptions.includes(optionId)

            // Optimistic update
            if (type === "BINARY" || type === "SINGLE_CHOICE") {
                newVotedOptions = isVoted ? [] : [optionId]

                // Update vote counters
                pollState.options = pollState.options.map((opt) => ({
                    ...opt,
                    votes:
                        opt.id === optionId
                            ? opt.votes + (isVoted ? -1 : 1)
                            : isVoted
                                ? opt.votes
                                : opt.votes - (opt.voted ? 1 : 0),
                    voted: opt.id === optionId ? !isVoted : false,
                }))
            } else if (type === "MULTIPLE_CHOICE") {
                newVotedOptions = isVoted
                    ? pollState.userVotedOptions.filter((id) => id !== optionId)
                    : [...pollState.userVotedOptions, optionId]

                // Update vote counter
                pollState.options = pollState.options.map((opt) => ({
                    ...opt,
                    votes: opt.id === optionId ? opt.votes + (isVoted ? -1 : 1) : opt.votes,
                    voted: opt.id === optionId ? !isVoted : opt.voted,
                }))
            }

            // Update voted options state
            pollState.userVotedOptions = newVotedOptions

            // API call
            const result = await actionVote.submit({
                pollId: id,
                optionIds: newVotedOptions,
            })

            // If there's an error, revert changes
            if (result.status !== 200) {
                pollState.options = options
                pollState.userVotedOptions = userVotedOptions
            }
        })

        const handleReaction = $(async (newReaction: "LIKE" | "DISLIKE") => {
            if (!isAuthenticated) {
                onShowLoginModal$();
                return;
            }

            const previousReaction = reactionState.userReaction

            // Optimistic update
            if (newReaction === previousReaction) {
                // If clicking on the same reaction, remove it
                reactionState.userReaction = null
                if (newReaction === "LIKE") {
                    reactionState.likesCount--
                } else {
                    reactionState.dislikesCount--
                }
            } else {
                // If changing reaction or adding a new one
                reactionState.userReaction = newReaction

                if (previousReaction === "LIKE") {
                    reactionState.likesCount--
                } else if (previousReaction === "DISLIKE") {
                    reactionState.dislikesCount--
                }

                if (newReaction === "LIKE") {
                    reactionState.likesCount++
                } else {
                    reactionState.dislikesCount++
                }
            }

            // API call
            const result = await actionReact.submit({
                pollId: id,
                reaction: newReaction,
            })

            // If there's an error, revert changes
            if (result.status !== 200) {
                reactionState.userReaction = previousReaction
                reactionState.likesCount = initialLikesCount
                reactionState.dislikesCount = initialDislikesCount
            }
        })

        const getCountryData = (code: string) => {
            return dataArray.find((country) => country.cca2 === code)
        }

        // Add signal to control the visibility of the copied message
        const showCopiedMessage = useSignal(false);
        
        const copyPollLink = $(() => {
            try {
                const pollUrl = `${window.location.origin}/polls/${slug}`
                navigator.clipboard.writeText(pollUrl)
                // Show copied message
                showCopiedMessage.value = true;
                // Hide message after 3 seconds
                setTimeout(() => {
                    showCopiedMessage.value = false;
                }, 3000);
            } catch (error) {
                console.error("Error copying link:", error)
            }
        })

        // Determine poll type to show an icon
        const getPollTypeIcon = () => {
            switch (type) {
                case "BINARY":
                    return "⚖️"
                case "SINGLE_CHOICE":
                    return "🔘"
                case "MULTIPLE_CHOICE":
                    return "✅"
                default:
                    return "📊"
            }
        }

        // Get background color for progress bar based on type
        const getProgressBarColor = (isSelected: boolean) => {
            if (isSelected) {
                switch (type) {
                    case "BINARY":
                        return "bg-cyan-500"
                    case "SINGLE_CHOICE":
                        return "bg-purple-500"
                    case "MULTIPLE_CHOICE":
                        return "bg-emerald-500"
                    default:
                        return "bg-blue-500"
                }
            } else {
                switch (type) {
                    case "BINARY":
                        return "bg-cyan-300"
                    case "SINGLE_CHOICE":
                        return "bg-purple-300"
                    case "MULTIPLE_CHOICE":
                        return "bg-emerald-300"
                    default:
                        return "bg-blue-300"
                }
            }
        }

        const isCreator = currentUsername === creatorUsername;

        return (
            <div class="poll-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                {/* Replace the ribbon with a badge inside the card */}
                
                {/* Header */}
                <div class="mb-5">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl" title={type}>
                                {getPollTypeIcon()}
                            </span>
                            <h3 class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white line-clamp-2">{title}</h3>
                        </div>
                        <div class="flex items-center gap-2">
                            {isClosed.value && (
                                <div class="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase px-3 py-1.5 rounded-full border border-red-200 dark:border-red-700">
                                    {_`Closed`}
                                </div>
                            )}
                            {scope === CommunityType.GLOBAL && (
                                <div
                                    class="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400"
                                    title={_`Global`}
                                >
                                    <LuGlobe class="w-5 h-5" />
                                </div>
                            )}
                        </div>
                    </div>

                    {description && <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{description}</p>}

                    {countries.length > 0 && (
                        <div class="flex items-center gap-1 mb-3 flex-wrap">
                            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">{_`Countries:`}</span>
                            <div class="flex gap-1 flex-wrap">
                                {countries.map((code) => {
                                    const country = getCountryData(code)
                                    return (
                                        country && (
                                            <span
                                                key={code}
                                                class="text-xl cursor-help hover:transform hover:scale-125 transition-transform"
                                                title={country.name}
                                            >
                                                {country.flag}
                                            </span>
                                        )
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <div class="flex items-center gap-2 text-sm">
                        <span class="text-gray-500 dark:text-gray-400">{_`Total votes:`}</span>
                        <span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-medium text-gray-700 dark:text-gray-300">
                            {totalVotes.value}
                        </span>
                    </div>
                </div>

                {/* Voting options */}
                <div class="space-y-3 mb-6">
                    {pollState.options.map((option) => {
                        const isSelected = pollState.userVotedOptions.includes(option.id)
                        const percentage = totalVotes.value > 0 ? (option.votes / totalVotes.value) * 100 : 0

                        return (
                            <div
                                key={option.id}
                                class={`poll-option p-4 rounded-lg cursor-pointer transition-all duration-300 transform ${isSelected
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

                {/* Footer */}
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm">
                    <div class="flex flex-wrap items-center gap-3">
                        {isAnonymous ? (
                            <div class="flex items-center">
                                <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <LuUser2 class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <span class="text-gray-600 dark:text-gray-400 italic ml-1">
                                    {_`Anonymous`}
                                </span>
                            </div>
                        ) : (
                            <Link class="flex items-center" href={`/user/${creatorUsername}`}>
                                <Avatar.Root>
                                    <Avatar.Image
                                        src={creatorAvatar}
                                        alt={creatorUsername}
                                        class="w-6 h-6 rounded-full"
                                    />
                                </Avatar.Root>
                                <span class="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer ml-1">
                                    {creatorUsername}
                                </span>
                            </Link>
                        )}

                        <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                            <LuTimer class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span class="text-gray-700 dark:text-gray-300">{timeAgo(new Date(createdAt))}</span>
                        </div>

                        {endsAt && (
                            <div
                                class={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isClosed.value
                                        ? "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                                        : "bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 animate-pulse"
                                    }`}
                            >
                                <span class="text-xs uppercase font-bold text-red-600 dark:text-red-400">
                                    {isClosed.value ? _`Ended` : _`Ends`}:
                                </span>
                                <span class="font-medium text-red-700 dark:text-red-300">{new Date(endsAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    <div class="flex items-center gap-3">
                        {/* Vote buttons group */}
                        <div class="vote-buttons-container flex rounded-md overflow-hidden shadow-sm">
                            <button
                                onClick$={() => handleReaction("LIKE")}
                                class={`group btn-interaction btn-like py-2 px-3 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-l-md transition-colors duration-300 ${reactionState.userReaction === "LIKE"
                                        ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                                        : "bg-white dark:bg-gray-800"
                                    }`}
                                title={_`Upvote`}
                            >
                                <LuArrowBigUp
                                    class={`w-5 h-5 mr-1.5 ${reactionState.userReaction === "LIKE"
                                            ? "text-green-500"
                                            : "text-gray-500 group-hover:text-green-500"
                                        } transition-colors duration-300`}
                                />
                                <span
                                    class={`font-medium ${reactionState.userReaction === "LIKE"
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-gray-700 dark:text-gray-300 group-hover:text-green-500"
                                        } transition-colors duration-300`}
                                >
                                    {reactionState.likesCount}
                                </span>
                            </button>
                            <button
                                onClick$={() => handleReaction("DISLIKE")}
                                class={`group btn-interaction btn-dislike py-2 px-3 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 border-l-0 rounded-r-md transition-colors duration-300 ${reactionState.userReaction === "DISLIKE"
                                        ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                                        : "bg-white dark:bg-gray-800"
                                    }`}
                                title={_`Downvote`}
                            >
                                <LuArrowBigDown
                                    class={`w-5 h-5 mr-1.5 ${reactionState.userReaction === "DISLIKE" ? "text-red-500" : "text-gray-500 group-hover:text-red-500"
                                        } transition-colors duration-300`}
                                />
                                <span
                                    class={`font-medium ${reactionState.userReaction === "DISLIKE"
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-gray-700 dark:text-gray-300 group-hover:text-red-500"
                                        } transition-colors duration-300`}
                                >
                                    {reactionState.dislikesCount}
                                </span>
                            </button>
                        </div>

                        <Link
                            href={`/polls/${slug}`}
                            class="group btn-interaction btn-comment py-2 px-3 flex items-center bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm"
                            title={_`Comments`}
                        >
                            <LuMessageSquare class="w-5 h-5 mr-1.5 text-gray-500 group-hover:text-blue-500 transition-colors duration-300" />
                            <span class="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-300">
                                {commentsCount}
                            </span>
                        </Link>

                        <button
                            onClick$={copyPollLink}
                            class="group relative btn-interaction btn-share p-2 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm"
                            title={_`Copy link`}
                        >
                            {showCopiedMessage.value && (
                                <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap animate-fade-in">
                                    {_`Link copied!`}
                                    <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black bg-opacity-80 rotate-45"></div>
                                </div>
                            )}
                            <LuLink class="w-5 h-5 text-gray-500 group-hover:text-purple-500 transition-colors duration-300" />
                        </button>

                        {isAuthenticated && isCreator && onDelete$ && (
                            <button
                                onClick$={() => onDelete$(id)}
                                class="group btn-interaction btn-delete p-2 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm"
                                title={_`Delete poll`}
                            >
                                <LuTrash2 class="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors duration-300" />
                            </button>
                        )}

                        {isAuthenticated && !isCreator && (
                            <button
                                onClick$={() => showReportModal.value = true}
                                class="group btn-interaction btn-report p-2 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm"
                                title={_`Report poll`}
                            >
                                <LuFlag class="w-5 h-5 text-gray-500 group-hover:text-amber-500 transition-colors duration-300" />
                            </button>
                        )}
                    </div>
                </div>
                <Modal
                    title={_`Report poll`}
                    show={showReportModal}
                >
                    <FormReport 
                        type="POLL" 
                        itemId={id} 
                    />
                </Modal>
            </div>
        )

        // Function to get border color based on poll type
        function getBorderColorClass() {
            switch (type) {
                case "BINARY":
                    return "border-cyan-400 dark:border-cyan-600"
                case "SINGLE_CHOICE":
                    return "border-purple-400 dark:border-purple-600"
                case "MULTIPLE_CHOICE":
                    return "border-emerald-400 dark:border-emerald-600"
                default:
                    return "border-blue-400 dark:border-blue-600"
            }
        }

        // Function to get badge color based on poll type
        function getBadgeColorClass() {
            switch (type) {
                case "BINARY":
                    return "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300"
                case "SINGLE_CHOICE":
                    return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                case "MULTIPLE_CHOICE":
                    return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                default:
                    return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            }
        }
    },
)
