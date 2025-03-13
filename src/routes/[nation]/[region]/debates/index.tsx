import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate, useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import FormDebate from "~/components/forms/FormDebate";
import DebateList from "~/components/list/DebateList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import { dataArray as countries } from "~/data/countries";
import { capitalizeFirst } from "~/utils/capitalizeFirst";

import { useGetTags } from "~/shared/loaders";
import { useGetRegion, useGetRegionalDebates } from "~/shared/regional/loaders";
import { useGetRegions } from "~/shared/national/loaders";

export { useFormDebateLoader } from "~/shared/forms/loaders";
export { useFormDebateAction } from "~/shared/forms/actions";
export { useDeleteDebate } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalDebate = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;

    const nation = useComputed$(() => {
        return countries.find(country => country.name.toLowerCase() === nationName.toLowerCase());
    });
    
    // This request fetches the other regions of the nation
    const regions = useGetRegions();

    const region = useGetRegion();
    const debates = useGetRegionalDebates();
    const tags = useGetTags();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    // @ts-ignore
    const currentUsername = useComputed$(() => session.value?.user?.username || "");
    const isAuthenticated = useComputed$(() => !!session.value?.user);

    const onSubmitCompleted = $(() => {
        showModalDebate.value = false;
    });

    const onCreateDebate = $(() => {
        showModalDebate.value = true;
    });

    const onShowLoginModal = $(() => {
        showModalDebate.value = true;
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="flex flex-col min-h-0">
                <div class="h-full overflow-y-auto">
                    {session.value?.user
                        ? <Modal
                            title={_`Create debate for ${regionName || capitalizeFirst(regionName)}, ${nation.value?.name || capitalizeFirst(nationName)}`}
                            show={showModalDebate}
                        >
                            <FormDebate
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.REGIONAL}
                                defaultRegionId={region.value.id}
                                regions={Array.isArray(regions.value) ? regions.value : []}
                                tags={tags.value}
                            />
                        </Modal>
                        : <Modal
                            title={_`Log in to create a debate`}
                            show={showModalDebate}
                        >
                            <div class="p-4 text-center">
                                <p class="mb-6 text-gray-600 dark:text-gray-300">
                                    {_`You need to log in to create debates and participate in the community.`}
                                </p>
                                <SocialLoginButtons />
                            </div>
                        </Modal>
                    }
                    <DebateList
                        communityName={_`The ${capitalizeFirst(regionName)} community (${nationName})`}
                        currentUsername={currentUsername.value}
                        debates={{
                            items: debates.value.items,
                            total: debates.value.total,
                            page: debates.value.page,
                            size: debates.value.size,
                            pages: debates.value.pages
                        }}
                        isAuthenticated={isAuthenticated.value}
                        onCreateDebate={onCreateDebate}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/debates?page=${page}`);
                        }}
                        onShowLoginModal$={onShowLoginModal}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const regionName = capitalizeFirst(params.region || "");
    const nationName = capitalizeFirst(params.nation || "");
    return {
        title: `${regionName}, ${nationName} - Debates`,
        meta: [
            {
                name: "description",
                content: `Community debates of ${regionName}, ${nationName}`,
            },
        ],
    };
};
