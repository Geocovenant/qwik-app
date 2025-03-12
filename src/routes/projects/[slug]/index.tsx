import { $, component$, useSignal } from "@builder.io/qwik"
import { type DocumentHead } from "@builder.io/qwik-city"
import { 
    LuEye,
    LuShield,
    LuClock,
    LuUser2,
    LuUsers,
    LuTarget,
    LuCheckCircle,
    LuXCircle,
    LuFlag,
    LuLink
} from "@qwikest/icons/lucide"
import { Avatar, Breadcrumb } from "~/components/ui"
import { useSession } from "~/routes/plugin@auth"
import { timeAgo } from "~/utils/dateUtils"
import { useGetProjectBySlug } from "~/shared/loaders"
import CommentsList from "~/components/comments/CommentsList"
import ProjectCommentForm from "~/components/comments/ProjectCommentForm"
import Modal from "~/components/Modal"
import FormReport from "~/components/forms/FormReport"
import SocialLoginButtons from "~/components/SocialLoginButtons"
import { _ } from "compiled-i18n"

// Export necessary loaders and actions
export { useGetProjectBySlug } from "~/shared/loaders"
export { useReactProject } from "~/shared/actions"

// Add interfaces for types
interface Community {
    id: string;
    name: string;
    cca2?: string;
}

interface Step {
    id: string;
    title: string;
    description?: string;
    status: string;
    resources: Resource[];
}

interface Resource {
    type: string;
    description: string;
    quantity?: number;
    unit?: string;
}

export default component$(() => {
    const session = useSession()
    const isAuthenticated = !!session.value?.user
    const projectData = useGetProjectBySlug()
    const showLoginModal = useSignal(false)
    const showReportModal = useSignal(false)
    const showCopiedMessage = useSignal(false)
    
    // Remove unused declaration or comment it
    // const actionReact = useReactProject()
    
    const onShowLoginModal = $(() => {
        showLoginModal.value = true
    })

    const onCommentAdded = $(() => {
        console.log("Comment added")
    })

    const handleReportClick = $(() => {
        if (!isAuthenticated) {
            onShowLoginModal()
            return
        }
        showReportModal.value = true
    })

    const copyProjectLink = $(() => {
        try {
            const projectUrl = `${window.location.origin}/projects/${projectData.value?.slug}`
            navigator.clipboard.writeText(projectUrl)
            showCopiedMessage.value = true
            setTimeout(() => {
                showCopiedMessage.value = false
            }, 3000)
        } catch (error) {
            console.error("Error copying link:", error)
        }
    })

    if (!projectData.value) {
        return (
            <div class="flex items-center justify-center h-screen">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
            </div>
        )
    }

    const project = projectData.value
    const commentsCount = project.comments_count || project.comments?.length || 0

    const getStatusIcon = (status: string) => {
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

    const getStatusBadgeClass = (status: string) => {
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

    const calculateProgress = (current: number, goal: number | null | undefined) => {
        if (!goal) return 0
        const progress = (current / goal) * 100
        return Math.min(progress, 100)
    }

    return (
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Login modal */}
            <Modal
                title={_`Log in to participate`}
                show={showLoginModal}
            >
                <div class="p-4 text-center">
                    <p class="mb-6 text-gray-600 dark:text-gray-300">
                        {_`You need to log in to comment and participate in the community.`}
                    </p>
                    <SocialLoginButtons />
                </div>
            </Modal>

            {/* Report modal */}
            <Modal
                title={_`Report project`}
                show={showReportModal}
            >
                <FormReport 
                    type="PROJECT"
                    itemId={project.id}
                />
            </Modal>

            {/* Breadcrumb */}
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/">{_`Global`}</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="/projects">{_`Projects`}</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link>{project.title}</Breadcrumb.Link>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Main column */}
                <div class="lg:col-span-2 space-y-8">
                    {/* Project header */}
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-2">
                                <span class={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
                                    {getStatusIcon(project.status)}
                                    {project.status}
                                </span>
                                {project.communities.map((community: Community) => (
                                    <span
                                        key={community.id}
                                        class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    >
                                        {community.cca2 && `${community.cca2} `}
                                        {community.name}
                                    </span>
                                ))}
                            </div>
                            
                            <div class="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                <LuEye class="w-4 h-4 mr-1" />
                                <span>{project.views_count} {_`views`}</span>
                            </div>
                        </div>
                        
                        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                            {project.title}
                        </h1>
                        
                        {project.description && (
                            <p class="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                                {project.description}
                            </p>
                        )}

                        {/* Progress bar if there is a goal */}
                        {project.goal_amount && (
                            <div class="mb-6">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-gray-700 dark:text-gray-300">{_`Progress`}</span>
                                    <span class="text-gray-700 dark:text-gray-300">
                                        ${project.current_amount} / ${project.goal_amount}
                                        {project.goal_amount > 0 && ` (${Math.round((project.current_amount / project.goal_amount) * 100)}%)`}
                                    </span>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div
                                        class="bg-cyan-600 h-2.5 rounded-full transition-all duration-500"
                                        style={`width: ${calculateProgress(project.current_amount, project.goal_amount)}%`}
                                    ></div>
                                </div>
                            </div>
                        )}
                        
                        <div class="flex items-center justify-between mt-6 text-sm border-t pt-4 border-gray-200 dark:border-gray-700">
                            <div class="flex items-center">
                                {project.is_anonymous ? (
                                    <div class="flex items-center">
                                        <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <LuUser2 class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <span class="text-gray-600 dark:text-gray-400 italic ml-1">
                                            {_`Anonymous`}
                                        </span>
                                    </div>
                                ) : (
                                    <div class="flex items-center">
                                        <Avatar.Root>
                                            <Avatar.Image
                                                src={project.creator.image}
                                                alt={project.creator.username}
                                                class="w-6 h-6 rounded-full"
                                            />
                                        </Avatar.Root>
                                        <span class="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer ml-1">
                                            {project.creator.username}
                                        </span>
                                    </div>
                                )}
                                
                                <span class="mx-2">•</span>
                                
                                <div class="flex items-center">
                                    <LuClock class="w-4 h-4 mr-1 text-gray-500" />
                                    <span>{timeAgo(new Date(project.created_at))}</span>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-2">
                                <button 
                                    class="group relative p-2 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm"
                                    onClick$={copyProjectLink}
                                    title={_`Copy link`}
                                >
                                    {showCopiedMessage.value && (
                                        <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap animate-fade-in">
                                            {_`Link copied!`}
                                            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black bg-opacity-80 rotate-45"></div>
                                        </div>
                                    )}
                                    <LuLink class="w-5 h-5 text-gray-500 group-hover:text-purple-500 transition-colors duration-300" />
                                </button>

                                {isAuthenticated && !project.is_creator && (
                                    <button
                                        onClick$={handleReportClick}
                                        class="group p-2 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm"
                                        title={_`Report project`}
                                    >
                                        <LuFlag class="w-5 h-5 text-gray-500 group-hover:text-amber-500 transition-colors duration-300" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Project steps */}
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6">
                            {_`Project Steps`}
                        </h2>

                        <div class="space-y-6">
                            {project.steps.map((step: Step, index: number) => (
                                <div 
                                    key={step.id}
                                    class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                                >
                                    <div class="flex items-center justify-between mb-4">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    step.status === "COMPLETED"
                                                        ? "bg-green-100 dark:bg-green-900/30"
                                                        : step.status === "IN_PROGRESS"
                                                            ? "bg-yellow-100 dark:bg-yellow-900/30"
                                                            : "bg-gray-100 dark:bg-gray-700"
                                                }`}
                                            >
                                                <span class="text-sm font-medium">{index + 1}</span>
                                            </div>
                                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                                                {step.title}
                                            </h3>
                                        </div>
                                        <span
                                            class={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                step.status === "COMPLETED"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                    : step.status === "IN_PROGRESS"
                                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                            }`}
                                        >
                                            {step.status}
                                        </span>
                                    </div>

                                    {step.description && (
                                        <p class="text-gray-600 dark:text-gray-300 mb-4">
                                            {step.description}
                                        </p>
                                    )}

                                    {step.resources && step.resources.length > 0 && (
                                        <div class="mt-4">
                                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {_`Resources needed`}
                                            </h4>
                                            <div class="space-y-2">
                                                {step.resources.map((resource: Resource, resourceIndex: number) => (
                                                    <div 
                                                        key={resourceIndex}
                                                        class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md"
                                                    >
                                                        <div class="flex items-center gap-2">
                                                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {resource.type}:
                                                            </span>
                                                            <span class="text-sm text-gray-600 dark:text-gray-400">
                                                                {resource.description}
                                                            </span>
                                                        </div>
                                                        {resource.quantity && (
                                                            <span class="text-sm text-gray-600 dark:text-gray-400">
                                                                {resource.quantity} {resource.unit || ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Comments section */}
                    <div class="mt-8">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            {_`Comments`} ({commentsCount})
                        </h2>
                        
                        {isAuthenticated ? (
                            <ProjectCommentForm
                                projectId={project.id}
                                onSubmitCompleted={onCommentAdded}
                            />
                        ) : (
                            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center mb-6">
                                <p class="text-gray-600 dark:text-gray-300 mb-2">
                                    {_`Sign in to leave a comment`}
                                </p>
                                <button 
                                    class="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"
                                    onClick$={onShowLoginModal}
                                >
                                    {_`Sign in`}
                                </button>
                            </div>
                        )}
                        
                        <div class="mt-6">
                            <CommentsList 
                                comments={project.comments || []}
                                onShowLoginModal$={onShowLoginModal}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Sidebar */}
                <div class="lg:col-span-1 space-y-6">
                    {/* Project information */}
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <h3 class="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                            <LuShield class="w-5 h-5 mr-2 text-gray-500" />
                            {_`Project Information`}
                        </h3>
                        
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {_`Created by`}
                                </span>
                                <div class="flex items-center">
                                    {project.is_anonymous ? (
                                        <span class="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                            <LuUser2 class="w-4 h-4 mr-1 text-gray-500" /> 
                                            {_`Anonymous`}
                                        </span>
                                    ) : (
                                        <div class="flex items-center">
                                            <Avatar.Root>
                                                <Avatar.Image 
                                                    src={project.creator.image} 
                                                    alt={project.creator.username} 
                                                    class="w-5 h-5 rounded-full mr-1" 
                                                />
                                            </Avatar.Root>
                                            <span class="font-medium text-gray-800 dark:text-gray-200">
                                                {project.creator.username}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {_`Created on`}
                                </span>
                                <span class="font-medium text-gray-800 dark:text-gray-200">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {_`Status`}
                                </span>
                                <span class={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
                                    {getStatusIcon(project.status)}
                                    {project.status}
                                </span>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {_`Views`}
                                </span>
                                <span class="font-medium text-gray-800 dark:text-gray-200">
                                    {project.views_count}
                                </span>
                            </div>

                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {_`Commitments`}
                                </span>
                                <span class="font-medium text-gray-800 dark:text-gray-200">
                                    {project.commitments?.length || 0}
                                </span>
                            </div>
                        </div>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {_`Tags`}
                                </h4>
                                <div class="flex flex-wrap gap-2">
                                    {project.tags.map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
})

export const head: DocumentHead = ({ resolveValue }) => {
    const project = resolveValue(useGetProjectBySlug)
    return {
        title: project?.title || _`Project Details`,
        meta: [
            {
                name: "description",
                content: project?.description || _`View project details and join the collaboration`,
            },
        ],
    }
}
