import { $, component$, useStylesScoped$, useSignal, useComputed$ } from "@builder.io/qwik";
import { LuCalendar, LuLink, LuGlobe, LuTrash2, LuFlag, LuUser2, LuEye, LuMessageSquare } from '@qwikest/icons/lucide';
import { Link, useNavigate } from "@builder.io/qwik-city";
import { timeAgo } from "~/utils/dateUtils";
import styles from "./debate-card.css?inline";
import { Avatar } from "~/components/ui";
import { Image } from "@unpic/qwik";
import { _ } from "compiled-i18n";
import type { QRL } from "@builder.io/qwik";
import ConfirmationModal from "~/components/ConfirmationModal";
import Modal from "~/components/Modal";
import FormReport from "~/components/forms/FormReport";
import { dataArray } from "~/data/countries";
import { CommunityType } from "~/constants/communityType";

export interface DebateCardProps {
    communities?: any[];
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
    viewsCount?: number;
}

export default component$<DebateCardProps>(({
    communities = [],
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
    viewsCount = 0,
}) => {
    useStylesScoped$(styles);
    const nav = useNavigate();
    const onClickUsername = $((username: string) => nav(`/user/${username}`));
    const showCopiedMessage = useSignal(false);
    const showReportModal = useSignal(false);
    const showConfirmDeleteModal = useSignal(false);

    const commentsCount = useComputed$(() => {
        return pointsOfView.reduce((total, pov) => total + (pov.comments?.length || 0), 0) || 0;
    });

    const mainImage = images && images.length > 0 ? images[0] : undefined;
    
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

    const getCountryData = (code: string) => {
        return dataArray.find((country) => country.cca2 === code);
    };

    return (
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden relative">
            {/* Main content */}
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
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{description}</p>

                {/* Image if exists */}
                {mainImage && (
                    <div class="mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <Image
                            alt={title}
                            class="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                            src={mainImage}
                            layout="fill"
                        />
                    </div>
                )}

                {/* Tags - Style similar to PollCard */}
                {tags.length > 0 && (
                    <div class="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag) => (
                            <span key={tag} class="px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Participating countries - only for GLOBAL using pointsOfView */}
                {(scope === CommunityType.GLOBAL || scope === CommunityType.INTERNATIONAL) && (
                    <div class="mb-3">
                        <div class="flex items-center gap-1 mb-2">
                            <LuGlobe class="w-4 h-4 text-blue-500 dark:text-blue-400" />
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {_`Participating countries`} ({pointsOfView.length})
                            </span>
                        </div>
                        {scope === CommunityType.INTERNATIONAL && (
                            <div class="flex gap-1 flex-wrap">
                                {communities.map((community) => {
                                    const country = getCountryData(community.cca2);
                                    return (
                                        country && (
                                            <span
                                                key={community.id}
                                                class="text-xl cursor-help hover:transform hover:scale-125 transition-transform"
                                                title={community.name}
                                            >
                                                {country.flag}
                                            </span>
                                        )
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Stats row - Simplified similar to PollCard */}
                <div class="flex flex-wrap items-center justify-between mt-3 mb-4">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <LuEye class="w-4 h-4" />
                            <span>{viewsCount}</span>
                        </div>
                        
                        <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <LuMessageSquare class="w-4 h-4" />
                            <span>{commentsCount.value}</span>
                        </div>
                    </div>
                    
                    {lastCommentAt && (
                        <div class="flex items-center text-xs text-amber-600 dark:text-amber-400">
                            <span class="font-medium mr-1">{_`Last activity:`}</span> 
                            <span title={new Date(lastCommentAt).toLocaleString()}>
                                {timeAgo(new Date(lastCommentAt))}
                            </span>
                        </div>
                    )}
                </div>

                {/* Action buttons with creator moved to footer */}
                <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Creator info */}
                    <div class="flex items-center">
                        {isAnonymous ? (
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <LuUser2 class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <span class="text-gray-600 dark:text-gray-400 italic ml-2 text-sm">
                                    {_`Anonymous`}
                                </span>
                            </div>
                        ) : (
                            <div class="flex items-center cursor-pointer" onClick$={() => onClickUsername(creatorUsername)}>
                                <Avatar.Root>
                                    <Avatar.Image
                                        src={creatorAvatar}
                                        alt={creatorUsername}
                                        class="w-8 h-8 rounded-full"
                                    />
                                </Avatar.Root>
                                <span class="ml-2 hover:text-cyan-600 dark:hover:text-cyan-400 text-gray-700 dark:text-gray-300 text-sm font-medium">
                                    {creatorUsername}
                                </span>
                            </div>
                        )}
                        
                        <div class="flex items-center gap-1 ml-4 text-sm text-gray-500 dark:text-gray-400">
                            <LuCalendar class="w-4 h-4" />
                            <span title={new Date(createdAt).toLocaleString()}>
                                {timeAgo(new Date(createdAt))}
                            </span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div class="flex items-center gap-2">
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
                            <LuLink class="w-5 h-5 text-gray-500 group-hover:text-[#713fc2] dark:group-hover:text-[#9333EA] transition-colors duration-300" />
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
                            class="bg-[#713fc2] hover:bg-[#9333EA] text-white text-sm px-4 py-2 rounded-md transition-colors duration-300 inline-flex items-center justify-center"
                        >
                            {_`View debate`}
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Modals */}
            <Modal
                title={_`Report debate`}
                show={showReportModal}
            >
                <FormReport 
                    type="DEBATE" 
                    itemId={id} 
                />
            </Modal>
            
            <ConfirmationModal
                title={_`Delete debate`}
                description={_`Are you sure you want to delete this debate? This action cannot be undone.`}
                show={showConfirmDeleteModal}
                onConfirm$={handleDelete}
            />
        </div>
    );
}); 