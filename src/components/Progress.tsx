import { component$, useComputed$ } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
import { LuCheck } from '@qwikest/icons/lucide';

interface ProgressProps {
    userVotedOptions: number[];  // The options that the user has voted for
    votesCount: number;  // The total number of votes
    onClick$: QRL<(ev: Event) => void>;  // Function to be executed on click
    option: any;  // The option object
}

export const Progress = component$<ProgressProps>(({
    userVotedOptions,
    votesCount,
    option,
    onClick$
}) => {
    const voted = userVotedOptions.includes(option.id)
    const percentage = useComputed$(() =>
        votesCount > 0 ? (option.votes / (votesCount)) * 100 : 0
    )
    return (
        <div
            id={option.id.toString()}
            class={`relative w-full rounded-sm h-12 overflow-hidden cursor-pointer transition-all duration-200 border ${
                voted ? 'bg-blue-200 border-2 border-blue-500' : 'bg-gray-100 border border-gray-300'
            } hover:bg-blue-50 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            onClick$={onClick$}
            aria-pressed={voted}
            role="button"
            tabIndex={0}
            onKeyDown$={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    onClick$(event);
                }
            }}
        >
            {/* Progress bar (only rendered if percentage > 0) */}
            {percentage.value > 0 && (
                <div
                    class={`absolute top-0 left-0 h-full rounded-sm flex items-center px-4 ${
                        voted ? 'bg-blue-300' : 'bg-gray-200'
                    }`}
                    style={{ width: `${percentage.value}%`, pointerEvents: 'none' }}
                ></div>
            )}

            {/* Label */}
            <div class="absolute inset-0 flex items-center px-4 pointer-events-none">
                <span class={`whitespace-nowrap flex items-center ${
                    voted ? 'text-gray-900' : 'text-gray-800'
                }`}>
                    {option.text}
                    {voted && <LuCheck class="ml-2 h-4 w-4 text-green-600" />}
                </span>
            </div>

            {/* Percentage and number of votes at the end of the bar */}
            <div class="absolute top-0 right-4 h-full flex items-center text-gray-800">
                <span class="text-sm">{Math.round(percentage.value)}%</span>
                {/* Optional: Show number of votes per option */}
                {/* <span class="text-xs ml-2">({votes} votes)</span> */}
            </div>
        </div>
    );
});
