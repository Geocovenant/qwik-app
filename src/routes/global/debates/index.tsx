import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import FormDebate from "~/components/forms/FormDebate";
import DebateList from "~/components/list/DebateList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";

import { useGetTags, useGetUser } from "~/shared/loaders";
import { useGetGlobalDebates } from "~/shared/global/loaders";

export { useFormDebateLoader } from "~/shared/forms/loaders";
export { useFormDebateAction } from "~/shared/forms/actions";
export { useDeleteDebate } from "~/shared/actions"

export default component$(() => {
    const session = useSession();
    const user = useGetUser();
    const showModalDebate = useSignal(false);
    const debates = useGetGlobalDebates();
    const tags = useGetTags();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    // @ts-ignore
    const currentUsername = useComputed$(() => user.value.username || "");
    const isAuthenticated = useComputed$(() => !!session.value);

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
                    {session.value
                        ? <Modal
                            title={_`Create debate`}
                            show={showModalDebate}
                        >
                            <FormDebate
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.GLOBAL}
                                tags={tags.value}
                            />
                        </Modal>
                        : <Modal
                            title={_`Log in to create a debate`}
                            show={showModalDebate}
                        >
                            <div class="p-4 text-center">
                                <p class="mb-6 text-gray-600 dark:text-gray-300">
                                    {_`You need to log in to create debates and participate in the community.`}
                                </p>
                                <SocialLoginButtons />
                            </div>
                        </Modal>
                    }
                    <DebateList
                        communityName={_`The Global community`}
                        currentUsername={currentUsername.value}
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
                            await nav(`/global/debates?page=${page}`);
                        }}
                        onShowLoginModal$={onShowLoginModal}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Global Debates",
    meta: [
        {
            name: "description",
            content: "Global Debates",
        },
    ],
};
