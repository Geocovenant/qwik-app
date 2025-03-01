import { $, component$, type QRL } from "@builder.io/qwik"
import { _ } from "compiled-i18n"
import PollCard from "~/components/cards/PollCard"
import { type Poll, PollScope } from "~/shared/types"
import EmptyPolls from "~/components/empty-states/EmptyPolls"
import { Button } from "~/components/ui"
import { useComputed$, useSignal } from "@builder.io/qwik"
import { Pagination } from "@qwik-ui/headless"
import { LuPlus, LuFilter, LuSearch } from "@qwikest/icons/lucide"
import Modal from "~/components/Modal"
import SocialLoginButtons from "~/components/SocialLoginButtons"

export interface PollListProps {
    onCreatePoll: QRL<() => void>
    region?: string | null
    polls: {
        items: Poll[]
        total: number
        page: number
        size: number
        pages: number
    }
    communityName?: string
    onPageChange$: QRL<(page: number) => void>
    isAuthenticated?: boolean
}

export const PollList = component$<PollListProps>(({ polls, onCreatePoll, region, communityName, onPageChange$, isAuthenticated = true }) => {
    const searchTerm = useSignal('');
    const showLoginModal = useSignal(false);
    
    // Filter polls by region and search term
    const filteredPolls = useComputed$(() => {
        let filtered = region
            ? polls.items.filter((poll) => poll.scope === PollScope.REGIONAL && poll.regions?.includes(region))
            : polls.items;
            
        // Apply search filter if there's a search term
        if (searchTerm.value.trim()) {
            const term = searchTerm.value.toLowerCase();
            filtered = filtered.filter(poll => 
                poll.title.toLowerCase().includes(term)
            );
        }
        
        return filtered;
    });

    // Reusable search component
    const SearchBar = (
        <div class="flex items-center gap-3 w-full sm:w-auto">
            {/* Search bar */}
            <div class="relative flex-1 sm:max-w-xs">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LuSearch class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                    type="search"
                    class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-600 dark:focus:border-cyan-600"
                    placeholder={_`Search polls...`}
                    value={searchTerm.value}
                    onInput$={(e) => {
                        searchTerm.value = (e.target as HTMLInputElement).value;
                    }}
                />
                {searchTerm.value && (
                    <button 
                        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick$={() => { searchTerm.value = ''; }}
                        aria-label="Clear search"
                    >
                        <span class="text-xl">&times;</span>
                    </button>
                )}
            </div>

            {/* Filter button */}
            <Button class="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <LuFilter class="w-4 h-4 mr-1" />
                {_`Filter`}
            </Button>

            {/* Create poll button */}
            <Button
                class="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 shadow-sm"
                onClick$={onCreatePoll}
            >
                <LuPlus class="w-4 h-4 mr-1" />
                {_`Create`}
            </Button>
        </div>
    );

    // Show empty state if no polls match the filters
    if (!filteredPolls.value?.length) {
        if (searchTerm.value.trim()) {
            return (
                <div class="space-y-6 overflow-y-auto">
                    {/* Header with actions */}
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2">
                        <div class="flex-1">
                            <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span>{_`Polls`}</span>
                                <span class="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm px-2.5 py-0.5 rounded-full">
                                    0
                                </span>
                            </h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {communityName || _`Explore and vote on community polls`}
                            </p>
                        </div>

                        {SearchBar}
                    </div>

                    {/* Empty search results */}
                    <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                            <LuSearch class="w-8 h-8 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {_`No polls found`}
                        </h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-6">
                            {_`No polls match your search "${searchTerm.value}". Try different keywords or clear the search.`}
                        </p>
                        <Button 
                            class="bg-cyan-600 hover:bg-cyan-700 text-white"
                            onClick$={() => { searchTerm.value = ''; }}
                        >
                            {_`Clear search`}
                        </Button>
                    </div>
                </div>
            );
        }
        return <EmptyPolls onCreatePoll={onCreatePoll} communityName={communityName} />;
    }

    const onShowLoginModal = $(() => {
        showLoginModal.value = true;
    });

    return (
        <div class="space-y-6 overflow-y-auto">
            {/* Login modal */}
            <Modal
                title={_`Sign in to participate`}
                show={showLoginModal}
            >
                <div class="p-4 text-center">
                    <p class="mb-6 text-gray-600 dark:text-gray-300">{_`You need to sign in to vote on polls and participate in the community.`}</p>
                    <SocialLoginButtons />
                </div>
            </Modal>
            
            {/* Header with actions */}
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2">
                <div class="flex-1">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span>{_`Polls`}</span>
                        <span class="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm px-2.5 py-0.5 rounded-full">
                            {filteredPolls.value.length}
                        </span>
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {communityName || _`Explore and vote on community polls`}
                    </p>
                </div>

                {SearchBar}
            </div>

            {/* Poll list */}
            <ul class="space-y-4 px-2">
                {filteredPolls.value.map((poll: Poll) => (
                    <li key={`poll-${poll.id}`} class="transform transition-transform hover:-translate-y-1 duration-300">
                        <PollCard
                            id={poll.id}
                            slug={poll.slug}
                            title={poll.title}
                            description={poll.description}
                            options={poll.options}
                            status={poll.status}
                            scope={poll.scope}
                            type={poll.type}
                            isAnonymous={poll.is_anonymous}
                            endsAt={poll.ends_at}
                            createdAt={poll.created_at}
                            creatorUsername={poll.creator.username}
                            creatorAvatar={poll.creator.image}
                            commentsCount={poll.comments_count}
                            likesCount={poll.reactions.LIKE}
                            dislikesCount={poll.reactions.DISLIKE}
                            countries={poll.countries}
                            userVotedOptions={poll.user_voted_options}
                            userReaction={poll.user_reaction}
                            isAuthenticated={isAuthenticated}
                            onShowLoginModal$={onShowLoginModal}
                        />
                    </li>
                ))}
            </ul>

            {/* Pagination - only show if there are results and more than one page */}
            {polls.pages > 1 && !searchTerm.value.trim() && (
                <div class="mt-4 flex justify-center">
                    <Pagination
                        selectedPage={polls.page}
                        totalPages={polls.pages}
                        onPageChange$={onPageChange$}
                        class="pagination-wrapper"
                        selectedClass="pagination-selected-btn"
                        defaultClass="pagination-btn"
                        dividerClass="pagination-divider"
                        prevButtonClass="prevNextButtons"
                        nextButtonClass="prevNextButtons"
                    />
                </div>
            )}
        </div>
    )
})
