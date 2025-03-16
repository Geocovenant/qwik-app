import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate, useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import FormIssue from "~/components/forms/FormIssue";
import { IssueList } from "~/components/list/IssueList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import { capitalizeFirst } from "~/utils/capitalizeFirst";

// Import specific loaders for locality
import { useGetTags, useGetUser } from "~/shared/loaders";
import { useGetLocalities } from "~/shared/subregional/loaders";
import { useGetLocality, useGetLocalIssues } from "~/shared/local/loaders";

export { useFormIssueLoader } from "~/shared/forms/loaders";
export { useFormIssueAction } from "~/shared/forms/actions";

export default component$(() => {
    const session = useSession();
    const user = useGetUser();
    const showModalIssue = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const subregionName = location.params.subregion;
    const localityName = location.params.locality;

    // This request fetches the other localities of the subregion
    const localities = useGetLocalities();

    const tags = useGetTags();
    const locality = useGetLocality();
    const issues = useGetLocalIssues();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    // @ts-ignore
    const currentUsername = useComputed$(() => user.value.username || "");
    const isAuthenticated = useComputed$(() => !!session.value);
    const localityDisplayName = capitalizeFirst(localityName.replace(/-/g, ' '));

    const onSubmitCompleted = $(() => {
        showModalIssue.value = false;
    });

    const onCreateIssue = $(() => {
        showModalIssue.value = true;
    });

    const onShowLoginModal = $(() => {
        showModalIssue.value = true;
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="flex flex-col min-h-0">
                <div class="h-full overflow-y-auto">
                    <Modal 
                        title={_`Report issue in ${localityDisplayName}`} 
                        show={showModalIssue}
                    >
                        {session.value
                            ? <FormIssue
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.LOCAL}
                                defaultLocalityId={locality.value.id}
                                localities={Array.isArray(localities.value) ? localities.value : []}
                                tags={tags.value}
                            />
                            : <SocialLoginButtons />
                        }
                    </Modal>
                    <IssueList
                        communityName={_`The ${localityDisplayName} community`}
                        currentUsername={currentUsername.value}
                        isAuthenticated={isAuthenticated.value}
                        issues={{
                            items: issues.value.items,
                            total: issues.value.total || 0,
                            page: issues.value.page || 1,
                            size: issues.value.size || 10,
                            pages: issues.value.pages || 1
                        }}
                        onCreateIssue={onCreateIssue}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/${subregionName}/${localityName}/issues?page=${page}`);
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
        title: `${localityName} - Issues`,
        meta: [
            {
                name: "description",
                content: `Reported issues in the community of ${localityName}`,
            },
        ],
    };
};
