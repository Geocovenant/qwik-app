import { component$, $, useSignal, useStore, useComputed$ } from "@builder.io/qwik";
import { LuThumbsUp, LuThumbsDown, LuMessageSquare, LuShare2, LuUser, LuTimer } from '@qwikest/icons/lucide';
import { _ } from "compiled-i18n";
import { Progress } from "~/components/Progress";
import { timeAgo } from "~/utils/dateUtils";
import { useVotePoll, useReactPoll } from "~/shared/actions";

interface PollCardProps {
    id: number
    title: string
    description: string
    options: { text: string; votes: number; id: number; voted: boolean }[]
    status: string
    type: string
    is_anonymous: boolean
    ends_at?: string | null
    created_at: string
    creator_username: string
    comments_count: number
    likes_count: number
    dislikes_count: number
}

export default component$<PollCardProps>(({ 
    id, 
    title, 
    description, 
    options, 
    type, 
    is_anonymous, 
    ends_at, 
    created_at,
    creator_username,
    comments_count,
    likes_count,
    dislikes_count,
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
        console.log('handleReaction')
        const result = await actionReact.submit({ 
            pollId: id, 
            reaction: reaction 
        });

        console.log('result2', result)
        if(result.status === 200) {
            pollState.options = result.value.options;
            likesCount.value = result.value.reactions.LIKE;
            dislikesCount.value = result.value.reactions.DISLIKE;
        }
    });

    return (
        <div class="p-6 mb-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow group">
            {/* Encabezado con título y descripción */}
            <div class="mb-4">
                <h3 class="text-2xl font-semibold mb-2 text-gray-800">{title}</h3>
                {description && <p class="text-gray-600 mb-4 text-sm">{description}</p>}
                <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <span class="font-medium">Total de votos:</span>
                    <span class="bg-gray-100 px-3 py-1 rounded-full font-semibold">
                        {totalVotes.value}
                    </span>
                </div>
            </div>

            {/* Opciones de votación */}
            <div class="space-y-3 mb-4">
                {pollState.options.map((option) => (
                    <Progress
                        key={option.id}
                        option={option}
                        votesCount={totalVotes.value}
                        voted={option.voted}
                        onClick$={() => handleVote(option.id)}
                    />
                ))}
            </div>

            {/* Footer con metadatos */}
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500 gap-3">
                <div class="flex items-center gap-4">
                    <div class="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                        <LuUser class="h-4 w-4 mr-1 text-gray-600" />
                        <span class="text-gray-700">
                            {is_anonymous ? _`Anonymous` : creator_username}
                        </span>
                    </div>
                    
                    <div class="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                        <LuTimer class="h-4 w-4 mr-1 text-gray-600" />
                        <span class="text-gray-700">
                            {timeAgo(new Date(created_at))}
                        </span>
                    </div>
                </div>

                {/* Estadísticas de interacción */}
                <div class="flex items-center gap-4">
                    <button 
                        onClick$={() => handleReaction('LIKE')}
                        class="flex items-center hover:text-blue-500 transition-colors cursor-pointer"
                    >
                        <LuThumbsUp class="h-4 w-4 mr-1" />
                        <span class="font-medium">{likesCount.value}</span>
                    </button>
                    <button 
                        onClick$={() => handleReaction('DISLIKE')}
                        class="flex items-center hover:text-red-500 transition-colors cursor-pointer"
                    >
                        <LuThumbsDown class="h-4 w-4 mr-1" />
                        <span class="font-medium">{dislikesCount.value}</span>
                    </button>
                    <div class="flex items-center hover:text-purple-500 transition-colors cursor-pointer">
                        <LuMessageSquare class="h-4 w-4 mr-1" />
                        <span class="font-medium">{comments_count}</span>
                    </div>
                    <div class="hover:text-green-500 transition-colors cursor-pointer">
                        <LuShare2 class="h-4 w-4" />
                    </div>
                </div>
            </div>

            {/* Estado de cierre */}
            {isClosed.value && (
                <div class="mt-4 text-center text-sm text-red-600 font-medium">
                    {_`This poll is closed`}
                </div>
            )}
        </div>
    );
});