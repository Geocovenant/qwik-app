import { component$, $, useSignal, useStore, useComputed$ } from "@builder.io/qwik";
import { LuThumbsUp, LuThumbsDown, LuMessageSquare, LuShare2, LuUser, LuTimer } from '@qwikest/icons/lucide';
import { _ } from "compiled-i18n";
import { timeAgo } from "~/utils/dateUtils";
import { useVotePoll, useReactPoll } from "~/shared/actions";
import { dataArray } from "~/data/countries";

interface PollCardProps {
    id: number
    title: string
    description: string
    options: { text: string; votes: number; id: number; voted: boolean }[]
    status: string
    type: string
    scope: string
    is_anonymous: boolean
    ends_at?: string | null
    created_at: string
    creator_username: string
    comments_count: number
    likes_count: number
    dislikes_count: number
    countries?: string[]
}

export default component$<PollCardProps>(({ 
    id, 
    title, 
    description, 
    options, 
    type, 
    scope,
    is_anonymous, 
    ends_at, 
    created_at,
    creator_username,
    comments_count,
    likes_count,
    dislikes_count,
    countries = [],
}) => {
    console.log('options', options)
    const actionVote = useVotePoll();
    const actionReact = useReactPoll();
    const pollState = useStore({ options });
    const likesCount = useSignal(likes_count);
    const dislikesCount = useSignal(dislikes_count);

    const totalVotes = useComputed$(() => 
        pollState.options.reduce((sum, option) => sum + option.votes, 0)
    );

    const isClosed = useComputed$(() => 
        ends_at && new Date(ends_at) < new Date() || false
    );

    const handleVote = $(async (optionId: number) => {
        let newOptions: number[] = [];
        const currentOption = pollState.options.find(opt => opt.id === optionId);
        
        if(type === 'BINARY' || type === 'SINGLE_CHOICE') {
            newOptions = currentOption?.voted ? [] : [optionId];
        } else if(type === 'MULTIPLE_CHOICE') {
            newOptions = pollState.options
                .filter(opt => opt.id === optionId ? !opt.voted : opt.voted)
                .map(opt => opt.id);
        }

        const result = await actionVote.submit({ 
            pollId: id, 
            optionIds: newOptions 
        });

        if(result.status === 200) {
            pollState.options = result.value.options;
        }
    });

    const handleReaction = $(async (reaction: 'LIKE' | 'DISLIKE') => {
        const result = await actionReact.submit({ 
            pollId: id, 
            reaction: reaction 
        });

        if(result.status === 200) {
            pollState.options = result.value.options;
            likesCount.value = result.value.reactions.LIKE;
            dislikesCount.value = result.value.reactions.DISLIKE;
        }
    });

    const getCountryData = (code: string) => {
        return dataArray.find(country => country.cca2 === code);
    };

    return (
        <div class="poll-card">
            {/* Encabezado */}
            <div class="mb-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-2xl font-bold text-text-primary">{title}</h3>
                    {scope === 'GLOBAL' && (
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
                    <span>Total de votos:</span>
                    <span class="bg-poll-option-bg px-3 py-1 rounded-full font-medium">
                        {totalVotes.value}
                    </span>
                </div>
            </div>

            {/* Opciones de votación */}
            <div class="space-y-3 mb-6">
                {pollState.options.map((option) => (
                    <div 
                        key={option.id} 
                        class="poll-option cursor-pointer hover:bg-accent/30 dark:hover:bg-accent/10 transition-colors"
                        onClick$={() => !isClosed.value && handleVote(option.id)}
                    >
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-text-primary font-medium">{option.text}</span>
                            <span class="text-text-secondary text-sm">
                                {option.votes} votos ({totalVotes.value > 0 
                                    ? ((option.votes / totalVotes.value) * 100).toFixed(1) 
                                    : '0'}%)
                            </span>
                        </div>
                        <div class="poll-progress">
                            <div 
                                class="poll-progress-bar"
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
                        <LuUser class="w-4 h-4" />
                        <span>{is_anonymous ? _`Anonymous` : creator_username}</span>
                    </div>
                    
                    <div class="flex items-center gap-2 bg-poll-option-bg px-3 py-1.5 rounded-full">
                        <LuTimer class="w-4 h-4" />
                        <span>{timeAgo(new Date(created_at))}</span>
                    </div>

                    {ends_at && (
                        <div class="flex items-center gap-2 bg-poll-option-bg/50 px-3 py-1.5 rounded-full border border-accent/20">
                            <span class="text-xs uppercase font-medium">{_`Ends`}:</span>
                            <span>{new Date(ends_at).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                <div class="flex items-center gap-3">
                    <button 
                        onClick$={() => handleReaction('LIKE')}
                        class="btn-interaction btn-like"
                    >
                        <LuThumbsUp class="w-5 h-5 mr-1.5" />
                        <span class="font-medium">{likesCount.value}</span>
                    </button>
                    <button 
                        onClick$={() => handleReaction('DISLIKE')}
                        class="btn-interaction btn-dislike"
                    >
                        <LuThumbsDown class="w-5 h-5 mr-1.5" />
                        <span class="font-medium">{dislikesCount.value}</span>
                    </button>
                    <button 
                        onClick$={() => {}}
                        class="btn-interaction btn-comment"
                    >
                        <LuMessageSquare class="w-5 h-5 mr-1.5" />
                        <span class="font-medium">{comments_count}</span>
                    </button>
                    <button 
                        onClick$={() => {}}
                        class="btn-interaction btn-share"
                    >
                        <LuShare2 class="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Estado de cierre */}
            {isClosed.value && (
                <div class="mt-4 py-2 px-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium text-center rounded-full">
                    {_`This poll is closed`}
                </div>
            )}
        </div>
    );
});