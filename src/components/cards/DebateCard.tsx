import { $, component$, useStylesScoped$, useSignal } from "@builder.io/qwik";
import { LuCalendar, LuMessageSquare, LuTag, LuClock, LuLink, LuGlobe, LuTrash2, LuFlag, LuUser2 } from '@qwikest/icons/lucide';
import { Link, useNavigate } from "@builder.io/qwik-city";
import { PollScope } from "~/shared/types";
import { timeAgo } from "~/utils/dateUtils";
import styles from "./debate-card.css?inline";
import { Avatar } from "~/components/ui";
import { Image } from "@unpic/qwik";
import { _ } from "compiled-i18n";
import type { QRL } from "@builder.io/qwik";
import ConfirmationModal from "~/components/ConfirmationModal";
import Modal from "~/components/Modal";
import FormReport from "~/components/forms/FormReport";

export interface DebateCardProps {
    commentsCount: number;
    createdAt: string;
    creatorAvatar: string;
    creatorUsername: string;
    currentUsername?: string;
    description: string;
    id: number;
    images?: string[];
    isAnonymous: boolean;
    isAuthenticated?: boolean;
    lastCommentAt?: string;
    onShowLoginModal$?: QRL<() => void>;
    pointsOfView?: any[];
    scope: string;
    slug?: string;
    tags?: string[];
    title: string;
}

export default component$<DebateCardProps>(({
    commentsCount,
    createdAt,
    creatorAvatar,
    creatorUsername,
    currentUsername = "",
    description,
    id,
    images,
    isAnonymous,
    isAuthenticated = true,
    lastCommentAt,
    onShowLoginModal$,
    pointsOfView = [],
    scope,
    slug,
    tags = [],
    title,
}) => {
    useStylesScoped$(styles);
    const nav = useNavigate();
    const onClickUsername = $((username: string) => nav(`/user/${username}`));
    const showCopiedMessage = useSignal(false);
    const showReportModal = useSignal(false);
    const showConfirmDeleteModal = useSignal(false);

    const mainImage = images && images.length > 0 ? images[0] : undefined;
    const countriesCount = pointsOfView?.length || 0;
    
    // Determine if the current user is the creator
    const isCreator = currentUsername === creatorUsername;

    const copyDebateLink = $(() => {
        try {
            const debateUrl = `${window.location.origin}/debates/${slug}`;
            navigator.clipboard.writeText(debateUrl);
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
        // Logic to delete the debate would go here
        console.log("Delete debate:", id);
        // Pending implementation: connect with a backend action
        showConfirmDeleteModal.value = false;
    });

    return (
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div class="p-5">
                {/* Header with title and scope badge */}
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
                    {scope === PollScope.GLOBAL && 
                        <div
                            class="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400"
                            title={_`Global`}
                        >
                            <LuGlobe class="w-5 h-5" />
                        </div>
                    }
                </div>

                {/* Description */}
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>

                {/* Image if exists */}
                {mainImage && (
                    <div class="mb-4 rounded-lg overflow-hidden">
                        <Image
                            alt={title}
                            class="w-full h-48 object-cover"
                            src={mainImage}
                            layout="fill"
                        />
                    </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                    <div class="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag) => (
                            <span key={tag} class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                                <LuTag class="w-3 h-3 mr-1" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Country information */}
                {scope === PollScope.GLOBAL && countriesCount > 0 && (
                    <div class="flex items-center gap-2 text-sm mb-3">
                        <span class="text-gray-500 dark:text-gray-400">{_`Participating countries:`}</span>
                        <span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-medium text-gray-700 dark:text-gray-300">
                            {countriesCount}
                        </span>
                    </div>
                )}

                {/* Creator and date information */}
                <div class="flex flex-wrap justify-between items-center mt-4 text-gray-500 dark:text-gray-400 text-xs">
                    <div class="flex items-center space-x-4">
                        {isAnonymous ? (
                            <div class="flex items-center">
                                <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <LuUser2 class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <span class="text-gray-600 dark:text-gray-400 italic ml-1">
                                    {_`Anonymous`}
                                </span>
                            </div>
                        ) : (
                            <div class="flex items-center" onClick$={() => onClickUsername(creatorUsername)}>
                                <Avatar.Root>
                                    <Avatar.Image
                                        src={creatorAvatar}
                                        alt={creatorUsername}
                                        class="w-6 h-6 rounded-full"
                                    />
                                </Avatar.Root>
                                <span class="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer ml-1">
                                    {creatorUsername}
                                </span>
                            </div>
                        )}
                        <div class="flex items-center">
                            <LuCalendar class="w-4 h-4 mr-1" />
                            <span title={new Date(createdAt).toLocaleString()}>
                                {timeAgo(new Date(createdAt))}
                            </span>
                        </div>
                    </div>
                    
                    <div class="flex items-center mt-2 sm:mt-0">
                        <div class="flex items-center">
                            <LuMessageSquare class="w-4 h-4 mr-1" />
                            <span>{commentsCount} {_`comments`}</span>
                        </div>
                        
                        {lastCommentAt && (
                            <div class="flex items-center ml-3">
                                <LuClock class="w-4 h-4 mr-1" />
                                <span title="Last comment">
                                    {timeAgo(new Date(lastCommentAt))}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action buttons */}
                <div class="flex justify-end mt-4 gap-2">
                    <button 
                        class="group relative p-2 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm"
                        onClick$={copyDebateLink}
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
                            title={_`Delete debate`}
                        >
                            <LuTrash2 class="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors duration-300" />
                        </button>
                    )}

                    {isAuthenticated && !isCreator && (
                        <button
                            onClick$={handleReportClick}
                            class="group p-2 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm"
                            title={_`Report debate`}
                        >
                            <LuFlag class="w-5 h-5 text-gray-500 group-hover:text-amber-500 transition-colors duration-300" />
                        </button>
                    )}
                    
                    <Link 
                        href={`/debates/${slug}`}
                        class="bg-cyan-600 hover:bg-cyan-700 text-white text-sm px-4 py-2 rounded-md transition-colors duration-300 inline-flex items-center justify-center"
                    >
                        {_`View debate`}
                    </Link>
                </div>
            </div>
            
            {/* Modals */}
            <ConfirmationModal
                title={_`Delete debate`}
                description={_`Are you sure you want to delete this debate? This action cannot be undone.`}
                show={showConfirmDeleteModal}
                onConfirm$={handleDelete}
            />
            
            <Modal
                title={_`Report debate`}
                show={showReportModal}
            >
                <FormReport 
                    type="DEBATE" 
                    itemId={id} 
                />
            </Modal>
        </div>
    );
}); 