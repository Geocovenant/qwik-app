import { $, component$, useSignal, type QRL } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import {
    LuCalendar,
    LuUsers,
    LuTarget,
    LuClock,
    LuCheckCircle, 
    LuXCircle,
    LuLink,
    LuTrash2,
    LuFlag,
    LuExternalLink
} from "@qwikest/icons/lucide";
import { timeAgo } from "~/utils/dateUtils";
import { Avatar } from "~/components/ui";
import ConfirmationModal from "~/components/ConfirmationModal";
import Modal from "~/components/Modal";
import FormReport from "~/components/forms/FormReport";
import { _ } from "compiled-i18n";

export interface ProjectCardProps {
    id: number;
    title: string;
    description?: string;
    slug: string;
    status: string;
    createdAt: string;
    creatorUsername: string;
    creatorAvatar: string;
    currentAmount: number;
    goalAmount?: number | null;
    steps: {
        id: number;
        title: string;
        status: string;
    }[];
    communities: {
        id: number;
        name: string;
        cca2?: string | null;
    }[];
    commitments: any[];
    isAuthenticated?: boolean;
    currentUsername?: string;
    onShowLoginModal$?: QRL<() => void>;
}

export default component$<ProjectCardProps>(({
    id,
    title,
    description,
    slug,
    status,
    createdAt,
    creatorUsername,
    creatorAvatar,
    currentAmount,
    goalAmount,
    steps,
    communities,
    commitments,
    isAuthenticated = true,
    currentUsername = "",
    onShowLoginModal$
}) => {
    const nav = useNavigate();
    const showCopiedMessage = useSignal(false);
    const showReportModal = useSignal(false);
    const showConfirmDeleteModal = useSignal(false);
    
    // Determine if the current user is the creator
    const isCreator = currentUsername === creatorUsername;

    const getStatusIcon = (statusValue: string) => {
        switch (statusValue) {
            case "DRAFT":
                return <LuClock class="w-4 h-4" />;
            case "OPEN":
                return <LuUsers class="w-4 h-4" />;
            case "IN_PROGRESS":
                return <LuTarget class="w-4 h-4" />;
            case "COMPLETED":
                return <LuCheckCircle class="w-4 h-4" />;
            case "CANCELLED":
            case "CLOSED":
                return <LuXCircle class="w-4 h-4" />;
            default:
                return <LuClock class="w-4 h-4" />;
        }
    };

    const getStatusBadgeClass = (statusValue: string) => {
        switch (statusValue) {
            case "DRAFT":
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
            case "OPEN":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
            case "IN_PROGRESS":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
            case "COMPLETED":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
            case "CANCELLED":
            case "CLOSED":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
        }
    };

    const calculateProgress = (current: number, goal: number | null | undefined) => {
        if (!goal) return 0;
        const progress = (current / goal) * 100;
        return Math.min(progress, 100);
    };

    const copyProjectLink = $(() => {
        try {
            const projectUrl = `${window.location.origin}/projects/${slug}`;
            navigator.clipboard.writeText(projectUrl);
            showCopiedMessage.value = true;
            setTimeout(() => {
                showCopiedMessage.value = false;
            }, 3000);
        } catch (error) {
            console.error("Error copying link:", error);
        }
    });
    
    const handleReportClick = $(() => {
        if (!isAuthenticated && onShowLoginModal$) {
            onShowLoginModal$();
            return;
        }
        showReportModal.value = true;
    });
    
    const handleDeleteClick = $(() => {
        showConfirmDeleteModal.value = true;
    });
    
    const handleDelete = $(() => {
        // Logic to delete the project
        console.log("Delete project:", id);
        // Pending implementation: connect with a backend action
        showConfirmDeleteModal.value = false;
    });

    const onClickUsername = $(() => nav(`/user/${creatorUsername}`));

    return (
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <div class="p-5">
                {/* Header with title and status badge */}
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">{title}</h3>
                    <span class={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
                        {getStatusIcon(status)}
                        {status === "IN_PROGRESS" ? _`In Progress` : _(status)}
                    </span>
                </div>

                {/* Description */}
                {description && (
                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>
                )}

                {/* Date and commitments information */}
                <div class="flex flex-wrap gap-4 mb-4">
                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <LuCalendar class="w-4 h-4 mr-1" />
                        {_`Created: ${timeAgo(new Date(createdAt))}`}
                    </div>

                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <LuUsers class="w-4 h-4 mr-1" />
                        {_`Commitments: ${commitments.length}`}
                    </div>
                </div>

                {/* Progress bar if there is a goal */}
                {goalAmount && (
                    <div class="mb-3">
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-gray-700 dark:text-gray-300">{_`Progress`}</span>
                            <span class="text-gray-700 dark:text-gray-300">
                                {currentAmount} / {goalAmount}
                                {goalAmount > 0 && ` (${Math.round((currentAmount / goalAmount) * 100)}%)`}
                            </span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                                class="bg-cyan-600 h-2.5 rounded-full"
                                style={`width: ${calculateProgress(currentAmount, goalAmount)}%`}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Project steps */}
                {steps.length > 0 && (
                    <div class="mt-4">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{_`Project Steps`}</h4>
                        <div class="space-y-2">
                            {steps.slice(0, 3).map((step) => (
                                <div key={step.id} class="flex items-center">
                                    <div
                                        class={`w-2 h-2 rounded-full mr-2 ${
                                            step.status === "COMPLETED"
                                                ? "bg-green-500"
                                                : step.status === "IN_PROGRESS"
                                                    ? "bg-yellow-500"
                                                    : "bg-gray-400"
                                        }`}
                                    ></div>
                                    <span class="text-sm text-gray-600 dark:text-gray-300 truncate">{step.title}</span>
                                </div>
                            ))}
                            {steps.length > 3 && (
                                <div class="text-xs text-cyan-600 dark:text-cyan-400">
                                    {_`+ ${steps.length - 3} more steps`}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Associated communities */}
                {communities.length > 0 && (
                    <div class="mt-4 flex flex-wrap gap-2">
                        {communities.map((community) => (
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

            {/* Card footer with creator and actions */}
            <div class="bg-gray-50 dark:bg-gray-900/30 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div class="flex items-center" onClick$={onClickUsername}>
                    <div class="flex-shrink-0">
                        <Avatar.Root>
                            <Avatar.Image
                                class="h-8 w-8 rounded-full"
                                src={creatorAvatar || "/placeholder-user.svg"}
                                alt={creatorUsername}
                            />
                        </Avatar.Root>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer">
                            {creatorUsername}
                        </p>
                    </div>
                </div>

                {/* Action buttons */}
                <div class="flex items-center gap-2">
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
                    
                    {isAuthenticated && isCreator && (
                        <button
                            onClick$={handleDeleteClick}
                            class="group p-2 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm"
                            title={_`Delete project`}
                        >
                            <LuTrash2 class="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors duration-300" />
                        </button>
                    )}

                    {isAuthenticated && !isCreator && (
                        <button
                            onClick$={handleReportClick}
                            class="group p-2 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm"
                            title={_`Report project`}
                        >
                            <LuFlag class="w-5 h-5 text-gray-500 group-hover:text-amber-500 transition-colors duration-300" />
                        </button>
                    )}
                    
                    <Link
                        href={`/projects/${slug}`}
                        class="bg-cyan-600 hover:bg-cyan-700 text-white text-sm px-4 py-2 rounded-md transition-colors duration-300 inline-flex items-center justify-center gap-1"
                    >
                        <span>{_`View details`}</span>
                        <LuExternalLink class="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Modals */}
            <ConfirmationModal
                title={_`Delete project`}
                description={_`Are you sure you want to delete this project? This action cannot be undone.`}
                show={showConfirmDeleteModal}
                onConfirm$={handleDelete}
            />
            
            <Modal
                title={_`Report project`}
                show={showReportModal}
            >
                <FormReport 
                    type="PROJECT" 
                    itemId={id} 
                />
            </Modal>
        </div>
    );
});
