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
import { useGetLocalityDebates, useGetTags } from "~/shared/loaders";

// Export loaders so Qwik City can find them
export { useGetLocalityDebates, useFormDebateLoader, useGetTags } from "~/shared/loaders";
export { useFormDebateAction } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalDebate = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const subregionName = location.params.subregion;
    const localityName = location.params.locality;
    
    const tags = useGetTags();
    const debates = useGetLocalityDebates();
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
                                defaultScope={CommunityType.LOCALITY}
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
                        communityName={localityDisplayName}
                        onCreateDebate={onCreateDebate}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/${subregionName}/${localityName}/debates?page=${page}`);
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