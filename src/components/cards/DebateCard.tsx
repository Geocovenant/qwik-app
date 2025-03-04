import { $, component$, useStylesScoped$, useSignal } from "@builder.io/qwik";
import { LuCalendar, LuMessageSquare, LuTag, LuClock, LuLink, LuGlobe } from '@qwikest/icons/lucide';
import { Link, useNavigate } from "@builder.io/qwik-city";
import { PollScope } from "~/shared/types";
import { timeAgo } from "~/utils/dateUtils";
import styles from "./debate-card.css?inline";
import { Avatar, Button } from "~/components/ui";
import { Image } from "@unpic/qwik";
import { _ } from "compiled-i18n";
import type { QRL } from "@builder.io/qwik";

export interface DebateCardProps {
    id: number;
    title: string;
    description: string;
    images?: string[];
    creator_username: string;
    creator_avatar: string;
    created_at: string;
    last_comment_at?: string;
    tags?: string[];
    slug?: string;
    comments_count: number;
    scope: string;
    isAuthenticated?: boolean;
    onShowLoginModal$?: QRL<() => void>;
    points_of_view?: any[]; // Array of points of view (countries)
}

export default component$<DebateCardProps>(({
    title,
    description,
    images,
    creator_username,
    creator_avatar,
    created_at,
    last_comment_at,
    slug,
    tags = [],
    comments_count,
    scope,
    isAuthenticated = true,
    onShowLoginModal$,
    points_of_view = []
}) => {
    useStylesScoped$(styles);
    const nav = useNavigate();
    const onClickUsername = $((username: string) => nav(`/user/${username}`));
    const showCopiedMessage = useSignal(false);

    const mainImage = images && images.length > 0 ? images[0] : undefined;
    const countriesCount = points_of_view?.length || 0;

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

                {/* Countries information */}
                {scope === PollScope.GLOBAL && countriesCount > 0 && (
                    <div class="flex items-center gap-2 text-sm mb-3">
                        <span class="text-gray-500 dark:text-gray-400">{_`Participating countries:`}</span>
                        <span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-medium text-gray-700 dark:text-gray-300">
                            {countriesCount}
                        </span>
                    </div>
                )}

                {/* Creator information and dates */}
                <div class="flex flex-wrap justify-between items-center mt-4 text-gray-500 dark:text-gray-400 text-xs">
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center" onClick$={() => onClickUsername(creator_username)}>
                            <Avatar.Root>
                                <Avatar.Image
                                    src={creator_avatar}
                                    alt={creator_username}
                                    class="w-6 h-6 rounded-full"
                                />
                            </Avatar.Root>
                            <span class="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer ml-1">
                                {creator_username}
                            </span>
                        </div>
                        <div class="flex items-center">
                            <LuCalendar class="w-4 h-4 mr-1" />
                            <span title={new Date(created_at).toLocaleString()}>
                                {timeAgo(new Date(created_at))}
                            </span>
                        </div>
                    </div>
                    
                    <div class="flex items-center mt-2 sm:mt-0">
                        <div class="flex items-center">
                            <LuMessageSquare class="w-4 h-4 mr-1" />
                            <span>{comments_count} {_`comments`}</span>
                        </div>
                        
                        {last_comment_at && (
                            <div class="flex items-center ml-3">
                                <LuClock class="w-4 h-4 mr-1" />
                                <span title="Last comment">
                                    {timeAgo(new Date(last_comment_at))}
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
                    
                    <Link 
                        href={`/debates/${slug}`}
                        class="bg-cyan-600 hover:bg-cyan-700 text-white text-sm px-4 py-2 rounded-md transition-colors duration-300 inline-flex items-center justify-center"
                    >
                        {_`View debate`}
                    </Link>
                </div>
            </div>
        </div>
    );
}); 