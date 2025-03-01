import { component$, $, useStore, useComputed$ } from "@builder.io/qwik";
import { LuArrowBigUp, LuArrowBigDown, LuMessageSquare, LuUser, LuTimer, LuLink } from '@qwikest/icons/lucide';
import { _ } from "compiled-i18n";
import { timeAgo } from "~/utils/dateUtils";
import { useVotePoll, useReactPoll } from "~/shared/actions";
import { dataArray } from "~/data/countries";
import { CommunityType } from "~/constants/communityType";

interface PollCardProps {
    id: number
    title: string
    description: string
    options: { text: string; votes: number; id: number; voted: boolean }[]
    status: string
    type: string
    scope: string
    isAnonymous: boolean
    endsAt?: string | null
    createdAt: string
    creatorUsername: string
    commentsCount: number
    likesCount: number
    dislikesCount: number
    countries?: string[]
    userVotedOptions?: number[]
    userReaction?: 'LIKE' | 'DISLIKE' | null
}

export default component$<PollCardProps>(({ 
    id, 
    title, 
    description, 
    options, 
    type, 
    scope,
    isAnonymous,
    endsAt,
    createdAt,
    creatorUsername,
    commentsCount,
    likesCount: initialLikesCount,
    dislikesCount: initialDislikesCount,
    countries = [],
    userVotedOptions = [],
    userReaction: initialUserReaction = null,
}) => {
    const actionVote = useVotePoll();
    const actionReact = useReactPoll();
    
    // Estado interno para votos y reacciones
    const pollState = useStore({ 
        options,
        userVotedOptions: userVotedOptions
    });
    
    const reactionState = useStore({
        userReaction: initialUserReaction,
        likesCount: initialLikesCount,
        dislikesCount: initialDislikesCount
    });

    const totalVotes = useComputed$(() => 
        pollState.options.reduce((sum, option) => sum + option.votes, 0)
    );

    const isClosed = useComputed$(() => 
        endsAt && new Date(endsAt) < new Date() || false
    );

    const handleVote = $(async (optionId: number) => {
        let newVotedOptions: number[] = [];
        const isVoted = pollState.userVotedOptions.includes(optionId);
        
        // Actualización optimista
        if(type === 'BINARY' || type === 'SINGLE_CHOICE') {
            newVotedOptions = isVoted ? [] : [optionId];
            
            // Actualizar contadores de votos
            pollState.options = pollState.options.map(opt => ({
                ...opt,
                votes: opt.id === optionId 
                    ? opt.votes + (isVoted ? -1 : 1)
                    : isVoted ? opt.votes : opt.votes - (opt.voted ? 1 : 0),
                voted: opt.id === optionId ? !isVoted : false
            }));
        } else if(type === 'MULTIPLE_CHOICE') {
            newVotedOptions = isVoted 
                ? pollState.userVotedOptions.filter(id => id !== optionId)
                : [...pollState.userVotedOptions, optionId];
            
            // Actualizar contador de votos
            pollState.options = pollState.options.map(opt => ({
                ...opt,
                votes: opt.id === optionId 
                    ? opt.votes + (isVoted ? -1 : 1)
                    : opt.votes,
                voted: opt.id === optionId ? !isVoted : opt.voted
            }));
        }

        // Actualizar estado de opciones votadas
        pollState.userVotedOptions = newVotedOptions;

        // Llamada a la API
        const result = await actionVote.submit({ 
            pollId: id, 
            optionIds: newVotedOptions 
        });

        // Si hay error, revertimos los cambios
        if(result.status !== 200) {
            pollState.options = options;
            pollState.userVotedOptions = userVotedOptions;
        }
    });

    const handleReaction = $(async (newReaction: 'LIKE' | 'DISLIKE') => {
        const previousReaction = reactionState.userReaction;
        
        // Actualización optimista
        if (newReaction === previousReaction) {
            // Si clickea en la misma reacción, la quitamos
            reactionState.userReaction = null;
            if (newReaction === 'LIKE') {
                reactionState.likesCount--;
            } else {
                reactionState.dislikesCount--;
            }
        } else {
            // Si cambia la reacción o agrega una nueva
            reactionState.userReaction = newReaction;
            
            if (previousReaction === 'LIKE') {
                reactionState.likesCount--;
            } else if (previousReaction === 'DISLIKE') {
                reactionState.dislikesCount--;
            }
            
            if (newReaction === 'LIKE') {
                reactionState.likesCount++;
            } else {
                reactionState.dislikesCount++;
            }
        }

        // Llamada a la API
        const result = await actionReact.submit({ 
            pollId: id, 
            reaction: newReaction 
        });

        // Si hay error, revertimos los cambios
        if (result.status !== 200) {
            reactionState.userReaction = previousReaction;
            reactionState.likesCount = initialLikesCount;
            reactionState.dislikesCount = initialDislikesCount;
        }
    });

    const getCountryData = (code: string) => {
        return dataArray.find(country => country.cca2 === code);
    };

    const copyPollLink = $(() => {
        try {
            const pollUrl = `${window.location.origin}/poll/${id}`;
            navigator.clipboard.writeText(pollUrl);
            console.log('Enlace copiado');
        } catch (error) {
            console.error('Error al copiar el enlace:', error);
        }
    });

    return (
        <div class="poll-card bg-card-bg dark:bg-gray-800/60 rounded-lg p-5 shadow-sm border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/90 transition-colors">
            {/* Header */}
            <div class="mb-5">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-2xl font-bold text-text-primary">{title}</h3>
                    {scope === CommunityType.GLOBAL && (
                        <span 
                            class="text-xl cursor-help"
                            title={_`Global`}
                        >
                            🌍
                        </span>
                    )}
                </div>
                {description && (
                    <p class="text-text-secondary text-sm mb-4">{description}</p>
                )}
                
                {countries.length > 0 && (
                    <div class="flex items-center gap-1 mb-3">
                        <span class="text-sm text-text-secondary mr-2">{_`Countries involved:`}</span>
                        <div class="flex gap-1">
                            {countries.map((code) => {
                                const country = getCountryData(code);
                                return country && (
                                    <span 
                                        key={code}
                                        class="text-xl cursor-help"
                                        title={country.name}
                                    >
                                        {country.flag}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div class="flex items-center gap-2 text-sm text-text-secondary">
                    <span>{_`Total votes:`}</span>
                    <span class="bg-poll-option-bg px-3 py-1 rounded-full font-medium">
                        {totalVotes.value}
                    </span>
                </div>
            </div>

            {/* Voting options */}
            <div class="space-y-3 mb-6">
                {pollState.options.map((option) => (
                    <div 
                        key={option.id} 
                        class={`poll-option p-3 rounded-lg cursor-pointer transition-colors ${
                            pollState.userVotedOptions.includes(option.id) 
                                ? 'bg-accent/15 dark:bg-accent/10 border-2 border-accent shadow-md' 
                                : 'bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 border border-border-light dark:border-border-dark'
                        }`}
                        onClick$={() => !isClosed.value && handleVote(option.id)}
                    >
                        <div class="flex justify-between items-center mb-2">
                            <span class={`${
                                pollState.userVotedOptions.includes(option.id) 
                                    ? 'text-accent-dark dark:text-accent-light text-lg font-bold' 
                                    : 'text-text-primary font-medium'
                            }`}>{option.text}</span>
                            <span class={`text-sm font-medium ${
                                pollState.userVotedOptions.includes(option.id)
                                    ? 'text-accent-dark dark:text-accent-light bg-accent/10 px-2 py-1 rounded-full'
                                    : 'text-text-secondary'
                            }`}>
                                {option.votes} {_`votes`} ({totalVotes.value > 0 
                                    ? ((option.votes / totalVotes.value) * 100).toFixed(1) 
                                    : '0'}%)
                            </span>
                        </div>
                        <div class="poll-progress h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                class={`poll-progress-bar h-full transition-all duration-300 ease-out ${
                                    pollState.userVotedOptions.includes(option.id)
                                        ? 'bg-accent shadow-sm'
                                        : 'bg-accent/40'
                                }`}
                                style={{ width: `${totalVotes.value > 0 
                                    ? (option.votes / totalVotes.value) * 100 
                                    : 0}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-text-secondary">
                <div class="flex flex-wrap items-center gap-3">
                    <div class="flex items-center gap-2 bg-poll-option-bg px-3 py-1.5 rounded-full">
                        <LuUser class={`w-4 h-4 ${isAnonymous ? 'text-yellow-500' : ''}`} />
                        <span class={isAnonymous ? 'font-semibold text-yellow-600 dark:text-yellow-400' : ''}>{isAnonymous ? _`Anonymous` : creatorUsername}</span>
                        {isAnonymous && (
                            <span class="ml-1 inline-flex items-center justify-center w-4 h-4 bg-yellow-200 dark:bg-yellow-700 rounded-full text-yellow-700 dark:text-yellow-200 text-xs" title={_`Anonymous poll`}>!</span>
                        )}
                    </div>
                    
                    <div class="flex items-center gap-2 bg-poll-option-bg px-3 py-1.5 rounded-full">
                        <LuTimer class="w-4 h-4" />
                        <span>{timeAgo(new Date(createdAt))}</span>
                    </div>

                    {endsAt && (
                        <div class="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-700 animate-pulse">
                            <span class="text-xs uppercase font-bold text-red-600 dark:text-red-400">{_`Ends`}:</span>
                            <span class="font-medium text-red-700 dark:text-red-300">{new Date(endsAt).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                <div class="flex items-center gap-3">
                    {/* Vote buttons group */}
                    <div class="vote-buttons-container flex border border-border-light dark:border-border-dark rounded-md overflow-hidden shadow-sm">
                        <button 
                            onClick$={() => handleReaction('LIKE')}
                            class={`group btn-interaction btn-like py-2 px-3 flex items-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-r border-border-light dark:border-border-dark transition-colors duration-300 ${
                                reactionState.userReaction === 'LIKE' ? 'bg-green-100 dark:bg-green-900/30' : ''
                            }`}
                            title={_`Upvote`}
                        >
                            <LuArrowBigUp class={`w-5 h-5 mr-1.5 ${
                                reactionState.userReaction === 'LIKE' 
                                    ? 'text-green-500' 
                                    : 'text-gray-500 group-hover:text-green-500'
                            } transition-colors duration-300`} />
                            <span class={`font-medium ${
                                reactionState.userReaction === 'LIKE'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-700 dark:text-gray-300 group-hover:text-green-500'
                            } transition-colors duration-300`}>{reactionState.likesCount}</span>
                        </button>
                        <button 
                            onClick$={() => handleReaction('DISLIKE')}
                            class={`group btn-interaction btn-dislike py-2 px-3 flex items-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 ${
                                reactionState.userReaction === 'DISLIKE' ? 'bg-red-100 dark:bg-red-900/30' : ''
                            }`}
                            title={_`Downvote`}
                        >
                            <LuArrowBigDown class={`w-5 h-5 mr-1.5 ${
                                reactionState.userReaction === 'DISLIKE' 
                                    ? 'text-red-500' 
                                    : 'text-gray-500 group-hover:text-red-500'
                            } transition-colors duration-300`} />
                            <span class={`font-medium ${
                                reactionState.userReaction === 'DISLIKE'
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-700 dark:text-gray-300 group-hover:text-red-500'
                            } transition-colors duration-300`}>{reactionState.dislikesCount}</span>
                        </button>
                    </div>
                    
                    <button 
                        onClick$={() => {}}
                        class="group btn-interaction btn-comment py-2 px-3 flex items-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-border-light dark:border-border-dark transition-colors duration-300 shadow-sm"
                        title={_`Comments`}
                    >
                        <LuMessageSquare class="w-5 h-5 mr-1.5 text-gray-500 group-hover:text-blue-500 transition-colors duration-300" />
                        <span class="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-300">{commentsCount}</span>
                    </button>
                    
                    <button 
                        onClick$={copyPollLink}
                        class="group btn-interaction btn-share p-2 flex items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-border-light dark:border-border-dark transition-colors duration-300 shadow-sm"
                        title={_`Copy link`}
                    >
                        <LuLink class="w-5 h-5 text-gray-500 group-hover:text-purple-500 transition-colors duration-300" />
                    </button>
                </div>
            </div>

            {/* Closed state */}
            {isClosed.value && (
                <div class="mt-4 py-2 px-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium text-center rounded-full">
                    {_`This poll is closed`}
                </div>
            )}
        </div>
    );
});