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

import { useGetTags } from "~/shared/loaders";
import { useGetLocalities } from "~/shared/subregional/loaders";
import { useGetLocality, useGetLocalDebates } from "~/shared/local/loaders";

export { useFormDebateLoader } from "~/shared/forms/loaders";
export { useFormDebateAction } from "~/shared/forms/actions";
export { useDeleteDebate } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalDebate = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const subregionName = location.params.subregion;
    const localityName = location.params.locality;
    
    // This request fetches the other localities of the subregion
    const localities = useGetLocalities();

    const locality = useGetLocality();
    const tags = useGetTags();
    const debates = useGetLocalDebates();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    const isAuthenticated = useComputed$(() => !!session.value?.user);
    const localityDisplayName = capitalizeFirst(localityName.replace(/-/g, ' '));

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
                            title={_`Create debate for ${localityDisplayName}`}
                            show={showModalDebate}
                        >
                            <FormDebate
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.LOCAL}
                                defaultLocalityId={locality.value.id}
                                localities={Array.isArray(localities.value) ? localities.value : []}
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
                        communityName={localityDisplayName}
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
                            await nav(`/${nationName}/${regionName}/${subregionName}/${localityName}/debates?page=${page}`);
                        }}
                        onShowLoginModal$={onShowLoginModal}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const localityName = capitalizeFirst(params.locality.replace(/-/g, ' '));
    return {
        title: `${localityName} - Debates`,
        meta: [
            {
                name: "description",
                content: `Community debates of ${localityName}`,
            },
        ],
    };
};
