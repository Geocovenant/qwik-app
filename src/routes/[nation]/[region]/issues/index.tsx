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

// Import necessary loaders
import { useGetRegionalIssues, useGetRegions, useGetTags } from "~/shared/loaders";

// Export loaders so Qwik City can find them
export { useGetRegionalIssues, useFormIssueLoader, useGetRegions, useGetTags } from "~/shared/loaders";
export { useFormIssueAction } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalIssue = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    
    const regions = useGetRegions();
    const tags = useGetTags();
    const issues = useGetRegionalIssues();
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
        showModalIssue.value = false;
    });

    const onCreateIssue = $(() => {
        showModalIssue.value = true;
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="flex flex-col min-h-0">
                <div class="h-full overflow-y-auto">
                    <Modal 
                        title={_`Report issue in ${regionDisplayName}`} 
                        show={showModalIssue}
                    >
                        {session.value?.user
                            ? <FormIssue
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.REGIONAL}
                                defaultRegionId={defaultRegion.value?.id}
                                regions={Array.isArray(regions.value) ? regions.value : []}
                                tags={tags.value}
                            />
                            : <SocialLoginButtons />
                        }
                    </Modal>
                    <IssueList
                        onCreateIssue={onCreateIssue}
                        issues={{
                            items: Array.isArray(issues.value?.items) ? issues.value.items : [],
                            total: issues.value?.total || 0,
                            page: issues.value?.page || 1,
                            size: issues.value?.size || 10,
                            pages: issues.value?.pages || 1
                        }}
                        communityName={regionDisplayName}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/issues?page=${page}`);
                        }}
                        isAuthenticated={isAuthenticated.value}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const regionName = capitalizeFirst(params.region.replace(/-/g, ' '));
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
