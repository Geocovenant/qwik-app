import { component$, useComputed$, useSignal, type QRL } from "@builder.io/qwik"
import { _ } from "compiled-i18n"
import { Button } from "~/components/ui"
import {
    LuPlus,
    LuSearch,
    LuFilter,
} from "@qwikest/icons/lucide"
import { Pagination } from "@qwik-ui/headless"
import EmptyProjects from "~/components/empty-states/EmptyProjects"
import ProjectCard from "~/components/cards/ProjectCard"
import type { Project } from "~/types/project"

export interface ProjectListProps {
    communityName?: string
    currentUsername?: string
    isAuthenticated?: boolean
    onCreateProject: QRL<() => void>
    onPageChange$: QRL<(page: number) => void>
    onShowLoginModal$?: QRL<() => void>
    projects: {
        items: Project[]
        total: number
        page: number
        size: number
        pages: number
    }
}

export default component$<ProjectListProps>(
    ({ projects, onCreateProject, communityName, onPageChange$, isAuthenticated = true, currentUsername = "", onShowLoginModal$ }) => {
        const searchTerm = useSignal("")
        const statusFilter = useSignal<"ALL" | "DRAFT" | "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED">("ALL")

        // Filter projects by search term and status
        const filteredProjects = useComputed$(() => {
            let filtered = projects.items

            // Apply search filter if there's a search term
            if (searchTerm.value.trim()) {
                const term = searchTerm.value.toLowerCase()
                filtered = filtered.filter(
                    (project) =>
                        project.title.toLowerCase().includes(term) ||
                        (project.description && project.description.toLowerCase().includes(term)),
                )
            }

            // Apply status filter if not set to ALL
            if (statusFilter.value !== "ALL") {
                filtered = filtered.filter((project) => project.status === statusFilter.value)
            }

            return filtered
        })

        // Actualizado SearchAndFilterBar para ser consistente con los demás componentes
        const SearchAndFilterBar = (
            <div class="flex items-center gap-3 w-full sm:w-auto">
                {/* Search bar */}
                <div class="relative flex-1 sm:max-w-xs">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <LuSearch class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                        type="search"
                        class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-600 dark:focus:border-cyan-600"
                        placeholder={_`Buscar proyectos...`}
                        value={searchTerm.value}
                        onInput$={(e) => {
                            searchTerm.value = (e.target as HTMLInputElement).value
                        }}
                    />
                    {searchTerm.value && (
                        <button
                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick$={() => {
                                searchTerm.value = ""
                            }}
                            aria-label="Limpiar búsqueda"
                        >
                            <span class="text-xl">&times;</span>
                        </button>
                    )}
                </div>

                {/* Filter button with dropdown */}
                <div class="relative inline-block">
                    <Button 
                        class="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick$={() => {
                            // Aquí podrías mostrar un dropdown de filtros en una implementación más avanzada
                            // Por ahora simplemente mostramos/ocultamos la lista de estados
                            const dropdown = document.getElementById('status-dropdown');
                            if (dropdown) {
                                dropdown.classList.toggle('hidden');
                            }
                        }}
                    >
                        <LuFilter class="w-4 h-4 mr-1" />
                        {_`Filtrar`}
                    </Button>
                    
                    {/* Status dropdown */}
                    <div 
                        id="status-dropdown" 
                        class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
                    >
                        <div class="p-2">
                            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 px-3 py-1">
                                {_`Estado del proyecto`}
                            </div>
                            <div class="space-y-1">
                                <button 
                                    class={`w-full text-left px-3 py-1 text-sm rounded ${statusFilter.value === "ALL" 
                                        ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300" 
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                                    onClick$={() => {
                                        statusFilter.value = "ALL";
                                        document.getElementById('status-dropdown')?.classList.add('hidden');
                                    }}
                                >
                                    {_`Todos los estados`}
                                </button>
                                <button 
                                    class={`w-full text-left px-3 py-1 text-sm rounded ${statusFilter.value === "DRAFT" 
                                        ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300" 
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                                    onClick$={() => {
                                        statusFilter.value = "DRAFT";
                                        document.getElementById('status-dropdown')?.classList.add('hidden');
                                    }}
                                >
                                    {_`Borrador`}
                                </button>
                                <button 
                                    class={`w-full text-left px-3 py-1 text-sm rounded ${statusFilter.value === "OPEN" 
                                        ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300" 
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                                    onClick$={() => {
                                        statusFilter.value = "OPEN";
                                        document.getElementById('status-dropdown')?.classList.add('hidden');
                                    }}
                                >
                                    {_`Abierto`}
                                </button>
                                <button 
                                    class={`w-full text-left px-3 py-1 text-sm rounded ${statusFilter.value === "IN_PROGRESS" 
                                        ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300" 
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                                    onClick$={() => {
                                        statusFilter.value = "IN_PROGRESS";
                                        document.getElementById('status-dropdown')?.classList.add('hidden');
                                    }}
                                >
                                    {_`En Progreso`}
                                </button>
                                <button 
                                    class={`w-full text-left px-3 py-1 text-sm rounded ${statusFilter.value === "COMPLETED" 
                                        ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300" 
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                                    onClick$={() => {
                                        statusFilter.value = "COMPLETED";
                                        document.getElementById('status-dropdown')?.classList.add('hidden');
                                    }}
                                >
                                    {_`Completado`}
                                </button>
                                <button 
                                    class={`w-full text-left px-3 py-1 text-sm rounded ${statusFilter.value === "CANCELLED" 
                                        ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300" 
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                                    onClick$={() => {
                                        statusFilter.value = "CANCELLED";
                                        document.getElementById('status-dropdown')?.classList.add('hidden');
                                    }}
                                >
                                    {_`Cancelado`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create project button */}
                <Button
                    class="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 shadow-sm"
                    onClick$={onCreateProject}
                >
                    <LuPlus class="w-4 h-4 mr-1" />
                    {_`Crear`}
                </Button>
            </div>
        );

        // Show empty state if no projects match the filters
        if (!filteredProjects.value?.length) {
            if (searchTerm.value.trim() || statusFilter.value !== "ALL") {
                return (
                    <div class="space-y-6 overflow-y-auto">
                        {/* Header with actions */}
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2">
                            <div class="flex-1">
                                <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <span>{_`Projects`}</span>
                                    <span class="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm px-2.5 py-0.5 rounded-full">
                                        0
                                    </span>
                                </h2>
                                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {communityName || _`Explore and contribute to community projects`}
                                </p>
                            </div>

                            {SearchAndFilterBar}
                        </div>

                        {/* Empty search results */}
                        <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                                <LuSearch class="w-8 h-8 text-gray-500 dark:text-gray-400" />
                            </div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{_`No projects found`}</h3>
                            <p class="text-gray-500 dark:text-gray-400 mb-6">
                                {searchTerm.value
                                    ? _`No project matches your search "${searchTerm.value}". Try different keywords or clear the filters.`
                                    : _`No project matches the selected filters. Try changing the filtering criteria.`}
                            </p>
                            <Button
                                class="bg-cyan-600 hover:bg-cyan-700 text-white"
                                onClick$={() => {
                                    searchTerm.value = ""
                                    statusFilter.value = "ALL"
                                }}
                            >
                                {_`Clear filters`}
                            </Button>
                        </div>
                    </div>
                )
            }

            // Empty state when no projects exist
            return (
                <EmptyProjects 
                    onCreateProject={onCreateProject} 
                    communityName={communityName}
                />
            )
        }

        return (
            <div class="space-y-6 overflow-y-auto">
                {/* Header with actions */}
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2">
                    <div class="flex-1">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <span>{_`Projects`}</span>
                            <span class="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm px-2.5 py-0.5 rounded-full">
                                {searchTerm.value.trim() ? filteredProjects.value.length : projects.total }
                            </span>
                        </h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {communityName || _`Explore and contribute to community projects`}
                        </p>
                    </div>

                    {SearchAndFilterBar}
                </div>

                {/* Project list */}
                <ul class="space-y-4 px-2">
                    {filteredProjects.value.map((project) => (
                        <li key={`project-${project.id}`} class="transform transition-transform hover:-translate-y-1 duration-300">
                            <ProjectCard
                                id={project.id}
                                title={project.title}
                                description={project.description}
                                slug={project.slug}
                                status={project.status}
                                createdAt={project.created_at}
                                creatorUsername={project.creator?.username || ""}
                                creatorAvatar={project.creator?.image || ""}
                                currentAmount={project.current_amount}
                                goalAmount={project.goal_amount}
                                steps={project.steps}
                                communities={project.communities}
                                commitments={project.commitments}
                                isAuthenticated={isAuthenticated}
                                currentUsername={currentUsername}
                                onShowLoginModal$={onShowLoginModal$}
                            />
                        </li>
                    ))}
                </ul>

                {/* Pagination - only show if there are results and more than one page */}
                {projects.pages > 1 && !searchTerm.value.trim() && statusFilter.value === "ALL" && (
                    <div class="mt-4 flex justify-center">
                        <Pagination
                            selectedPage={projects.page}
                            totalPages={projects.pages}
                            onPageChange$={onPageChange$}
                            class="pagination-wrapper"
                            selectedClass="pagination-selected-btn"
                            defaultClass="pagination-btn"
                            dividerClass="pagination-divider"
                            prevButtonClass="prevNextButtons"
                            nextButtonClass="prevNextButtons"
                        />
                    </div>
                )}
            </div>
        )
    },
)
