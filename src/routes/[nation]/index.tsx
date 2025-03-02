import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import { useLocation, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Breadcrumb, Tabs } from "~/components/ui";
import Modal from "~/components/Modal";
import FormPoll from "~/components/forms/FormPoll";
import DebateList from "~/components/list/DebateList";
import { PollList } from "~/components/list/PollList";
import { CommunityType } from "~/constants/communityType";
import { dataArray as countries } from "~/data/countries";
import { useGetNationalDebates, useGetNationalPolls, useGetTags } from "~/shared/loaders";
import { useSession } from "~/routes/plugin@auth";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import FormDebate from "~/components/forms/FormDebate";
import { capitalizeFirst } from '~/utils/capitalizeFirst';

export { useGetNationalPolls, useGetNationalDebates, useFormPollLoader, useFormDebateLoader, useGetTags } from "~/shared/loaders";
export { useFormPollAction, useVotePoll, useReactPoll, useFormDebateAction } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const location = useLocation();
    const showModalPoll = useSignal(false);
    const showModalDebate = useSignal(false);
    const nationName = location.params.nation;
    const nation = useComputed$(() => {
        return countries.find(country => country.name.toLowerCase() === nationName.toLowerCase());
    });

    const tags = useGetTags();
    const polls = useGetNationalPolls();
    const debates = useGetNationalDebates();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    const isAuthenticated = useComputed$(() => !!session.value?.user);
    
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
            <div class="bg-gray-50 border-b py-1 px-2">
                <Breadcrumb.Root>
                    <Breadcrumb.List class="text-lg">
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="/global">Global</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href={`/${nationName}`}>{capitalizeFirst(nationName)}</Breadcrumb.Link>
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
                            <Tabs.Tab value="issues" class="px-4 py-2 hover:text-cyan-600 border-b-2 data-[state=selected]:border-cyan-600 data-[state=selected]:text-cyan-600">
                                {_`Issues`}
                            </Tabs.Tab>
                            <Tabs.Tab value="members" class="px-4 py-2 hover:text-cyan-600 border-b-2 data-[state=selected]:border-cyan-600 data-[state=selected]:text-cyan-600">
                                {_`Members`}
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="polls" class="p-4">
                            <Modal
                                title={_`Create poll for ${nation.value?.name} (${nation.value?.cca2}) ${nation.value?.flag}`}
                                show={showModalPoll}
                            >
                                {session.value?.user
                                    ? <FormPoll
                                        onSubmitCompleted={onSubmitCompleted}
                                        defaultScope={CommunityType.NATIONAL}
                                    />
                                    : <SocialLoginButtons />
                                }
                            </Modal>
                            <PollList
                                onCreatePoll={onCreatePoll}
                                polls={{
                                    items: Array.isArray(polls.value?.items) ? polls.value.items : [],
                                    total: polls.value?.total || 0,
                                    page: polls.value?.page || 1,
                                    size: polls.value?.size || 10,
                                    pages: polls.value?.pages || 1
                                }}
                                communityName="The International community"
                                onPageChange$={async (page: number) => {
                                    currentPage.value = page;
                                    await nav(`/global?page=${page}`);
                                }}
                                isAuthenticated={isAuthenticated.value}
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="debates" class="p-4">
                            <Modal
                                title={_`Crear debate para ${nation.value?.name} (${nation.value?.cca2}) ${nation.value?.flag}`}
                                show={showModalDebate}
                            >
                                {session.value?.user
                                    ? <FormDebate
                                        onSubmitCompleted={onSubmitCompleted}
                                        defaultScope={CommunityType.NATIONAL}
                                        tags={tags.value}
                                    />
                                    : <SocialLoginButtons />
                                }
                            </Modal>
                            <DebateList
                                debates={Array.isArray(debates.value) ? debates.value : []}
                                onCreateDebate={onCreateDebate}
                                communityName={nation.value?.name}
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
