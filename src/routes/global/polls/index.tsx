import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import FormPoll from "~/components/forms/FormPoll";
import PollList from "~/components/list/PollList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";

import { useGetGlobalPolls } from "~/shared/global/loaders";

export { useFormPollLoader } from "~/shared/forms/loaders";
export { useFormPollAction } from "~/shared/forms/actions";
export { useVotePoll, useReactPoll, useDeletePoll } from "~/shared/actions";

export default component$(() => {
    const polls = useGetGlobalPolls();
    const session = useSession();
    const showModalPoll = useSignal(false);
    const currentPage = useSignal(1);
    const nav = useNavigate();

    const isAuthenticated = useComputed$(() => !!session.value?.user);
    
    // @ts-ignore
    const currentUsername = useComputed$(() => session.value?.user?.username || "");

    const onSubmitCompleted = $(() => {
        showModalPoll.value = false;
    });

    const onCreatePoll = $(() => {
        showModalPoll.value = true;
    });

    const onShowLoginModal = $(() => {
        showModalPoll.value = true;
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="flex flex-col min-h-0">
                <div class="h-full overflow-y-auto">
                    {session.value?.user
                        ? <Modal
                            title={_`Create poll`}
                            show={showModalPoll}
                        >
                            <FormPoll
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.GLOBAL}
                            />
                        </Modal>
                        : <Modal
                            title={_`Sign in to create a poll`}
                            show={showModalPoll}
                        >
                            <div class="p-4 text-center">
                                <p class="mb-6 text-gray-600 dark:text-gray-300">
                                    {_`You need to sign in to create polls and participate in the community.`}
                                </p>
                                <SocialLoginButtons />
                            </div>
                        </Modal>
                    }
                    <PollList
                        communityName={_`The Global community`}
                        currentUsername={currentUsername.value}
                        isAuthenticated={isAuthenticated.value}
                        onCreatePoll={onCreatePoll}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/global/polls?page=${page}`);
                        }}
                        onShowLoginModal$={onShowLoginModal}
                        polls={{
                            items: polls.value.items,
                            total: polls.value.total || 0,
                            page: polls.value.page || 1,
                            size: polls.value.size || 10,
                            pages: polls.value.pages || 1
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Global Polls",
    meta: [
        {
            name: "description",
            content: "Global Polls",
        },
    ],
};
