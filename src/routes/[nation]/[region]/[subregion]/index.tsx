import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import { useLocation, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Breadcrumb, Tabs } from "~/components/ui";
import Modal from "~/components/Modal";
import FormPoll from "~/components/forms/FormPoll";
import DebateList from "~/components/list/DebateList";
import PollList from "~/components/list/PollList";
import ProjectList from "~/components/list/ProjectList";
import { IssueList } from "~/components/list/IssueList";
import FormProject from "~/components/forms/FormProject";
import FormIssue from "~/components/forms/FormIssue";
import { CommunityType } from "~/constants/communityType";
import { useSession } from "~/routes/plugin@auth";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import FormDebate from "~/components/forms/FormDebate";
import { capitalizeFirst } from "~/utils/capitalizeFirst";
import {
    useGetSubregionalPolls, useGetSubregionalDebates, useGetSubregionalProjects,
    useGetSubregionalIssues, useGetSubregions, useGetTags
} from "~/shared/loaders";

export {
    useGetSubregionalPolls, useGetSubregionalDebates, useGetSubregionalProjects, useGetSubregionalIssues, useFormPollLoader,
    useFormDebateLoader, useFormIssueLoader, useGetSubregions, useGetTags, useGetRegions
} from "~/shared/loaders";
export { useFormPollAction, useFormDebateAction, useVotePoll, useReactPoll } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const location = useLocation();
    const showModalPoll = useSignal(false);
    const showModalDebate = useSignal(false);
    const showModalProject = useSignal(false);
    const showModalIssue = useSignal(false);
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const subregionName = location.params.subregion;
    const currentPage = useSignal(1);
    const nav = useNavigate();
    
    const subregions = useGetSubregions();
    const tags = useGetTags();
    const polls = useGetSubregionalPolls();
    const debates = useGetSubregionalDebates();
    const projects = useGetSubregionalProjects();
    const issues = useGetSubregionalIssues();

    const defaultSubregion = useComputed$(() => {
        const normalizedSubregionName = subregionName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        return subregions.value.find((r: { name: string; }) => r.name === normalizedSubregionName);
    });
    
    const isAuthenticated = useComputed$(() => !!session.value?.user);

    const onSubmitCompleted = $(() => {
        showModalPoll.value = false;
        showModalDebate.value = false;
        showModalProject.value = false;
        showModalIssue.value = false;
    });

    const onCreatePoll = $(() => {
        showModalPoll.value = true;
    });

    const onCreateDebate = $(() => {
        showModalDebate.value = true;
    });

    const onCreateProject = $(() => {
        showModalProject.value = true;
    });

    const onCreateIssue = $(() => {
        showModalIssue.value = true;
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="bg-gray-50 border-b py-1 px-2">
                <Breadcrumb.Root>
                    <Breadcrumb.List class="text-lg">
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="/global">{_`Global`}</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href={`/${nationName}`}>{capitalizeFirst(nationName)}</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href={`/${nationName}/${regionName}`}>{capitalizeFirst(regionName)}</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href={`/${nationName}/${regionName}/${subregionName}`}>{capitalizeFirst(subregionName)}</Breadcrumb.Link>
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
                                title={_`Create poll for "${defaultSubregion.value?.name}"`}
                                description={_`Create a poll for your community`}
                                show={showModalPoll}
                            >
                                {session.value?.user
                                    ? <FormPoll
                                        onSubmitCompleted={onSubmitCompleted}
                                        defaultScope={CommunityType.SUBREGIONAL}
                                        defaultSubregionId={defaultSubregion.value?.id}
                                        subregions={Array.isArray(subregions.value) ? subregions.value : []}
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
                                communityName={defaultSubregion.value?.name}
                                onPageChange$={async (page: number) => {
                                    currentPage.value = page;
                                    await nav(`/${nationName}/${regionName}/${subregionName}?page=${page}`);
                                }}
                                isAuthenticated={isAuthenticated.value}
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="debates" class="p-4">
                            <Modal
                                title={_`Crear debate para "${defaultSubregion.value?.name}"`}
                                show={showModalDebate}
                            >
                                {session.value?.user
                                    ? <FormDebate
                                        onSubmitCompleted={onSubmitCompleted}
                                        defaultScope={CommunityType.SUBREGIONAL}
                                        defaultSubregionId={defaultSubregion.value?.id}
                                        subregions={Array.isArray(subregions.value) ? subregions.value : []}
                                        tags={tags.value}
                                    />
                                    : <SocialLoginButtons />
                                }
                            </Modal>
                            <DebateList
                                debates={Array.isArray(debates.value) ? debates.value : []}
                                onCreateDebate={onCreateDebate}
                                communityName={nationName}
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="projects" class="p-4">
                            <Modal title={_`Create project for ${defaultSubregion.value?.name}`} show={showModalProject}>
                                {session.value?.user ? (
                                    <FormProject 
                                        onSubmitCompleted={onSubmitCompleted} 
                                        defaultScope={CommunityType.SUBREGIONAL}
                                        defaultSubregionId={defaultSubregion.value?.id}
                                        subregions={Array.isArray(subregions.value) ? subregions.value : []}
                                    />
                                ) : (
                                    <SocialLoginButtons />
                                )}
                            </Modal>

                            <ProjectList
                                onCreateProject={onCreateProject}
                                projects={{
                                    items: Array.isArray(projects.value?.items) ? projects.value.items : [],
                                    total: projects.value?.total || 0,
                                    page: projects.value?.page || 1,
                                    size: projects.value?.size || 10,
                                    pages: projects.value?.pages || 1,
                                }}
                                communityName={defaultSubregion.value?.name}
                                onPageChange$={async (page: number) => {
                                    currentPage.value = page
                                    await nav(`/${nationName}/${regionName}/${subregionName}?page=${page}`)
                                }}
                                isAuthenticated={isAuthenticated.value}
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="issues" class="p-4">
                            <Modal title={_`Report an Issue`} show={showModalIssue}>
                                {session.value?.user ? (
                                    <FormIssue 
                                        onSubmitCompleted={onSubmitCompleted} 
                                        defaultScope={CommunityType.SUBREGIONAL}
                                        defaultSubregionId={defaultSubregion.value?.id}
                                        subregions={Array.isArray(subregions.value) ? subregions.value : []}
                                        tags={tags.value} 
                                    />
                                ) : (
                                    <SocialLoginButtons />
                                )}
                            </Modal>

                            <IssueList
                                onCreateIssue={onCreateIssue}
                                issues={{
                                    items: Array.isArray(issues.value?.items) ? issues.value.items : [],
                                    total: issues.value?.total || 0,
                                    page: issues.value?.page || 1,
                                    size: issues.value?.size || 10,
                                    pages: issues.value?.pages || 1,
                                }}
                                communityName={defaultSubregion.value?.name}
                                onPageChange$={async (page: number) => {
                                    currentPage.value = page
                                    await nav(`/${nationName}/${regionName}/${subregionName}?page=${page}`)
                                }}
                                isAuthenticated={isAuthenticated.value}
                            />
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
    title: "Geounity Subregional",
    meta: [
        {
            name: "description",
            content: "Geounity Subregional Community",
        },
    ],
};
