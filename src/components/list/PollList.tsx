import { component$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import PollCard from "~/components/cards/PollCard";
import { useGetPollsByScope } from "~/shared/loaders";
import { type Poll } from "~/shared/types";
export default component$(() => {
    const polls = useGetPollsByScope()
    console.log('polls', polls.value)
    console.log('polls.options', polls.value[0].options)

    return (
        <div class="p-2 space-y-4 overflow-y-auto">
            {polls.value.length > 0 ? (
                <ul class="space-y-3">
                    {polls.value.map((poll: Poll) => (
                        <PollCard
                            key={`poll-${poll.id}`}
                            id={poll.id}
                            title={poll.title}
                            description={poll.description}
                            options={poll.options}
                            status={poll.status}
                            type={poll.type}
                            is_anonymous={poll.is_anonymous}
                            ends_at={poll.ends_at}
                            created_at={poll.created_at}
                            creator_username={poll.creator_username}
                            comments_count={0}
                            likes_count={poll.reactions.LIKE}
                            dislikes_count={poll.reactions.DISLIKE}
                            user_voted_options={[]}
                        />
                    ))}
                </ul>
            ) : (
                <p>{_`No poll available.`}</p>
            )}
        </div>
    );
});


