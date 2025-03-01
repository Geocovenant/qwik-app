import { component$, type QRL } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { Button } from "~/components/ui";
import DebateCard from "~/components/cards/DebateCard";
import EmptyDebates from "~/components/empty-states/EmptyDebates";
import { type Debate } from "~/shared/types";

export interface DebateListProps {
    communityName?: string;
    debates: Debate[];
    onCreateDebate: QRL<() => void>;
}

export default component$<DebateListProps>(({ communityName, debates, onCreateDebate }) => {

    if (!debates.length) {
        return <EmptyDebates onCreateDebate={onCreateDebate} communityName={communityName} />;
    }
    
    return (
        <div class="p-2 space-y-4 overflow-y-auto">
            <Button 
                class="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600" 
                onClick$={onCreateDebate}
            >
                {_`Crear debate`}
            </Button>
            <ul class="space-y-3">
                {debates.map((debate: Debate) => (
                    <DebateCard
                        key={`debate-${debate.id}`}
                        id={debate.id}
                        title={debate.title}
                        description={debate.description}
                        images={debate.images}
                        creator_username={debate.creator.username}
                        creator_avatar={debate.creator.image}
                        created_at={debate.created_at}
                        last_comment_at={debate.last_comment_at}
                        slug={debate.slug}
                        tags={debate.tags}
                        comments_count={debate.comments_count}
                        scope={debate.scope}
                    />
                ))}
            </ul>
        </div>
    );
}); 