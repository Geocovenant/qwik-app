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
import { useGetSubregionalIssues, useGetSubregions, useGetTags } from "~/shared/loaders";

// Export loaders so Qwik City can find them
export { useGetSubregionalIssues, useFormIssueLoader, useGetSubregions, useGetTags } from "~/shared/loaders";
export { useFormIssueAction } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalIssue = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const subregionName = location.params.subregion;
    
    const subregions = useGetSubregions();
    const tags = useGetTags();
    const issues = useGetSubregionalIssues();
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
                        title={_`Report issue in ${subregionDisplayName}`} 
                        show={showModalIssue}
                    >
                        {session.value?.user
                            ? <FormIssue
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.SUBREGIONAL}
                                subregions={Array.isArray(subregions.value) ? subregions.value : []}
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
                        communityName={subregionDisplayName}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/${subregionName}/issues?page=${page}`);
                        }}
                        isAuthenticated={isAuthenticated.value}
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