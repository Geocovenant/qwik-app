import { component$, type QRL } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import PollCard from "~/components/cards/PollCard";
import { type Poll, PollScope } from "~/shared/types";
import EmptyPolls from "~/components/empty-states/EmptyPolls";
import { Button } from "~/components/ui";
import { useComputed$ } from "@builder.io/qwik";
import {  } from "@builder.io/qwik";

export interface PollListProps {
    onCreatePoll: QRL<() => void>;
    province?: string | null;
    polls: Poll[];
    communityName?: string;
}

export const PollList = component$<PollListProps>(({ polls, onCreatePoll, province, communityName }) => {
    // Filtrar las encuestas por provincia cuando estemos en una vista provincial
    const filteredPolls = useComputed$(() => {
        return province ? polls.filter(poll => 
            poll.scope === PollScope.REGIONAL && 
            poll.provinces?.includes(province)
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
                        is_anonymous={poll.is_anonymous}
                        ends_at={poll.ends_at}
                        created_at={poll.created_at}
                        creator_username={poll.creator_username}
                        comments_count={poll.comments_count}
                        likes_count={poll.reactions.LIKE}
                        dislikes_count={poll.reactions.DISLIKE}
                        countries={poll.countries}
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


