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

// Updated imports for regional data
import { useGetTags, useGetUser } from "~/shared/loaders";
import { useGetRegion, useGetRegionalIssues } from "~/shared/regional/loaders";
import { useGetRegions } from "~/shared/national/loaders";

export { useFormIssueLoader } from "~/shared/forms/loaders";
export { useFormIssueAction } from "~/shared/forms/actions";

export default component$(() => {
    const session = useSession();
    const user = useGetUser();
    const showModalIssue = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;

    // This request fetches the other regions of the nation
    const regions = useGetRegions();

    const region = useGetRegion();

    const tags = useGetTags();
    const issues = useGetRegionalIssues();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    // @ts-ignore
    const currentUsername = useComputed$(() => user.value.username || "");
    const isAuthenticated = useComputed$(() => !!session.value);

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
                        title={_`Report issue in ${capitalizeFirst(regionName)}`} 
                        show={showModalIssue}
                    >
                        {session.value
                            ? <FormIssue
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.REGIONAL}
                                defaultRegionId={region.value.id}
                                regions={Array.isArray(regions.value) ? regions.value : []}
                                tags={tags.value}
                            />
                            : <SocialLoginButtons />
                        }
                    </Modal>
                    <IssueList
                        communityName={_`The ${capitalizeFirst(regionName)} community in ${capitalizeFirst(nationName)}`}
                        currentUsername={currentUsername.value}
                        isAuthenticated={isAuthenticated.value}
                        issues={{
                            items: issues.value.items,
                            total: issues.value.total,
                            page: issues.value.page,
                            size: issues.value.size,
                            pages: issues.value.pages
                        }}
                        onCreateIssue={onCreateIssue}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/issues?page=${page}`);
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
    return {
        title: `${regionName} - Issues`,
        meta: [
            {
                name: "description",
                content: `Reported issues in the community of ${regionName}`,
            },
        ],
    };
};
