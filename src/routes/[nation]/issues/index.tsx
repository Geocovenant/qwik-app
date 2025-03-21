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
import { useGetTags, useGetUser } from "~/shared/loaders";
import { useGetNationalIssues } from "~/shared/national/loaders";

export { useFormIssueLoader } from "~/shared/forms/loaders";
export { useFormIssueAction } from "~/shared/forms/actions";

export default component$(() => {
    const session = useSession();
    const user = useGetUser();
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
                        title={_`Report issue in ${nation.value?.name || capitalizeFirst(nationName)}`} 
                        show={showModalIssue}
                    >
                        {session.value
                            ? <FormIssue
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.NATIONAL}
                                defaultCountry={nation.value?.cca2}
                                tags={tags.value}
                            />
                            : <SocialLoginButtons />
                        }
                    </Modal>
                    <IssueList
                        communityName={nation.value?.name || capitalizeFirst(nationName)}
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
                            await nav(`/${nationName}/issues?page=${page}`);
                        }}
                        onShowLoginModal$={onShowLoginModal}
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
