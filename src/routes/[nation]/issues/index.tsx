import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate, useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import FormIssue from "~/components/forms/FormIssue";
import { IssueList } from "~/components/list/IssueList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import { dataArray as countries } from "~/data/countries";
import { capitalizeFirst } from "~/utils/capitalizeFirst";

// Import necessary loaders
import { useGetNationalIssues, useGetTags } from "~/shared/loaders";

// Export loaders so Qwik City can find them
export { useGetNationalIssues, useFormIssueLoader, useGetTags } from "~/shared/loaders";
export { useFormIssueAction } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalIssue = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const nation = useComputed$(() => {
        return countries.find(country => country.name.toLowerCase() === nationName.toLowerCase());
    });
    
    const tags = useGetTags();
    const issues = useGetNationalIssues();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    const isAuthenticated = useComputed$(() => !!session.value?.user);

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
                        title={_`Report issue in ${nation.value?.name || capitalizeFirst(nationName)}`} 
                        show={showModalIssue}
                    >
                        {session.value?.user
                            ? <FormIssue
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.NATIONAL}
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
                        communityName={nation.value?.name || capitalizeFirst(nationName)}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/issues?page=${page}`);
                        }}
                        isAuthenticated={isAuthenticated.value}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const nationName = capitalizeFirst(params.nation || "");
    return {
        title: `${nationName} - Issues`,
        meta: [
            {
                name: "description",
                content: `Reported issues in the community of ${nationName}`,
            },
        ],
    };
};
