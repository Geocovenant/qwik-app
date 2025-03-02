import { $, component$, useStylesScoped$ } from "@builder.io/qwik";
import { LuCalendar, LuMessageSquare, LuTag, LuClock } from '@qwikest/icons/lucide';
import { Link, useNavigate } from "@builder.io/qwik-city";
import { PollScope } from "~/shared/types";
import { timeAgo } from "~/utils/dateUtils";
import styles from "./debate-card.css?inline";
import { Avatar } from "~/components/ui";
import { Image } from "@unpic/qwik"
import { _ } from "compiled-i18n";
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
    scope: PollScope;
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
    scope
}) => {
    useStylesScoped$(styles);
    const nav = useNavigate();
    const onClickUsername = $((username: string) => nav(`/user/${username}`));

    const mainImage = images && images.length > 0 ? images[0] : undefined;

    return (
        <Link href={`/debates/${slug}`}>
            <li class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div class="p-5">
                    {/* Header with title and scope badge */}
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
                        {scope === PollScope.GLOBAL && 
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                🌎 {_`Global`}
                            </span>
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

                    {/* Creator information and dates */}
                    <div class="flex flex-wrap justify-between items-center mt-4 text-gray-500 dark:text-gray-400 text-xs">
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center" onClick$={() => onClickUsername(creator_username)}>
                                <Avatar.Root>
                                    <Avatar.Image
                                        src={creator_avatar}
                                        alt={creator_username}
                                    />
                                </Avatar.Root>
                                <span class="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer">
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
                            <LuMessageSquare class="w-4 h-4 mr-1" />
                            <span>{_`${comments_count} comments`}</span>
                            
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
                </div>
            </li>
        </Link>
    );
}); 