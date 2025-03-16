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

import { useGetSubregions } from "~/shared/regional/loaders";
import { useGetSubregion, useGetSubregionalPolls } from "~/shared/subregional/loaders";
import { useGetUser } from "~/shared/loaders";

export { useFormPollLoader } from "~/shared/forms/loaders";
export { useFormPollAction } from "~/shared/forms/actions";
export { useVotePoll, useReactPoll } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const user = useGetUser();
    const showModalPoll = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const subregionName = location.params.subregion;
    
    // This request fetches the other subregions of the region
    const subregions = useGetSubregions();

    const subregion = useGetSubregion();
    const polls = useGetSubregionalPolls();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    // @ts-ignore
    const currentUsername = useComputed$(() => user.value.username || "");
    const isAuthenticated = useComputed$(() => !!session.value);
    const subregionDisplayName = capitalizeFirst(subregionName.replace(/-/g, ' '));

    const onSubmitCompleted = $(() => {
        showModalPoll.value = false;
    });

    const onCreatePoll = $(() => {
        showModalPoll.value = true;
    });

    const onShowLoginModal = $(() => {
        showModalPoll.value = true;
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="flex flex-col min-h-0">
                <div class="h-full overflow-y-auto">
                    {session.value
                        ? <Modal
                            title={_`Create poll for ${subregionDisplayName}`}
                            show={showModalPoll}
                        >
                            <FormPoll
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.SUBREGIONAL}
                                defaultSubregionId={subregion.value.id}
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
                        communityName={subregionDisplayName}
                        currentUsername={currentUsername.value}
                        isAuthenticated={isAuthenticated.value}
                        onCreatePoll={onCreatePoll}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/${subregionName}/polls?page=${page}`);
                        }}
                        onShowLoginModal$={onShowLoginModal}
                        polls={{
                            items: polls.value.items,
                            total: polls.value.total || 0,
                            page: polls.value.page || 1,
                            size: polls.value.size || 10,
                            pages: polls.value.pages || 1
                        }}
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