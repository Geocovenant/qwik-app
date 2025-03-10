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
import { useGetSubregionalDebates, useGetSubregions, useGetTags } from "~/shared/loaders";

export { useGetSubregionalDebates, useGetSubregions, useGetTags } from "~/shared/loaders";
export { useFormDebateAction } from "~/shared/forms/actions";

export default component$(() => {
    const session = useSession();
    const showModalDebate = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const subregionName = location.params.subregion;
    
    const subregions = useGetSubregions();
    const tags = useGetTags();
    const debates = useGetSubregionalDebates();
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
                            title={_`Create debate for ${subregionDisplayName}`}
                            show={showModalDebate}
                        >
                            <FormDebate
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.SUBREGIONAL}
                                subregions={Array.isArray(subregions.value) ? subregions.value : []}
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
                        communityName={subregionDisplayName}
                        onCreateDebate={onCreateDebate}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/${subregionName}/debates?page=${page}`);
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
    const subregionName = capitalizeFirst(params.subregion.replace(/-/g, ' '));
    return {
        title: `${subregionName} - Debates`,
        meta: [
            {
                name: "description",
                content: `Community debates of ${subregionName}`,
            },
        ],
    };
}; 