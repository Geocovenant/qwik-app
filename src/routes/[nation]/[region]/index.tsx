import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Tabs } from "~/components/ui";
import Breadcrumbs from "~/components/Breadcrumbs";
import Modal from "~/components/Modal";
import FormPoll from "~/components/forms/FormPoll";
import DebateList from "~/components/list/DebateList";
import { PollList } from "~/components/list/PollList";
import { CommunityType } from "~/constants/communityType";
import { useGetRegions, useGetRegionalPolls, useGetTags, useGetRegionalDebates } from "~/shared/loaders";
import { useSession } from "~/routes/plugin@auth";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import FormDebate from "~/components/forms/FormDebate";

export { useGetRegionalPolls, useGetRegionalDebates, useFormPollLoader, useFormDebateLoader, useGetRegions, useGetTags } from "~/shared/loaders";
export { useFormPollAction, useFormDebateAction, useVotePoll, useReactPoll } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const location = useLocation();
    const showModalPoll = useSignal(false);
    const showModalDebate = useSignal(false);
    const regionName = location.params.region;
    
    // useGetRegions is used to populate the select options in the regional poll form
    const regions = useGetRegions();
    const tags = useGetTags();
    const polls = useGetRegionalPolls();
    const debates = useGetRegionalDebates();

    const defaultRegion = useComputed$(() => {
        const normalizedRegionName = regionName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        return regions.value.find((r: { name: string; }) => r.name === normalizedRegionName);
    });

    const onSubmitCompleted = $(() => {
        showModalPoll.value = false;
    });

    const onCreatePoll = $(() => {
        showModalPoll.value = true;
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
                                title={_`Create poll for "${defaultRegion.value?.name}"`}
                                description={_`Create a poll for your community`}
                                show={showModalPoll}
                            >
                                {session.value?.user
                                    ? <FormPoll
                                        onSubmitCompleted={onSubmitCompleted}
                                        defaultScope={CommunityType.REGIONAL}
                                        defaultRegionId={defaultRegion.value?.id}
                                        regions={Array.isArray(regions.value) ? regions.value : []}
                                    />
                                    : <SocialLoginButtons />
                                }
                            </Modal>
                            <PollList
                                onCreatePoll={onCreatePoll}
                                polls={Array.isArray(polls.value) ? polls.value : []}
                                communityName={defaultRegion.value?.name}
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="debates" class="p-4">
                            <Modal
                                title={_`Crear debate para "${defaultRegion.value?.name}"`}
                                show={showModalDebate}
                            >
                                {session.value?.user
                                    ? <FormDebate
                                        onSubmitCompleted={onSubmitCompleted}
                                        defaultScope={CommunityType.REGIONAL}
                                        defaultRegionId={defaultRegion.value?.id}
                                        regions={Array.isArray(regions.value) ? regions.value : []}
                                        tags={tags.value}
                                    />
                                    : <SocialLoginButtons />
                                }
                            </Modal>
                            <DebateList
                                debates={Array.isArray(debates.value) ? debates.value : []}
                                onCreateDebate={onCreateDebate}
                                communityName={defaultRegion.value?.name}
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="issues" class="p-4">
                            {_`Issues`}
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
    title: "Geounity National",
    meta: [
        {
            name: "description",
            content: "Geounity National",
        },
    ],
};
