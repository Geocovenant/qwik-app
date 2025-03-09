import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate, useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import FormPoll from "~/components/forms/FormPoll";
import PollList from "~/components/list/PollList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import { capitalizeFirst } from "~/utils/capitalizeFirst";

// Import necessary loaders
import { useGetSubregionalPolls, useGetSubregions } from "~/shared/loaders";

// Export loaders so Qwik City can find them
export { useGetSubregionalPolls, useFormPollLoader, useGetSubregions } from "~/shared/loaders";
export { useVotePoll, useReactPoll } from "~/shared/actions";
export { useFormPollAction } from "~/shared/forms/actions";

export default component$(() => {
    const session = useSession();
    const showModalPoll = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const subregionName = location.params.subregion;
    
    const subregions = useGetSubregions();
    const polls = useGetSubregionalPolls();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    const defaultSubregion = useComputed$(() => {
        const normalizedSubregionName = subregionName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        return subregions.value.find((r: { name: string; }) => r.name === normalizedSubregionName);
    });

    const isAuthenticated = useComputed$(() => !!session.value?.user);
    const subregionDisplayName = capitalizeFirst(subregionName.replace(/-/g, ' '));

    const onSubmitCompleted = $(() => {
        showModalPoll.value = false;
    });

    const onCreatePoll = $(() => {
        showModalPoll.value = true;
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="flex flex-col min-h-0">
                <div class="h-full overflow-y-auto">
                    {session.value?.user
                        ? <Modal
                            title={_`Create poll for ${subregionDisplayName}`}
                            show={showModalPoll}
                        >
                            <FormPoll
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.SUBREGIONAL}
                                subregions={Array.isArray(subregions.value) ? subregions.value : []}
                            />
                        </Modal>
                        : <Modal
                            title={_`Sign in to create a poll`}
                            show={showModalPoll}
                        >
                            <SocialLoginButtons />
                        </Modal>
                    }
                    <PollList
                        onCreatePoll={onCreatePoll}
                        polls={{
                            items: Array.isArray(polls.value?.items) ? polls.value.items : [],
                            total: polls.value?.total || 0,
                            page: polls.value?.page || 1,
                            size: polls.value?.size || 10,
                            pages: polls.value?.pages || 1
                        }}
                        communityName={subregionDisplayName}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/${subregionName}/polls?page=${page}`);
                        }}
                        isAuthenticated={isAuthenticated.value}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const subregionName = capitalizeFirst(params.subregion.replace(/-/g, ' '));
    return {
        title: `${subregionName} - Polls`,
        meta: [
            {
                name: "description",
                content: `Community polls of ${subregionName}`,
            },
        ],
    };
}; 