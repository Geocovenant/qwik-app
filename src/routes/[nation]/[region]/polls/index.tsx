import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate, useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import FormPoll from "~/components/forms/FormPoll";
import PollList from "~/components/list/PollList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import { dataArray as countries } from "~/data/countries";
import { capitalizeFirst } from "~/utils/capitalizeFirst";

import { useGetRegions } from "~/shared/national/loaders";
import { useGetRegion, useGetRegionalPolls } from "~/shared/regional/loaders";

export { useFormPollLoader } from "~/shared/forms/loaders";
export { useFormPollAction } from "~/shared/forms/actions";
export { useVotePoll, useReactPoll, useFormReportAction, useDeletePoll } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalPoll = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    
    const nation = useComputed$(() => {
        return countries.find(country => country.name.toLowerCase() === nationName.toLowerCase());
    });
    
    // This request fetches the other regions of the nation
    const regions = useGetRegions();

    const region = useGetRegion();
    const polls = useGetRegionalPolls();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    // @ts-ignore
    const currentUsername = useComputed$(() => session.value?.user?.username || "");
    const isAuthenticated = useComputed$(() => !!session.value?.user);

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
                    {session.value?.user
                        ? <Modal
                            title={_`Create poll for ${regionName || capitalizeFirst(regionName)}, ${nation.value?.name || capitalizeFirst(nationName)}`}
                            show={showModalPoll}
                        >
                            <FormPoll
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.REGIONAL}
                                defaultRegionId={region.value.id}
                                regions={Array.isArray(regions.value) ? regions.value : []}
                            />
                        </Modal>
                        : <Modal
                            title={_`Sign in to create a poll`}
                            show={showModalPoll}
                        >
                            <div class="p-4 text-center">
                                <p class="mb-6 text-gray-600 dark:text-gray-300">
                                    {_`You need to sign in to create polls and participate in the community.`}
                                </p>
                                <SocialLoginButtons />
                            </div>
                        </Modal>
                    }
                    <PollList
                        communityName={_`The ${regionName || capitalizeFirst(regionName)} community in ${nation.value?.name || capitalizeFirst(nationName)}`}
                        currentUsername={currentUsername.value}
                        isAuthenticated={isAuthenticated.value}
                        onCreatePoll={onCreatePoll}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/polls?page=${page}`);
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
    const nationName = capitalizeFirst(params.nation || "");
    const regionName = capitalizeFirst(params.region || "");
    return {
        title: `${regionName}, ${nationName} - Polls`,
        meta: [
            {
                name: "description",
                content: `Regional polls of ${regionName} in ${nationName}`,
            },
        ],
    };
};
