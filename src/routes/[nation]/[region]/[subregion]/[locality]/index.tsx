import { $, component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Tabs } from "~/components/ui";
import Breadcrumbs from "~/components/Breadcrumbs";
import Modal from "~/components/Modal";
import FormPoll from "~/components/forms/FormPoll";
import DebateList from "~/components/list/DebateList";
import {PollList} from "~/components/list/PollList";
import { CommunityType } from "~/constants/communityType";
import { useSession } from "~/routes/plugin@auth";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import FormDebate from "~/components/forms/FormDebate";
import { useGetTags } from "~/shared/loaders";

export { useFormPollLoader, useGetTags, useFormDebateLoader } from "~/shared/loaders";
export { useFormPollAction, useVotePoll, useReactPoll, useFormDebateAction } from "~/shared/actions";

export default component$(() => {
    const showModal = useSignal(false);
    const session = useSession();
    const showModalDebate = useSignal(false);

    const tags = useGetTags();

    const onSubmitCompleted = $(() => {
        showModal.value = false;
    });

    const onCreatePoll = $(() => {
        showModal.value = true;
    });

    const onCreateDebate = $(() => {
        showModalDebate.value = true;
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="bg-gray-50 border-b">
                <Breadcrumbs />
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
                            <Tabs.Tab value="issues" class="px-4 py-2 hover:text-cyan-600 border-b-2 data-[state=selected]:border-cyan-600 data-[state=selected]:text-cyan-600">
                                {_`Issues`}
                            </Tabs.Tab>
                            <Tabs.Tab value="members" class="px-4 py-2 hover:text-cyan-600 border-b-2 data-[state=selected]:border-cyan-600 data-[state=selected]:text-cyan-600">
                                {_`Members`}
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="polls" class="p-4">
                            <Modal
                                title={_`Create poll`}
                                description={_`Create a poll for your community`}
                                show={showModal}
                            >
                                {session.value?.user
                                    ? <FormPoll
                                        onSubmitCompleted={onSubmitCompleted}
                                        defaultScope={CommunityType.LOCALITY}
                                    />
                                    : <SocialLoginButtons />
                                }
                            </Modal>
                            <PollList
                                onCreatePoll={onCreatePoll}
                                polls={[]}
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
                                        defaultScope={CommunityType.LOCALITY}
                                        tags={tags.value}
                                    />
                                    : <SocialLoginButtons />
                                }
                            </Modal>
                            <DebateList
                                debates={[]}
                                onCreateDebate={onCreateDebate}
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="projects" class="p-4">
                            {_`Proyects`}
                        </Tabs.Panel>

                        <Tabs.Panel value="issues" class="p-4">
                            {_`Issues`}
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
    title: "Geounity Locality",
    meta: [
        {
            name: "description",
            content: "Geounity Locality",
        },
    ],
};
