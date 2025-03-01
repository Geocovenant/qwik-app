import { component$, type QRL } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import PollCard from "~/components/cards/PollCard";
import { type Poll, PollScope } from "~/shared/types";
import EmptyPolls from "~/components/empty-states/EmptyPolls";
import { Button } from "~/components/ui";
import { useComputed$ } from "@builder.io/qwik";

export interface PollListProps {
    onCreatePoll: QRL<() => void>;
    region?: string | null;
    polls: Poll[];
    communityName?: string;
}

export const PollList = component$<PollListProps>(({ polls, onCreatePoll, region, communityName }) => {
    // Filtrar las encuestas por provincia cuando estemos en una vista provincial
    const filteredPolls = useComputed$(() => {
        return region ? polls.filter(poll => 
            poll.scope === PollScope.REGIONAL && 
            poll.regions?.includes(region)
        ) : polls;
    });

    if (!filteredPolls.value.length) {
        return <EmptyPolls onCreatePoll={onCreatePoll} communityName={communityName} />;
    }

    return (
        <div class="p-2 space-y-4 overflow-y-auto">
            <Button 
                class="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600" 
                onClick$={onCreatePoll}
            >
                {_`Create poll`}
            </Button>
            <ul class="space-y-3">
                {filteredPolls.value.map((poll: Poll) => (
                    <PollCard
                        key={`poll-${poll.id}`}
                        id={poll.id}
                        title={poll.title}
                        description={poll.description}
                        options={poll.options}
                        status={poll.status}
                        scope={poll.scope}
                        type={poll.type}
                        isAnonymous={poll.is_anonymous}
                        endsAt={poll.ends_at}
                        createdAt={poll.created_at}
                        creatorUsername={poll.creator_username}
                        commentsCount={poll.comments_count}
                        likesCount={poll.reactions.LIKE}
                        dislikesCount={poll.reactions.DISLIKE}
                        countries={poll.countries}
                        userVotedOptions={poll.user_voted_options}
                        userReaction={poll.user_reaction}
                    />
                ))}
            </ul>
            {/* Modal para mostrar comentarios */}
            {/* <Modal
                title={_`Comments`}
                show={showCommentsModal}
                description={_`Poll comments`}
                position="right"
            >
                <div class="space-y-4">
                    <CommentList comments={comments.value} />
                    <CommentForm 
                        pollId={selectedPollId.value!} 
                        onCommentAdded$={async () => {
                            // Aquí deberías recargar los comentarios después de agregar uno nuevo
                            // Por ejemplo:
                            // comments.value = await fetchComments(selectedPollId.value);
                        }} 
                    />
                </div>
            </Modal>
            <Modal
                title={_`Share Poll`}
                show={showShareModal}
                description={_`Share this poll with others`}
                position="center"
            >
                <FormShare share_link={shareLink.value} />
            </Modal> */}
        </div>
    );
});


