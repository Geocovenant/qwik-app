import { $, component$, useSignal, type QRL } from "@builder.io/qwik";
import { Link, useNavigate } from "@builder.io/qwik-city";
import {
    LuCalendar,
    LuUsers,
    LuTarget,
    LuLink,
    LuTrash2,
    LuFlag,
    LuExternalLink,
    LuList,
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

    const getStatusBadgeClass = (statusValue: string) => {
        switch (statusValue) {
            case "DRAFT":
                return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30";
            case "OPEN":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30";
            case "IN_PROGRESS":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800/30";
            case "COMPLETED":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800/30";
            case "CANCELLED":
            case "CLOSED":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800/30";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700/30";
        }
    };

    const getStepStatusClass = (stepStatus: string) => {
        switch (stepStatus) {
            case "COMPLETED":
                return "bg-green-500 dark:bg-green-400";
            case "IN_PROGRESS":
                return "bg-purple-500 dark:bg-purple-400";
            case "PENDING":
            default:
                return "bg-gray-300 dark:bg-gray-600";
        }
    };

    const getStepStatusText = (stepStatus: string) => {
        switch (stepStatus) {
            case "COMPLETED":
                return _`Completed`;
            case "IN_PROGRESS":
                return _`In Progress`;
            case "PENDING":
            default:
                return _`Pending`;
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
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden relative">
            {/* Status ribbon */}
            <div class="absolute right-0 top-0">
                <div class={`px-4 py-1 text-white text-xs font-bold uppercase ${getStatusBadgeClass(status)}`}>
                    {status.replace("_", " ")}
                </div>
            </div>

            <div class="p-5">
                {/* Header with title and Owner badge */}
                <div class="flex items-center gap-2 mb-3">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">
                        {title}
                    </h3>
                    {isCreator && (
                        <div class="flex-shrink-0 bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase px-3 py-1 rounded-full border border-slate-300 dark:border-slate-600">
                            {_`Owner`}
                        </div>
                    )}
                </div>

                {/* Description */}
                {description && (
                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{description}</p>
                )}

                {/* Meta y compromisos con iconos más atractivos */}
                <div class="flex flex-wrap items-center gap-4 mb-4">
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/80 px-3 py-1.5 rounded-md border border-gray-100 dark:border-gray-700">
                        <LuCalendar class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-500" />
                        <span title={new Date(createdAt).toLocaleString()}>
                            {timeAgo(new Date(createdAt))}
                        </span>
                    </div>

                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/80 px-3 py-1.5 rounded-md border border-gray-100 dark:border-gray-700">
                        <LuUsers class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-500" />
                        <span>
                            {commitments.length} {commitments.length === 1 ? _`commitment` : _`commitments`}
                        </span>
                    </div>
                </div>

                {/* Progress bar with improved styling */}
                {!!goalAmount && (
                    <div class="mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div class="flex justify-between text-sm mb-2">
                            <div class="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                <LuTarget class="w-4 h-4 text-[#713fc2] dark:text-[#9333EA]" />
                                <span>{_`Project Goal`}</span>
                            </div>
                            <span class="text-gray-700 dark:text-gray-300 font-medium">
                                ${currentAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })} / ${goalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        
                        <div class="relative pt-1">
                            <div class="flex mb-2 items-center justify-between">
                                <div>
                                    <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#713fc2] dark:text-[#9333EA] bg-purple-200 dark:bg-purple-900/30">
                                        {Math.round((currentAmount / goalAmount) * 100)}%
                                    </span>
                                </div>
                            </div>
                            <div class="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    style={`width: ${calculateProgress(currentAmount, goalAmount)}%`}
                                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#713fc2] to-[#9333EA]"
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Project steps with improved visual */}
                {steps.length > 0 && (
                    <div class="mt-4 mb-4 bg-white dark:bg-gray-800/90 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                            <LuList class="w-4 h-4 text-[#713fc2] dark:text-[#9333EA]" />
                            <span>{_`Project Steps`}</span>
                        </h4>
                        
                        <div class="space-y-2.5">
                            {steps.map((step) => (
                                <div key={step.id} class="flex items-center group relative">
                                    <div class={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${getStepStatusClass(step.status)}`}></div>
                                    <div class="flex-grow">
                                        <div class="flex items-center justify-between">
                                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{step.title}</span>
                                            <span class={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(step.status)}`}>
                                                {getStepStatusText(step.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action buttons with creator moved to footer */}
                <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Creator info */}
                    <div class="flex items-center cursor-pointer" onClick$={onClickUsername}>
                        <Avatar.Root>
                            <Avatar.Image
                                class="h-8 w-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
                                src={creatorAvatar || "/placeholder-user.svg"}
                                alt={creatorUsername}
                            />
                        </Avatar.Root>
                        <div class="ml-2">
                            <p class="text-sm font-medium text-gray-900 dark:text-white hover:text-[#713fc2] dark:hover:text-[#9333EA] transition-colors">
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
                            <LuLink class="w-5 h-5 text-gray-500 group-hover:text-[#713fc2] dark:group-hover:text-[#9333EA] transition-colors duration-300" />
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
                            class="bg-[#713fc2] hover:bg-[#9333EA] text-white text-sm px-4 py-2 rounded-md transition-colors duration-300 inline-flex items-center justify-center gap-1"
                        >
                            <span>{_`View details`}</span>
                            <LuExternalLink class="w-4 h-4" />
                        </Link>
                    </div>
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
