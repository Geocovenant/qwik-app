import { component$, useComputed$ } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { LuBarChart2, LuFlag, LuUsers, LuMessageSquare, LuBriefcase, LuAlertTriangle } from "@qwikest/icons/lucide";
import { dataArray as countries, getFlagByCca2 } from "~/data/countries";
import { capitalizeFirst } from '~/utils/capitalizeFirst';
import { useGetNationalDebates, useGetNationalPolls, useGetNationalProjects, useGetNationalIssues } from "~/shared/loaders";

export { useGetNationalPolls, useGetNationalDebates, useGetNationalProjects, useGetNationalIssues } from "~/shared/loaders";

// Definiendo tipos para evitar errores TypeScript
interface NationData {
    name: string;
    flag: string;
    continent: string;
    cca2: string;
    adminDivisionName?: string;
    path: string;
    capital?: string[];
    region?: string;
    subregion?: string;
}

interface ProjectItem {
    id?: string;
    title: string;
    progress?: number;
    participants_count?: number;
}

interface PollItem {
    id?: string;
    title: string;
    votes_count?: number;
    ends_at?: string;
}

interface IssueItem {
    id?: string;
    title: string;
    location?: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}

interface DebateItem {
    id?: string;
    title: string;
    description?: string;
    views_count?: number;
    comments_count?: number;
}

export default component$(() => {
    const location = useLocation();
    const nationName = location.params.nation;
    const nation = useComputed$<NationData | undefined>(() => {
        return countries.find(country => country.name.toLowerCase() === nationName.toLowerCase()) as NationData | undefined;
    });

    const polls = useGetNationalPolls();
    const debates = useGetNationalDebates();
    const projects = useGetNationalProjects();
    const issues = useGetNationalIssues();

    const pollsCount = polls.value.total || 0;
    const debatesCount = debates.value.total || 0;
    const projectsCount = projects.value.total || 0;
    const issuesCount = issues.value.total || 0;

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-auto p-4 bg-gray-50 dark:bg-gray-800">
            <header class="mb-6">
                <div class="flex items-center gap-3">
                    
                    {nation.value?.cca2
                        ? <span class="text-2xl">{getFlagByCca2(nation.value?.cca2)}</span>
                        : <LuFlag class="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    }
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{nation.value?.name || capitalizeFirst(nationName)}</h1>
                </div>
                <p class="text-gray-600 dark:text-gray-300 mt-2">
                    {_`Bienvenido a la comunidad nacional donde los ciudadanos conectan, comparten ideas y trabajan juntos.`}
                </p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuFlag class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Información de ${nation.value?.name || capitalizeFirst(nationName)}`}
                    </h2>
                    <div class="space-y-4">
                        {nation.value && (
                            <>
                                <div class="flex items-start gap-3">
                                    <LuUsers class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                                    <div class="dark:text-gray-300">
                                        <span class="font-medium">{_`Capital`}:</span> {nation.value.capital?.[0] || _`No disponible`}
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <LuFlag class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                                    <div class="dark:text-gray-300">
                                        <span class="font-medium">{_`Código ISO`}:</span> {nation.value.cca2}
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <LuBarChart2 class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                                    <div class="dark:text-gray-300">
                                        <span class="font-medium">{_`Región`}:</span> {nation.value.region || _`No disponible`}
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <LuBarChart2 class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                                    <div class="dark:text-gray-300">
                                        <span class="font-medium">{_`Subregión`}:</span> {nation.value.subregion || _`No disponible`}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBarChart2 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Estadísticas de la Plataforma`}
                    </h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{pollsCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Encuestas`}</div>
                        </div>
                        <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-green-600 dark:text-green-400">{debatesCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Debates`}</div>
                        </div>
                        <div class="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">{issuesCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Problemas`}</div>
                        </div>
                        <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{projectsCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Proyectos`}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700 col-span-1 lg:col-span-2">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuMessageSquare class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Temas Destacados en ${nation.value?.name || capitalizeFirst(nationName)}`}
                    </h2>
                    <div class="space-y-4">
                        {Array.isArray(debates.value) && debates.value.slice(0, 3).map((debate: DebateItem, index: number) => (
                            <div key={debate.id || index} class="border-b border-gray-200 dark:border-gray-700 pb-3">
                                <h3 class="font-medium text-gray-900 dark:text-white">{debate.title}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-300">
                                    {debate.description?.substring(0, 100)}...
                                </p>
                                <div class="flex gap-2 mt-2">
                                    <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                        {debate.views_count || 0} {_`vistas`}
                                    </span>
                                    <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                        {debate.comments_count || 0} {_`comentarios`}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {(!Array.isArray(debates.value) || debates.value.length === 0) && (
                            <div class="text-center py-6 text-gray-500 dark:text-gray-400">
                                {_`No hay debates destacados aún. ¡Sé el primero en crear uno!`}
                            </div>
                        )}
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBriefcase class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Proyectos Activos`}
                    </h2>
                    <div class="space-y-4">
                        {projects.value?.items?.slice(0, 3).map((project: ProjectItem, index: number) => (
                            <div key={project.id || index} class="border-b border-gray-200 dark:border-gray-700 pb-3">
                                <h3 class="font-medium text-gray-900 dark:text-white">{project.title}</h3>
                                <div class="flex justify-between text-sm mt-1 text-gray-700 dark:text-gray-300">
                                    <span>{_`Progreso`}:</span>
                                    <span>{project.progress || 0}%</span>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                    <div class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style={`width: ${project.progress || 0}%`}></div>
                                </div>
                                <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">{project.participants_count || 0} {_`participantes`}</div>
                            </div>
                        ))}

                        {(!projects.value?.items || projects.value.items.length === 0) && (
                            <div class="text-center py-6 text-gray-500 dark:text-gray-400">
                                {_`No hay proyectos activos aún. ¡Inicia el primero!`}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuAlertTriangle class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Problemas Reportados`}
                    </h2>
                    <div class="space-y-3">
                        {issues.value?.items?.slice(0, 5).map((issue: IssueItem, index: number) => (
                            <div key={issue.id || index} class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                                <div>
                                    <h3 class="font-medium text-gray-900 dark:text-white">{issue.title}</h3>
                                    <p class="text-xs text-gray-600 dark:text-gray-400">{issue.location || _`Sin ubicación específica`}</p>
                                </div>
                                <span class={`text-xs px-2 py-1 rounded ${issue.status === 'OPEN' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' :
                                        issue.status === 'IN_PROGRESS' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200' :
                                            'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                    }`}>
                                    {issue.status === 'OPEN' ? _`Abierto` :
                                        issue.status === 'IN_PROGRESS' ? _`En progreso` :
                                            _`Resuelto`}
                                </span>
                            </div>
                        ))}

                        {(!issues.value?.items || issues.value.items.length === 0) && (
                            <div class="text-center py-6 text-gray-500 dark:text-gray-400">
                                {_`No hay problemas reportados aún.`}
                            </div>
                        )}
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBarChart2 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Encuestas Activas`}
                    </h2>
                    <div class="space-y-3">
                        {polls.value?.items?.slice(0, 5).map((poll: PollItem, index: number) => (
                            <div key={poll.id || index} class="border-b border-gray-200 dark:border-gray-700 pb-2">
                                <h3 class="font-medium text-gray-900 dark:text-white">{poll.title}</h3>
                                <div class="flex justify-between items-center mt-1">
                                    <span class="text-xs text-gray-600 dark:text-gray-400">
                                        {poll.votes_count || 0} {_`votos`}
                                    </span>
                                    {poll.ends_at && (
                                        <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                            {_`Finaliza: `}{new Date(poll.ends_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {(!polls.value?.items || polls.value.items.length === 0) && (
                            <div class="text-center py-6 text-gray-500 dark:text-gray-400">
                                {_`No hay encuestas activas actualmente.`}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const nationName = capitalizeFirst(params.nation || "");
    return {
        title: _`${nationName} - Comunidad`,
        meta: [
            {
                name: "description",
                content: _`Plataforma de participación ciudadana para la comunidad de ${nationName}`,
            },
        ],
    };
};
