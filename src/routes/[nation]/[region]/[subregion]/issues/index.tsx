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

import { useGetTags } from "~/shared/loaders";
import { useGetSubregion, useGetSubregionalIssues } from "~/shared/subregional/loaders";
import { useGetSubregions } from "~/shared/regional/loaders";

export { useFormIssueLoader } from "~/shared/forms/loaders";
export { useFormIssueAction } from "~/shared/forms/actions";

export default component$(() => {
    const session = useSession();
    const showModalIssue = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const subregionName = location.params.subregion;

    // This request fetches the other subregions of the region
    const subregions = useGetSubregions();
    
    const subregion = useGetSubregion();
    
    const tags = useGetTags();
    const issues = useGetSubregionalIssues();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    // @ts-ignore
    const currentUsername = useComputed$(() => user.value.username || "");
    const isAuthenticated = useComputed$(() => !!session.value);

    const subregionDisplayName = capitalizeFirst(subregionName.replace(/-/g, ' '));

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
                        title={_`Report issue in ${subregionDisplayName}`} 
                        show={showModalIssue}
                    >
                        {session.value
                            ? <FormIssue
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.SUBREGIONAL}
                                defaultSubregionId={subregion.value.id}
                                subregions={Array.isArray(subregions.value) ? subregions.value : []}
                                tags={tags.value}
                            />
                            : <SocialLoginButtons />
                        }
                    </Modal>
                    <IssueList
                        communityName={_`The ${capitalizeFirst(subregionName)} community in ${capitalizeFirst(nationName)}`}
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
                            await nav(`/${nationName}/${regionName}/${subregionName}/issues?page=${page}`);
                        }}
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
        title: `${subregionName} - Issues`,
        meta: [
            {
                name: "description",
                content: `Reported issues in the community of ${subregionName}`,
            },
        ],
    };
}; 