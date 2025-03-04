import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { useLocation, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Breadcrumb, Tabs } from "~/components/ui";
import Modal from "~/components/Modal";
import FormPoll from "~/components/forms/FormPoll";
import DebateList from "~/components/list/DebateList";
import { PollList } from "~/components/list/PollList";
import { ProjectList } from "~/components/list/ProjectList";
import { IssueList } from "~/components/list/IssueList";
import FormProject from "~/components/forms/FormProject";
import FormIssue from "~/components/forms/FormIssue";
import { CommunityType } from "~/constants/communityType";
import { useGetRegions, useGetRegionalPolls, useGetTags, useGetRegionalDebates, useGetRegionalProjects, useGetRegionalIssues } from "~/shared/loaders";
import { useSession } from "~/routes/plugin@auth";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import FormDebate from "~/components/forms/FormDebate";
import { capitalizeFirst } from "~/utils/capitalizeFirst";
import { LuBarChart2, LuFlag, LuUsers, LuMessageSquare, LuBriefcase } from "@qwikest/icons/lucide";

export { useGetRegionalPolls, useGetRegionalDebates, useGetRegionalProjects, useGetRegionalIssues, useFormPollLoader, useFormDebateLoader, useFormIssueLoader, useGetRegions, useGetTags } from "~/shared/loaders";
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
    const currentPage = useSignal(1);
    const nav = useNavigate();
    // useGetRegions is used to populate the select options in the regional poll form
    const regions = useGetRegions();
    const tags = useGetTags();
    const polls = useGetRegionalPolls();
    const debates = useGetRegionalDebates();
    const projects = useGetRegionalProjects();
    const issues = useGetRegionalIssues();

    const defaultRegion = useComputed$(() => {
        const normalizedRegionName = regionName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        return regions.value.find((r: { name: string; }) => r.name === normalizedRegionName);
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

    // Count items of each type
    const pollsCount = polls.value?.total || 0;
    const debatesCount = Array.isArray(debates.value?.items) ? debates.value.items.length : 0;
    const projectsCount = projects.value?.total || 0;
    const issuesCount = issues.value?.total || 0;
    
    const regionDisplayName = capitalizeFirst(regionName.replace(/-/g, ' '));

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-auto p-4 bg-gray-50">
            <header class="mb-6">
                <div class="flex items-center gap-3">
                    <LuFlag class="w-10 h-10 text-blue-600" />
                    <h1 class="text-3xl font-bold">{regionDisplayName}</h1>
                </div>
                <p class="text-gray-600 mt-2">
                    {_`Welcome to the regional community where citizens connect, share ideas, and work together on local initiatives.`}
                </p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuFlag class="w-5 h-5 text-blue-600" />
                        {_`Information about ${regionDisplayName}`}
                    </h2>
                    <div class="space-y-4">
                        {defaultRegion.value && (
                            <>
                                <div class="flex items-start gap-3">
                                    <LuUsers class="w-5 h-5 text-gray-600 mt-1" />
                                    <div>
                                        <span class="font-medium">{_`Region`}:</span> {defaultRegion.value.name}
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <LuFlag class="w-5 h-5 text-gray-600 mt-1" />
                                    <div>
                                        <span class="font-medium">{_`Country`}:</span> {capitalizeFirst(nationName)}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuBarChart2 class="w-5 h-5 text-blue-600" />
                        {_`Platform Statistics`}
                    </h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-blue-600">{pollsCount}</div>
                            <div class="text-sm text-gray-600">{_`Polls`}</div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-green-600">{debatesCount}</div>
                            <div class="text-sm text-gray-600">{_`Debates`}</div>
                        </div>
                        <div class="bg-amber-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-amber-600">{issuesCount}</div>
                            <div class="text-sm text-gray-600">{_`Issues`}</div>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-purple-600">{projectsCount}</div>
                            <div class="text-sm text-gray-600">{_`Projects`}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuMessageSquare class="w-5 h-5 text-blue-600" />
                        {_`Featured Topics in ${regionDisplayName}`}
                    </h2>
                    <div class="space-y-4">
                        {Array.isArray(debates.value?.items) && debates.value.items.slice(0, 3).map((debate: any, index) => (
                            <div key={debate.id || index} class="border-b pb-3">
                                <h3 class="font-medium">{debate.title}</h3>
                                <p class="text-sm text-gray-600">
                                    {debate.description?.substring(0, 100)}...
                                </p>
                                <div class="flex gap-2 mt-2">
                                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {debate.views_count || 0} {_`views`}
                                    </span>
                                    <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        {debate.comments_count || 0} {_`comments`}
                                    </span>
                                </div>
                            </div>
                        ))}
                        
                        {(!debates.value?.items || debates.value.items.length === 0) && (
                            <div class="text-center py-6 text-gray-500">
                                {_`No featured debates yet. Be the first to create one!`}
                            </div>
                        )}
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuBriefcase class="w-5 h-5 text-blue-600" />
                        {_`Active Projects`}
                    </h2>
                    <div class="space-y-4">
                        {projects.value?.items?.slice(0, 3).map((project: any, index) => (
                            <div key={project.id || index} class="border-b pb-3">
                                <h3 class="font-medium">{project.title}</h3>
                                <div class="flex justify-between text-sm mt-1">
                                    <span>{_`Progress`}:</span>
                                    <span>{project.progress || 0}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                    <div class="bg-blue-600 h-2 rounded-full" style={`width: ${project.progress || 0}%`}></div>
                                </div>
                                <div class="text-xs text-gray-600 mt-2">{project.participants_count || 0} {_`participants`}</div>
                            </div>
                        ))}

                        {(!projects.value?.items || projects.value.items.length === 0) && (
                            <div class="text-center py-6 text-gray-500">
                                {_`No active projects yet. Start the first one!`}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuFlag class="w-5 h-5 text-blue-600" />
                        {_`Reported Issues`}
                    </h2>
                    <div class="space-y-3">
                        {issues.value?.items?.slice(0, 5).map((issue: any, index) => (
                            <div key={issue.id || index} class="flex items-center justify-between border-b pb-2">
                                <div>
                                    <h3 class="font-medium">{issue.title}</h3>
                                    <p class="text-xs text-gray-600">{issue.location || _`No specific location`}</p>
                                </div>
                                <span class={`text-xs px-2 py-1 rounded ${issue.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                                        issue.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                    }`}>
                                    {issue.status === 'OPEN' ? _`Open` :
                                        issue.status === 'IN_PROGRESS' ? _`In progress` :
                                            _`Resolved`}
                                </span>
                            </div>
                        ))}

                        {(!issues.value?.items || issues.value.items.length === 0) && (
                            <div class="text-center py-6 text-gray-500">
                                {_`No reported issues yet.`}
                            </div>
                        )}
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuBarChart2 class="w-5 h-5 text-blue-600" />
                        {_`Active Polls`}
                    </h2>
                    <div class="space-y-3">
                        {polls.value?.items?.slice(0, 5).map((poll: any, index) => (
                            <div key={poll.id || index} class="border-b pb-2">
                                <h3 class="font-medium">{poll.title}</h3>
                                <div class="flex justify-between items-center mt-1">
                                    <span class="text-xs text-gray-600">
                                        {poll.votes_count || 0} {_`votes`}
                                    </span>
                                    {poll.ends_at && (
                                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {_`Ends: `}{new Date(poll.ends_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {(!polls.value?.items || polls.value.items.length === 0) && (
                            <div class="text-center py-6 text-gray-500">
                                {_`No active polls currently.`}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const regionName = capitalizeFirst(params.region.replace(/-/g, ' '));
    return {
        title: `${regionName} - Community`,
        meta: [
            {
                name: "description",
                content: `Citizen participation platform for the ${regionName} community`,
            },
        ],
    };
};
