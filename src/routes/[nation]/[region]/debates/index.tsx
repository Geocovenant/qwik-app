import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate, useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import FormDebate from "~/components/forms/FormDebate";
import DebateList from "~/components/list/DebateList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import { capitalizeFirst } from "~/utils/capitalizeFirst";

// Import necessary loaders
import { useGetRegionalDebates, useGetRegions, useGetTags } from "~/shared/loaders";

export { useGetRegionalDebates, useGetRegions, useGetTags } from "~/shared/loaders";
export { useFormDebateAction } from "~/shared/forms/actions";

export default component$(() => {
    const session = useSession();
    const showModalDebate = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    
    const regions = useGetRegions();
    const tags = useGetTags();
    const debates = useGetRegionalDebates();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    const defaultRegion = useComputed$(() => {
        const normalizedRegionName = regionName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        return regions.value.find((r: { name: string; }) => r.name === normalizedRegionName);
    });

    const isAuthenticated = useComputed$(() => !!session.value?.user);
    const regionDisplayName = capitalizeFirst(regionName.replace(/-/g, ' '));

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
                            title={_`Create debate for ${regionDisplayName}`}
                            show={showModalDebate}
                        >
                            <FormDebate
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.REGIONAL}
                                defaultRegionId={defaultRegion.value?.id}
                                regions={Array.isArray(regions.value) ? regions.value : []}
                                tags={tags.value}
                            />
                        </Modal>
                        : <Modal
                            title={_`Sign in to create a debate`}
                            show={showModalDebate}
                        >
                            <SocialLoginButtons />
                        </Modal>
                    }
                    <DebateList
                        debates={{
                            items: Array.isArray(debates.value?.items) ? debates.value.items : [],
                            total: debates.value?.total || 0,
                            page: currentPage.value,
                            size: 10,
                            pages: Math.ceil((debates.value?.total || 0) / 10)
                        }}
                        communityName={regionDisplayName}
                        onCreateDebate={onCreateDebate}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/debates?page=${page}`);
                        }}
                        isAuthenticated={isAuthenticated.value}
                        onShowLoginModal$={onShowLoginModal}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const regionName = capitalizeFirst(params.region.replace(/-/g, ' '));
    return {
        title: `${regionName} - Debates`,
        meta: [
            {
                name: "description",
                content: `Community debates of ${regionName}`,
            },
        ],
    };
};
