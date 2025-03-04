import { $, component$, useComputed$, useSignal, type QRL } from "@builder.io/qwik"
import { _ } from "compiled-i18n"
import { Button } from "~/components/ui"
import {
    LuPlus,
    LuSearch,
    LuClock,
    LuUsers,
    LuTarget,
    LuCheckCircle,
    LuXCircle,
    LuCalendar,
} from "@qwikest/icons/lucide"
import Modal from "~/components/Modal"
import SocialLoginButtons from "~/components/SocialLoginButtons"
import type { ProjectRead, ProjectStatus } from "~/shared/types"
import { useNavigate } from "@builder.io/qwik-city"
import { Pagination } from "@qwik-ui/headless"
import EmptyProjects from "~/components/empty-states/EmptyProjects"
import { Image } from "@unpic/qwik"

export interface ProjectListProps {
    onCreateProject: QRL<() => void>
    projects: {
        items: ProjectRead[]
        total: number
        page: number
        size: number
        pages: number
    }
    communityName?: string
    onPageChange$: QRL<(page: number) => void>
    isAuthenticated?: boolean
}

export default component$<ProjectListProps>(
    ({ projects, onCreateProject, communityName, onPageChange$, isAuthenticated = true }) => {
        const searchTerm = useSignal("")
        const showLoginModal = useSignal(false)
        const statusFilter = useSignal<ProjectStatus | "ALL">("ALL")
        const nav = useNavigate()

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

        const getStatusBadgeClass = (status: ProjectStatus) => {
            switch (status) {
                case "DRAFT":
                    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                case "OPEN":
                    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                case "IN_PROGRESS":
                    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                case "COMPLETED":
                    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                case "CANCELLED":
                    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                default:
                    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }
        }

        const getStatusIcon = (status: ProjectStatus) => {
            switch (status) {
                case "DRAFT":
                    return <LuClock class="w-4 h-4" />
                case "OPEN":
                    return <LuUsers class="w-4 h-4" />
                case "IN_PROGRESS":
                    return <LuTarget class="w-4 h-4" />
                case "COMPLETED":
                    return <LuCheckCircle class="w-4 h-4" />
                case "CANCELLED":
                    return <LuXCircle class="w-4 h-4" />
                default:
                    return <LuClock class="w-4 h-4" />
            }
        }

        const formatDate = (dateString: string) => {
            const date = new Date(dateString)
            return new Intl.DateTimeFormat("default", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }).format(date)
        }

        const calculateProgress = (current: number, goal: number | null | undefined) => {
            if (!goal) return 0
            const progress = (current / goal) * 100
            return Math.min(progress, 100)
        }

        const onShowLoginModal = $(() => {
            showLoginModal.value = true
        })

        const navigateToProject = $((slug: string) => {
            nav(`/projects/${slug}`)
        })

        // Reusable search and filter component
        const SearchAndFilterBar = (
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                {/* Search bar */}
                <div class="relative flex-1 sm:max-w-xs w-full">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <LuSearch class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                        type="search"
                        class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-600 dark:focus:border-cyan-600"
                        placeholder={_`Search projects...`}
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
                            aria-label="Clear search"
                        >
                            <span class="text-xl">&times;</span>
                        </button>
                    )}
                </div>

                {/* Status filter dropdown */}
                <div class="relative w-full sm:w-auto">
                    <select
                        class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-600 dark:focus:border-cyan-600"
                        value={statusFilter.value}
                        onChange$={(e) => {
                            statusFilter.value = (e.target as HTMLSelectElement).value as ProjectStatus | "ALL"
                        }}
                    >
                        <option value="ALL">{_`All Statuses`}</option>
                        <option value="DRAFT">{_`Draft`}</option>
                        <option value="OPEN">{_`Open`}</option>
                        <option value="IN_PROGRESS">{_`In Progress`}</option>
                        <option value="COMPLETED">{_`Completed`}</option>
                        <option value="CANCELLED">{_`Cancelled`}</option>
                    </select>
                </div>

                {/* Create project button */}
                <Button
                    class="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 shadow-sm w-full sm:w-auto"
                    onClick$={onCreateProject}
                >
                    <LuPlus class="w-4 h-4 mr-1" />
                    {_`Create Project`}
                </Button>
            </div>
        )

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
                                    ? _`No projects match your search "${searchTerm.value}". Try different keywords or clear the filters.`
                                    : _`No projects match the selected filters. Try changing your filter criteria.`}
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
                {/* Login modal */}
                <Modal title={_`Sign in to participate`} show={showLoginModal}>
                    <div class="p-4 text-center">
                        <p class="mb-6 text-gray-600 dark:text-gray-300">{_`You need to sign in to contribute to projects and participate in the community.`}</p>
                        <SocialLoginButtons />
                    </div>
                </Modal>

                {/* Header with actions */}
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2">
                    <div class="flex-1">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <span>{_`Projects`}</span>
                            <span class="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm px-2.5 py-0.5 rounded-full">
                                {filteredProjects.value.length}
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
                            <div
                                class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden cursor-pointer"
                                onClick$={() => navigateToProject(project.slug)}
                            >
                                <div class="p-4">
                                    <div class="flex items-start justify-between mb-2">
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                                        <span
                                            class={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}
                                        >
                                            {getStatusIcon(project.status)}
                                            {project.status === "IN_PROGRESS" ? _`In Progress` : _(project.status)}
                                        </span>
                                    </div>

                                    {project.description && (
                                        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                                    )}

                                    <div class="flex flex-wrap gap-4 mb-4">
                                        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <LuCalendar class="w-4 h-4 mr-1" />
                                            {_`Created: ${formatDate(project.created_at)}`}
                                        </div>

                                        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <LuUsers class="w-4 h-4 mr-1" />
                                            {_`Commitments: ${project.commitments.length}`}
                                        </div>
                                    </div>

                                    {project.goal_amount && (
                                        <div class="mb-2">
                                            <div class="flex justify-between text-sm mb-1">
                                                <span class="text-gray-700 dark:text-gray-300">{_`Progress`}</span>
                                                <span class="text-gray-700 dark:text-gray-300">
                                                    {project.current_amount} / {project.goal_amount}
                                                    {project.goal_amount > 0 &&
                                                        ` (${Math.round((project.current_amount / project.goal_amount) * 100)}%)`}
                                                </span>
                                            </div>
                                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                                <div
                                                    class="bg-cyan-600 h-2.5 rounded-full"
                                                    style={`width: ${calculateProgress(project.current_amount, project.goal_amount)}%`}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {project.steps.length > 0 && (
                                        <div class="mt-4">
                                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{_`Project Steps`}</h4>
                                            <div class="space-y-2">
                                                {project.steps.slice(0, 3).map((step) => (
                                                    <div key={step.id} class="flex items-center">
                                                        <div
                                                            class={`w-2 h-2 rounded-full mr-2 ${step.status === "COMPLETED"
                                                                    ? "bg-green-500"
                                                                    : step.status === "IN_PROGRESS"
                                                                        ? "bg-yellow-500"
                                                                        : "bg-gray-400"
                                                                }`}
                                                        ></div>
                                                        <span class="text-sm text-gray-600 dark:text-gray-300 truncate">{step.title}</span>
                                                    </div>
                                                ))}
                                                {project.steps.length > 3 && (
                                                    <div class="text-xs text-cyan-600 dark:text-cyan-400">
                                                        {_`+ ${project.steps.length - 3} more steps`}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {project.communities.length > 0 && (
                                        <div class="mt-4 flex flex-wrap gap-2">
                                            {project.communities.map((community) => (
                                                <span
                                                    key={community.id}
                                                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                >
                                                    {community.cca2 && `${community.cca2} `}
                                                    {community.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div class="bg-gray-50 dark:bg-gray-900/30 px-4 py-3 flex items-center justify-between">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0">
                                            <Image
                                                class="h-8 w-8 rounded-full"
                                                src={project.creator.image || "/placeholder-user.svg"}
                                                alt={project.creator.username}
                                            />
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm font-medium text-gray-900 dark:text-white">{project.creator.username}</p>
                                        </div>
                                    </div>

                                    <Button
                                        class="bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
                                        onClick$={(e) => {
                                            e.stopPropagation()
                                            if (!isAuthenticated) {
                                                onShowLoginModal()
                                                return
                                            }
                                            navigateToProject(project.slug)
                                        }}
                                    >
                                        {_`View Details`}
                                    </Button>
                                </div>
                            </div>
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

