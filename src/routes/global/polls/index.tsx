import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import FormPoll from "~/components/forms/FormPoll";
import PollList from "~/components/list/PollList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import { useGetGlobalPolls } from "~/shared/loaders";

export { useGetGlobalPolls, useFormPollLoader, useFormReportLoader } from "~/shared/loaders";
export { useFormPollAction, useVotePoll, useReactPoll, useFormReportAction, useDeletePoll } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalPoll = useSignal(false);
    const polls = useGetGlobalPolls();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    const isAuthenticated = useComputed$(() => !!session.value?.user);
    const currentUsername = useComputed$(() => session.value?.user?.username || "");

    const onSubmitCompleted = $(() => {
        showModalPoll.value = false;
    });

    const onCreatePoll = $(() => {
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
                            <SocialLoginButtons />
                        </Modal>
                    }
                    <PollList
                        onCreatePoll={onCreatePoll}
                        polls={{
                            items: Array.isArray(polls.value?.items) ? polls.value.items : [],
                            total: polls.value?.total || 0,
                            page: polls.value?.page || 1,
                            size: polls.value?.size || 10,
                            pages: polls.value?.pages || 1
                        }}
                        communityName="The Global community"
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/global/polls?page=${page}`);
                        }}
                        isAuthenticated={isAuthenticated.value}
                        currentUsername={currentUsername.value}
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
