import { $, component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Breadcrumb, Tabs } from "~/components/ui";
import Modal from "~/components/Modal";
import FormPoll from "~/components/forms/FormPoll";
import DebateList from "~/components/list/DebateList";
import { PollList } from "~/components/list/PollList";
import { CommunityType } from "~/constants/communityType";
import { useGetInternationalDebates, useGetInternationalPolls, useGetTags } from "~/shared/loaders";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import FormDebate from "~/components/forms/FormDebate";
export { useGetInternationalPolls, useGetInternationalDebates, useFormPollLoader, useFormDebateLoader, useGetTags } from "~/shared/loaders";
export { useFormPollAction, useVotePoll, useReactPoll, useFormDebateAction } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalPoll = useSignal(false);
    const showModalDebate = useSignal(false);
    const tags = useGetTags();
    const polls = useGetInternationalPolls();
    const debates = useGetInternationalDebates();

    const onSubmitCompleted = $(() => {
        showModalPoll.value = false;
        showModalDebate.value = false;
    });

    const onCreatePoll = $(() => {
        showModalPoll.value = true;
    });

    const onCreateDebate = $(() => {
        showModalDebate.value = true;
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="bg-gray-50 border-b p-1">
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="/">International</Breadcrumb.Link>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
            </div>

            <div class="flex flex-col min-h-0">
                <div class="h-full overflow-y-auto">
                    <Tabs.Root class="w-full">
                        <Tabs.List class="flex border-b border-gray-200">
                            <Tabs.Tab value="polls" class="px-4 py-2 hover:text-cyan-600 border-b-2 data-[state=selected]:border-cyan-600 data-[state=selected]:text-cyan-600">
                                {_`Polls`}
                            </Tabs.Tab>
                            <Tabs.Tab value="debates" class="px-4 py-2 hover:text-cyan-600 border-b-2 data-[state=selected]:border-cyan-600 data-[state=selected]:text-cyan-600">
                                {_`Debates`}
                            </Tabs.Tab>
                            <Tabs.Tab value="projects" class="px-4 py-2 hover:text-cyan-600 border-b-2 data-[state=selected]:border-cyan-600 data-[state=selected]:text-cyan-600">
                                {_`Proyects`}
                            </Tabs.Tab>
                            <Tabs.Tab value="members" class="px-4 py-2 hover:text-cyan-600 border-b-2 data-[state=selected]:border-cyan-600 data-[state=selected]:text-cyan-600">
                                {_`Members`}
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="polls" class="p-4">
                            <Modal
                                title={_`Create poll`}
                                show={showModalPoll}
                            >
                                {session.value?.user
                                    ? <FormPoll
                                        onSubmitCompleted={onSubmitCompleted}
                                        defaultScope={CommunityType.INTERNATIONAL}
                                    />
                                    :
                                    <SocialLoginButtons />
                                }
                            </Modal>
                            <PollList
                                onCreatePoll={onCreatePoll}
                                polls={Array.isArray(polls.value) ? polls.value : []}
                                communityName="the international community"
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="debates" class="p-4">
                            <Modal
                                title={_`Crear debate`}
                                show={showModalDebate}
                            >
                                {session.value?.user
                                    ? <FormDebate
                                        onSubmitCompleted={onSubmitCompleted}
                                        defaultScope={CommunityType.INTERNATIONAL}
                                        tags={tags.value}
                                    />
                                    : <SocialLoginButtons />
                                }
                            </Modal>
                            <DebateList
                                communityName="the international community"
                                onCreateDebate={onCreateDebate}
                                debates={Array.isArray(debates.value) ? debates.value : []}
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="projects" class="p-4">
                            {_`Proyects`}
                        </Tabs.Panel>

                        <Tabs.Panel value="members" class="p-4">
                            {_`Members`}
                        </Tabs.Panel>
                    </Tabs.Root>
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Geounity International",
    meta: [
        {
            name: "description",
            content: "Geounity International",
        },
    ],
};