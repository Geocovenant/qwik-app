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
    LuUser2,
    LuCheck,
    LuX,
    LuTag,
    LuLink
} from "@qwikest/icons/lucide"
import { Avatar, Button, Breadcrumb } from "~/components/ui"
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

// Agregar interfaces para los tipos
interface PollOption {
    id: number;
    text: string;
    votes: number;
    voted?: boolean;
}

export default component$(() => {
    const session = useSession()
    const isAuthenticated = !!session.value
    const pollData = useGetPollBySlug()
    const showLoginModal = useSignal(false)
    const showCopiedMessage = useSignal(false)
    
    // Action for voting and reactions
    const actionVote = useVotePoll()
    const actionReact = useReactPoll()
    
    // States for handling votes and reactions
    const userVotedOptions = useSignal<number[]>(pollData.value.user_voted_options || [])
    const reactionState = useSignal({
        userReaction: pollData.value.user_reaction,
        likesCount: pollData.value.reactions.LIKE || 0,
        dislikesCount: pollData.value.reactions.DISLIKE || 0
    })
    
    // Calculate total votes
    const totalVotes = useComputed$(() => {
        if (!pollData.value.options) return 0
        return pollData.value.options.reduce((sum: number, option: PollOption) => sum + option.votes, 0)
    })
    
    const isClosed = useComputed$(() => {
        if (!pollData.value.ends_at) return false
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
        
        const poll = pollData.value
        const isVoted = userVotedOptions.value.includes(optionId)
        let newVotedOptions: number[] = []
        
        // Optimistic update
        if (poll.type === "BINARY" || poll.type === "SINGLE_CHOICE") {
            newVotedOptions = isVoted ? [] : [optionId]
            
            // Update votes in UI
            poll.options = poll.options.map((opt: PollOption) => ({
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
            poll.options = poll.options.map((opt: PollOption) => ({
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

    const copyPollLink = $(() => {
        try {
            // Usa la ubicación actual como enlace
            const pollUrl = window.location.href;
            navigator.clipboard.writeText(pollUrl);
            
            // Muestra el mensaje de copiado
            showCopiedMessage.value = true;
            
            // Oculta el mensaje después de 3 segundos
            setTimeout(() => {
                showCopiedMessage.value = false;
            }, 3000);
        } catch (error) {
            console.error("Error copying link:", error);
        }
    });

    const poll = pollData.value
    const commentsCount = poll.comments_count || poll.comments?.length || 0

    return (
        <div class="container mx-auto px-4 py-8">
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

            {/* Breadcrumb mejorado */}
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/" class="hover:text-[#713fc2] dark:hover:text-[#9333EA] transition-colors">
                            {_`Global`}
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/global" class="hover:text-[#713fc2] dark:hover:text-[#9333EA] transition-colors">
                            {_`Poll`}
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link class="font-medium">{poll.title.length > 30 ? poll.title.slice(0, 30) + '...' : poll.title}</Breadcrumb.Link>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                {/* Main column */}
                <div class="lg:col-span-2 space-y-8">
                    {/* Poll header mejorado con ribbon y diseño consistente */}
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                        {/* Ribbon igual al de PollCard */}
                        <div class="absolute -right-12 top-7 transform rotate-45 z-10">
                            <div class={`py-1 px-12 text-xs font-bold uppercase ${getPollTypeInfo(poll.type).ribbonBg} ${getPollTypeInfo(poll.type).ribbonText}`}>
                                {getPollTypeInfo(poll.type).text}
                            </div>
                        </div>
                        
                        <div class="flex items-center flex-wrap gap-2 mb-4">
                            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mr-auto">
                                {poll.title}
                            </h1>
                            
                            {isClosed.value && (
                                <div class="inline-flex bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase px-3 py-1 rounded-full border border-red-200 dark:border-red-700">
                                    {_`Closed`}
                                </div>
                            )}
                        </div>
                        
                        {poll.description && (
                            <p class="text-gray-600 dark:text-gray-300 mb-6 text-lg">{poll.description}</p>
                        )}
                        
                        {/* Tags si los hay */}
                        {poll.tags && poll.tags.length > 0 && (
                            <div class="flex flex-wrap gap-2 mb-4">
                                {poll.tags.map((tag: string) => (
                                    <span key={tag} class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                                        <LuTag class="w-3 h-3 mr-1" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        
                        <div class="flex flex-wrap items-center justify-between text-sm mb-4">
                            <div class="flex items-center gap-2 mb-2 sm:mb-0">
                                <span class="text-gray-500 dark:text-gray-400">{_`Total votes:`}</span>
                                <span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-medium text-gray-700 dark:text-gray-300">
                                    {totalVotes.value}
                                </span>
                            </div>
                            
                            {/* Badge informativo del tipo de encuesta */}
                            <div class={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${getPollTypeInfo(poll.type).bgColor} ${getPollTypeInfo(poll.type).textColor} ${getPollTypeInfo(poll.type).borderColor}`}>
                                {getPollTypeInfo(poll.type).icon}
                                <span class="ml-1">{getPollTypeInfo(poll.type).description}</span>
                            </div>
                        </div>
                        
                        {/* Mensaje explicativo para usuarios con votos */}
                        {userVotedOptions.value.length > 0 && (
                            <div class="mb-5 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <p class="text-sm text-green-800 dark:text-green-300 flex items-center">
                                    <LuCheck class="w-4 h-4 mr-2 text-green-500" />
                                    {_`You voted for ${userVotedOptions.value.length} option${userVotedOptions.value.length !== 1 ? 's' : ''}`}
                                    {poll.type === "MULTIPLE_CHOICE" && _`. You can select multiple options.`}
                                </p>
                            </div>
                        )}
                        
                        {/* Opciones de votación mejoradas */}
                        <div class="space-y-3 mb-6">
                            {poll.options.map((option: PollOption) => {
                                const percentage = totalVotes.value > 0
                                    ? (option.votes / totalVotes.value) * 100
                                    : 0;
                                const isSelected = option.voted || userVotedOptions.value.includes(option.id);
                                
                                return (
                                    <div
                                        key={option.id}
                                        class={`poll-option p-4 rounded-lg cursor-pointer transition-all duration-300 transform ${
                                            isSelected
                                                ? "bg-gray-50 dark:bg-gray-700 border-2 shadow-md"
                                                : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                                            } ${isSelected ? getBorderColorClass(poll.type) : ""}`}
                                        onClick$={() => !isClosed.value && handleVote(option.id)}
                                    >
                                        <div class="flex items-center gap-3">
                                            {/* Checkbox indicador de voto */}
                                            <div class={`flex-shrink-0 w-5 h-5 rounded border ${isSelected ? getCheckboxColorClass(poll.type) : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'} flex items-center justify-center transition-colors`}>
                                                {isSelected && <LuCheck class="w-3 h-3 text-white" />}
                                            </div>
                                            
                                            <div class="flex-grow">
                                                <div class="flex justify-between items-center mb-2">
                                                    <span class={`${isSelected ? "text-lg font-bold" : "text-gray-700 dark:text-gray-300 font-medium"}`}>
                                                        {option.text}
                                                    </span>
                                                    <div class="flex items-center">
                                                        {isSelected && (
                                                            <span class={`text-xs font-medium mr-2 px-2 py-0.5 rounded-full ${getBadgeColorClass(poll.type)}`}>
                                                                {_`Your vote`}
                                                            </span>
                                                        )}
                                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            {option.votes} {_`votes`} ({percentage.toFixed(1)}%)
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="poll-progress h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        class={`poll-progress-bar h-full transition-all duration-500 ease-out ${getProgressBarColor(poll.type, isSelected)}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        
                        {/* Footer con metadatos e interacciones */}
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                            <div class="flex flex-wrap items-center gap-3">
                                {poll.is_anonymous ? (
                                    <div class="flex items-center">
                                        <div class="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <LuUser2 class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <span class="text-gray-600 dark:text-gray-400 italic ml-1">
                                            {_`Anonymous`}
                                        </span>
                                    </div>
                                ) : (
                                    <div class="flex items-center group">
                                        <Avatar.Root class="border-2 border-transparent group-hover:border-[#713fc2] dark:group-hover:border-[#9333EA] transition-all duration-300">
                                            <Avatar.Image
                                                src={poll.creator.image}
                                                alt={poll.creator.username}
                                                class="w-7 h-7 rounded-full"
                                            />
                                        </Avatar.Root>
                                        <span class="group-hover:text-[#713fc2] dark:group-hover:text-[#9333EA] transition-colors ml-1">
                                            {poll.creator.username}
                                        </span>
                                    </div>
                                )}

                                <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/70 px-3 py-1.5 rounded-full">
                                    <LuClock class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span class="text-gray-700 dark:text-gray-300">{timeAgo(new Date(poll.created_at))}</span>
                                </div>

                                {poll.ends_at && (
                                    <div
                                        class={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isClosed.value
                                                ? "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                                                : "bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 animate-pulse"
                                            }`}
                                    >
                                        <span class="text-xs uppercase font-bold text-red-600 dark:text-red-400">
                                            {isClosed.value ? _`Ended` : _`Ends`}:
                                        </span>
                                        <span class="font-medium text-red-700 dark:text-red-300">{new Date(poll.ends_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Botones de reacción */}
                            <div class="flex items-center gap-3">
                                {/* Vote buttons group */}
                                <div class="vote-buttons-container flex rounded-md overflow-hidden shadow-sm">
                                    <button
                                        onClick$={() => handleReaction("LIKE")}
                                        class={`group btn-interaction btn-like py-2 px-3 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-l-md transition-colors duration-300 ${reactionState.value.userReaction === "LIKE"
                                                ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                                                : "bg-white dark:bg-gray-800"
                                            }`}
                                        title={_`Upvote`}
                                        disabled={!isAuthenticated}
                                    >
                                        <LuArrowBigUp
                                            class={`w-5 h-5 mr-1.5 ${reactionState.value.userReaction === "LIKE"
                                                    ? "text-green-500"
                                                    : "text-gray-500 group-hover:text-green-500"
                                                } transition-colors duration-300`}
                                        />
                                        <span class={`font-medium ${reactionState.value.userReaction === "LIKE"
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400"
                                            } transition-colors duration-300`}>
                                            {reactionState.value.likesCount}
                                        </span>
                                    </button>
                                    
                                    <button
                                        onClick$={() => handleReaction("DISLIKE")}
                                        class={`group btn-interaction btn-dislike py-2 px-3 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-r-md transition-colors duration-300 ${reactionState.value.userReaction === "DISLIKE"
                                                ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                                                : "bg-white dark:bg-gray-800"
                                            }`}
                                        title={_`Downvote`}
                                        disabled={!isAuthenticated}
                                    >
                                        <LuArrowBigDown
                                            class={`w-5 h-5 mr-1.5 ${reactionState.value.userReaction === "DISLIKE"
                                                    ? "text-red-500"
                                                    : "text-gray-500 group-hover:text-red-500"
                                                } transition-colors duration-300`}
                                        />
                                        <span class={`font-medium ${reactionState.value.userReaction === "DISLIKE"
                                                ? "text-red-600 dark:text-red-400"
                                                : "text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400"
                                            } transition-colors duration-300`}>
                                            {reactionState.value.dislikesCount}
                                        </span>
                                    </button>
                                </div>
                                
                                {/* Botón de compartir */}
                                <button
                                    onClick$={copyPollLink}
                                    class="group relative btn-interaction btn-share p-2 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm"
                                    title={_`Copy link`}
                                >
                                    {showCopiedMessage.value && (
                                        <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap animate-fadeIn">
                                            {_`Link copied!`}
                                            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black bg-opacity-80 rotate-45"></div>
                                        </div>
                                    )}
                                    <LuLink class="w-5 h-5 text-gray-500 group-hover:text-[#713fc2] dark:group-hover:text-[#9333EA] transition-colors duration-300" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sección de comentarios mejorada */}
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <LuMessageSquare class="w-5 h-5 mr-2 text-[#713fc2] dark:text-[#9333EA]" />
                            {_`Comments`} 
                            <span class="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                                {commentsCount}
                            </span>
                        </h2>
                        
                        {isAuthenticated ? (
                            <CommentForm 
                                pollId={poll.id} 
                                onSubmitCompleted={onCommentAdded}
                            />
                        ) : (
                            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-center mb-8 border border-gray-200 dark:border-gray-600">
                                <p class="text-gray-600 dark:text-gray-300 mb-4">
                                    {_`Sign in to join the conversation and leave a comment`}
                                </p>
                                <Button 
                                    class="bg-[#713fc2] hover:bg-[#8255c9] dark:bg-[#9333EA] dark:hover:bg-[#A855F7] text-white"
                                    onClick$={onShowLoginModal}
                                >
                                    {_`Sign in`}
                                </Button>
                            </div>
                        )}
                        
                        <div class="space-y-6">
                            <CommentsList 
                                comments={poll.comments || []}
                                isAuthenticated={isAuthenticated}
                                onShowLoginModal$={onShowLoginModal}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Sidebar mejorada */}
                <div class="lg:col-span-1 space-y-6">
                    {/* Poll information */}
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h3 class="font-bold text-gray-800 dark:text-white mb-6 flex items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                            <LuShield class="w-5 h-5 mr-2 text-[#713fc2] dark:text-[#9333EA]" />
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
                                            <span class="font-medium text-gray-800 dark:text-gray-200 hover:text-[#713fc2] dark:hover:text-[#9333EA] cursor-pointer transition-colors">
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
                    
                    {/* Estadísticas de la encuesta */}
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h3 class="font-bold text-gray-800 dark:text-white mb-6 flex items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                            <LuEye class="w-5 h-5 mr-2 text-[#713fc2] dark:text-[#9333EA]" />
                            {_`Poll Statistics`}
                        </h3>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                                <div class="text-2xl font-bold text-[#713fc2] dark:text-[#9333EA]">{totalVotes.value}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">{_`Total Votes`}</div>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                                <div class="text-2xl font-bold text-[#713fc2] dark:text-[#9333EA]">{poll.views_count}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">{_`Views`}</div>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                                <div class="text-2xl font-bold text-[#713fc2] dark:text-[#9333EA]">{reactionState.value.likesCount}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">{_`Upvotes`}</div>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                                <div class="text-2xl font-bold text-[#713fc2] dark:text-[#9333EA]">{commentsCount}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">{_`Comments`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

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
        title: poll.title || _`Poll Details`,
        meta: [
            {
                name: "description",
                content: poll.description || _`View poll details and join the conversation`,
            },
        ],
    }
}

// Funciones de utilidad para los colores basados en el tipo de poll
// Estas funciones son similares a las que usamos en PollCard para mantener consistencia

function getCheckboxColorClass(type: string) {
    switch (type) {
        case "BINARY":
            return "bg-cyan-500 dark:bg-cyan-600"
        case "SINGLE_CHOICE":
            return "bg-purple-500 dark:bg-purple-600"
        case "MULTIPLE_CHOICE":
            return "bg-emerald-500 dark:bg-emerald-600"
        default:
            return "bg-blue-500 dark:bg-blue-600"
    }
}

function getBorderColorClass(type: string) {
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

function getBadgeColorClass(type: string) {
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

function getProgressBarColor(type: string, selected: boolean) {
    if (!selected) return "bg-gray-300 dark:bg-gray-600"
    
    switch(type) {
        case "BINARY": return "bg-cyan-500 dark:bg-cyan-600"
        case "SINGLE_CHOICE": return "bg-purple-500 dark:bg-purple-600"
        case "MULTIPLE_CHOICE": return "bg-emerald-500 dark:bg-emerald-600"
        default: return "bg-blue-500 dark:bg-blue-600"
    }
}

function getPollTypeInfo(type: string) {
    switch(type) {
        case "BINARY":
            return {
                text: _`Binary`,
                ribbonBg: "bg-cyan-500",
                ribbonText: "text-white",
                icon: <LuX class="w-4 h-4 mr-1" />,
                bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
                textColor: "text-cyan-700 dark:text-cyan-300",
                borderColor: "border-cyan-200 dark:border-cyan-800",
                description: _`Choose one option only`
            }
        case "SINGLE_CHOICE":
            return {
                text: _`Single Choice`,
                ribbonBg: "bg-purple-500",
                ribbonText: "text-white",
                icon: <LuCheck class="w-4 h-4 mr-1" />,
                bgColor: "bg-purple-100 dark:bg-purple-900/30",
                textColor: "text-purple-700 dark:text-purple-300",
                borderColor: "border-purple-200 dark:border-purple-800",
                description: _`Choose one option only`
            }
        case "MULTIPLE_CHOICE":
            return {
                text: _`Multiple Choice`,
                ribbonBg: "bg-emerald-500",
                ribbonText: "text-white",
                icon: <span class="mr-1 font-bold">+</span>,
                bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
                textColor: "text-emerald-700 dark:text-emerald-300",
                borderColor: "border-emerald-200 dark:border-emerald-800",
                description: _`Choose multiple options`
            }
        default:
            return {
                text: type,
                ribbonBg: "bg-blue-500",
                ribbonText: "text-white",
                icon: <LuCheck class="w-4 h-4 mr-1" />,
                bgColor: "bg-blue-100 dark:bg-blue-900/30",
                textColor: "text-blue-700 dark:text-blue-300",
                borderColor: "border-blue-200 dark:border-blue-800",
                description: _`Participate in this poll`
            }
    }
}
