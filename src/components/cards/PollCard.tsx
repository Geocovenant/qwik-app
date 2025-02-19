import { component$, $, useSignal, useStore, useComputed$ } from "@builder.io/qwik";
import { LuThumbsUp, LuThumbsDown, LuMessageSquare, LuShare2, LuUser, LuTimer } from '@qwikest/icons/lucide';
import { _ } from "compiled-i18n";
import { Progress } from "~/components/Progress";
import { timeAgo } from "~/utils/dateUtils";
import { useVotePoll } from "~/shared/actions";

interface PollCardProps {
    id: number
    title: string
    description: string
    options: { text: string; votes: number; id: number }[]
    status: string
    type: string
    is_anonymous: boolean
    ends_at?: string | null
    created_at: string
    creator_username: string
    comments_count: number
    likes_count: number
    dislikes_count: number
    user_voted_options: number[]
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
    user_voted_options
}) => {
    const actionVote = useVotePoll();
    const pollState = useStore({ options });
    const userVotedOptions = useSignal<number[]>(user_voted_options);
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
        
        if(type === 'BINARY' || type === 'SINGLE_CHOICE') {
            newOptions = userVotedOptions.value.includes(optionId) ? [] : [optionId];
        } else if(type === 'MULTIPLE_CHOICE') {
            newOptions = userVotedOptions.value.includes(optionId)
                ? userVotedOptions.value.filter(id => id !== optionId)
                : [...userVotedOptions.value, optionId];
        }

        const result = await actionVote.submit({ 
            pollId: id, 
            optionIds: newOptions 
        });

        if(result.value.success) {
            userVotedOptions.value = newOptions;
            pollState.options = result.value.updatedOptions;
        }
    });

    return (
        <div class="p-6 mb-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow group">
            {/* Encabezado con título y descripción */}
            <div class="mb-4">
                <h3 class="text-2xl font-semibold mb-2 text-gray-800">{title}</h3>
                {description && <p class="text-gray-600 mb-4 text-sm">{description}</p>}
            </div>

            {/* Opciones de votación */}
            <div class="space-y-3 mb-4">
                {pollState.options.map((option) => (
                    <Progress
                        key={option.id}
                        option={option}
                        votesCount={totalVotes.value}
                        userVotedOptions={userVotedOptions.value}
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
                    <div class="flex items-center hover:text-blue-500 transition-colors cursor-pointer">
                        <LuThumbsUp class="h-4 w-4 mr-1" />
                        <span class="font-medium">{likesCount.value}</span>
                    </div>
                    <div class="flex items-center hover:text-red-500 transition-colors cursor-pointer">
                        <LuThumbsDown class="h-4 w-4 mr-1" />
                        <span class="font-medium">{dislikesCount.value}</span>
                    </div>
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