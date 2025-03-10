import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { LuBarChart2, LuFlag, LuUsers, LuMessageSquare, LuBriefcase, LuAlertTriangle } from "@qwikest/icons/lucide";
import { capitalizeFirst } from '~/utils/capitalizeFirst';
import { useSession } from "~/routes/plugin@auth";
import Modal from "~/components/Modal";
import FormPoll from "~/components/forms/FormPoll";
import FormDebate from "~/components/forms/FormDebate";
import FormProject from "~/components/forms/FormProject";
import FormIssue from "~/components/forms/FormIssue";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { CommunityType } from "~/constants/communityType";
import { _ } from "compiled-i18n";
import { useGetLocalityDebates, useGetLocalityPolls, useGetLocalityProjects, useGetLocalityIssues, useGetTags } from "~/shared/loaders";

export { useGetLocalityPolls, useGetLocalityDebates, useGetLocalityProjects, useGetLocalityIssues, useGetTags } from "~/shared/loaders";
export { useVotePoll, useReactPoll } from "~/shared/actions";
export { useFormPollAction, useFormDebateAction } from "~/shared/forms/actions";

export default component$(() => {
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const subregionName = location.params.subregion;
    const localityName = location.params.locality;
    
    const session = useSession();
    const showModalPoll = useSignal(false);
    const showModalDebate = useSignal(false);
    const showModalProject = useSignal(false);
    const showModalIssue = useSignal(false);
    
    const polls = useGetLocalityPolls();
    const debates = useGetLocalityDebates();
    const projects = useGetLocalityProjects();
    const issues = useGetLocalityIssues();
    const tags = useGetTags();

    const isAuthenticated = useComputed$(() => !!session.value?.user);
    
    const pollsCount = polls.value?.total || 0;
    const debatesCount = debates.value?.total || 0;
    const projectsCount = projects.value?.total || 0;
    const issuesCount = issues.value?.total || 0;

    const displayLocalityName = capitalizeFirst(localityName.replace(/-/g, ' '));
    const displayRegionName = capitalizeFirst(regionName.replace(/-/g, ' '));
    const displaySubregionName = capitalizeFirst(subregionName.replace(/-/g, ' '));
    
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
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-auto p-4 bg-gray-50 dark:bg-gray-800">
            <header class="mb-6">
                <div class="flex items-center gap-3">
                    <LuFlag class="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{displayLocalityName}</h1>
                </div>
                <p class="text-gray-600 dark:text-gray-300 mt-2">
                    {_`Welcome to the local community where citizens connect, share ideas, and work together on neighborhood initiatives.`}
                </p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuFlag class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Information about ${displayLocalityName}`}
                    </h2>
                    <div class="space-y-4">
                        <div class="flex items-start gap-3">
                            <LuUsers class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Locality`}:</span> {displayLocalityName}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuFlag class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Subregion`}:</span> {displaySubregionName}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuFlag class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Region`}:</span> {displayRegionName}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuFlag class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Country`}:</span> {capitalizeFirst(nationName)}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBarChart2 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Platform Statistics`}
                    </h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{pollsCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Polls`}</div>
                        </div>
                        <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-green-600 dark:text-green-400">{debatesCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Debates`}</div>
                        </div>
                        <div class="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">{issuesCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Issues`}</div>
                        </div>
                        <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{projectsCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Projects`}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700 col-span-1 lg:col-span-2">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuMessageSquare class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Featured Topics in ${displayLocalityName}`}
                    </h2>
                    <div class="space-y-4">
                        {Array.isArray(debates.value?.items) && debates.value.items.slice(0, 3).map((debate: any, index) => (
                            <div key={debate.id || index} class="border-b border-gray-200 dark:border-gray-700 pb-3">
                                <h3 class="font-medium text-gray-900 dark:text-white">{debate.title}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-300">
                                    {debate.description?.substring(0, 100)}...
                                </p>
                                <div class="flex gap-2 mt-2">
                                    <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">{debate.views_count || 0} {_`views`}</span>
                                    <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">{debate.comments_count || 0} {_`comments`}</span>
                                </div>
                            </div>
                        ))}

                        {(!debates.value?.items || debates.value.items.length === 0) && (
                            <div class="text-center py-6 text-gray-500 dark:text-gray-400">
                                {_`No active debates yet. Start a conversation!`}
                            </div>
                        )}
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBriefcase class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Active Projects`}
                    </h2>
                    <div class="space-y-4">
                        {projects.value?.items?.slice(0, 3).map((project: any, index) => (
                            <div key={project.id || index} class="border-b border-gray-200 dark:border-gray-700 pb-3">
                                <h3 class="font-medium text-gray-900 dark:text-white">{project.title}</h3>
                                <div class="flex justify-between text-sm mt-1 text-gray-700 dark:text-gray-300">
                                    <span>{_`Progress`}:</span>
                                    <span>{project.progress || 0}%</span>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                    <div class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style={`width: ${project.progress || 0}%`}></div>
                                </div>
                                <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">{project.participants_count || 0} {_`participants`}</div>
                            </div>
                        ))}

                        {(!projects.value?.items || projects.value.items.length === 0) && (
                            <div class="text-center py-6 text-gray-500 dark:text-gray-400">
                                {_`No active projects yet. Start the first one!`}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuAlertTriangle class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Reported Issues`}
                    </h2>
                    <div class="space-y-3">
                        {issues.value?.items?.slice(0, 5).map((issue: any, index) => (
                            <div key={issue.id || index} class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                                <div>
                                    <h3 class="font-medium text-gray-900 dark:text-white">{issue.title}</h3>
                                    <p class="text-xs text-gray-600 dark:text-gray-400">{issue.location || _`No specific location`}</p>
                                </div>
                                <span class={`text-xs px-2 py-1 rounded ${issue.status === 'OPEN' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' :
                                        issue.status === 'IN_PROGRESS' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200' :
                                            'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                    }`}>
                                    {issue.status === 'OPEN' ? _`Open` :
                                        issue.status === 'IN_PROGRESS' ? _`In progress` :
                                            _`Resolved`}
                                </span>
                            </div>
                        ))}

                        {(!issues.value?.items || issues.value.items.length === 0) && (
                            <div class="text-center py-6 text-gray-500 dark:text-gray-400">
                                {_`No reported issues yet.`}
                            </div>
                        )}
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBarChart2 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Active Polls`}
                    </h2>
                    <div class="space-y-3">
                        {polls.value?.items?.slice(0, 5).map((poll: any, index) => (
                            <div key={poll.id || index} class="border-b border-gray-200 dark:border-gray-700 pb-2">
                                <h3 class="font-medium text-gray-900 dark:text-white">{poll.title}</h3>
                                <div class="flex justify-between items-center mt-1">
                                    <span class="text-xs text-gray-600 dark:text-gray-300">
                                        {poll.votes_count || 0} {_`votes`}
                                    </span>
                                    {poll.ends_at && (
                                        <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                            {_`Ends: `}{new Date(poll.ends_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {(!polls.value?.items || polls.value.items.length === 0) && (
                            <div class="text-center py-6 text-gray-500 dark:text-gray-400">
                                {_`No active polls currently.`}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Modales para creación de contenido */}
            <Modal title={_`Create Poll`} show={showModalPoll}>
                {session.value?.user ? (
                    <FormPoll 
                        onSubmitCompleted={onSubmitCompleted} 
                        defaultScope={CommunityType.LOCALITY}
                    />
                ) : (
                    <SocialLoginButtons />
                )}
            </Modal>
            
            <Modal title={_`Create Debate`} show={showModalDebate}>
                {session.value?.user ? (
                    <FormDebate 
                        onSubmitCompleted={onSubmitCompleted} 
                        defaultScope={CommunityType.LOCALITY}
                        tags={tags.value}
                    />
                ) : (
                    <SocialLoginButtons />
                )}
            </Modal>
            
            <Modal title={_`Create Project`} show={showModalProject}>
                {session.value?.user ? (
                    <FormProject 
                        onSubmitCompleted={onSubmitCompleted} 
                        defaultScope={CommunityType.LOCALITY}
                    />
                ) : (
                    <SocialLoginButtons />
                )}
            </Modal>
            
            <Modal title={_`Report Issue`} show={showModalIssue}>
                {session.value?.user ? (
                    <FormIssue 
                        onSubmitCompleted={onSubmitCompleted} 
                        defaultScope={CommunityType.LOCALITY}
                    />
                ) : (
                    <SocialLoginButtons />
                )}
            </Modal>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const localityName = capitalizeFirst(params.locality.replace(/-/g, ' '));
    return {
        title: _`${localityName} - Community`,
        meta: [
            {
                name: "description",
                content: _`Citizen participation platform for the ${localityName} community`,
            },
        ],
    };
};
