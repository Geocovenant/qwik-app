import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate, useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { LuEye, LuEyeOff, LuSettings, LuUserCheck, LuUsers } from "@qwikest/icons/lucide";
import { useSession } from "~/routes/plugin@auth";
import { Image } from "@unpic/qwik";
import { capitalizeFirst } from "~/utils/capitalizeFirst";

import { useGetRegion, useGetRegionalMembers } from "~/shared/regional/loaders";
import { useUpdateCommunityVisibility } from "~/shared/actions";

export { useUpdateCommunityVisibility } from "~/shared/actions";

export default component$(() => {
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const region = useGetRegion();
    const members = useGetRegionalMembers();
    
    const session = useSession();
    const updateCommunityVisibilityAction = useUpdateCommunityVisibility();
    const isPublic = useSignal(members.value.current_user?.is_public || false);
    const currentPage = useSignal(1);
    
    const regionalCommunityId = region.value.community_id;
    const nav = useNavigate();
    const isAuthenticated = useComputed$(() => !!session.value?.user);

    const togglePublicVisibility = $(async () => {
        if (!isAuthenticated.value) return;

        const newValue = !isPublic.value;
        isPublic.value = newValue;

        await updateCommunityVisibilityAction.submit({ 
            communityId: regionalCommunityId,
            isPublic: newValue 
        });
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-auto">
            <div class="flex flex-col min-h-0">
                <div class="h-full p-4 bg-gray-50 dark:bg-gray-800">
                    {/* Header updated for region */}
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white dark:bg-gray-900 p-4 rounded-lg shadow dark:shadow-gray-700">
                        <div class="flex items-center">
                            <LuUsers class="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                            <div>
                                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                                    {_`Members of ${region.value?.name || capitalizeFirst(regionName)} Region`}
                                </h1>
                                <p class="text-gray-600 dark:text-gray-400">
                                    {_`Connect with citizens in ${capitalizeFirst(nationName)}'s ${capitalizeFirst(regionName)} region.`}
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 sm:mt-0 flex items-center gap-2 pl-3">
                            <span class="text-lg font-semibold text-blue-700 dark:text-blue-400">
                                {members.value.total_public + members.value.total_anonymous} {_`members`}
                            </span>
                        </div>
                    </div>

                    {/* Rest of the component remains similar with regional context */}
                    {isAuthenticated.value && (
                        <div class="mb-6 bg-white dark:bg-gray-900 p-4 rounded-lg shadow dark:shadow-gray-700">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <LuSettings class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{_`Privacy Settings`}</h2>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">
                                        {isPublic.value ? _`Visible to everyone` : _`Profile hidden`}
                                    </span>
                                    <button
                                        onClick$={togglePublicVisibility}
                                        class={`w-14 h-7 rounded-full flex items-center px-1 transition-colors ${isPublic.value ? "bg-blue-600 justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"}`}
                                        aria-label={
                                            isPublic.value
                                                ? _`Change to hidden profile`
                                                : _`Change to visible profile`
                                        }
                                    >
                                        <div class="w-5 h-5 bg-white rounded-full shadow-md"></div>
                                    </button>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-8">
                                {isPublic.value
                                    ? _`Your profile is visible to all regional community members.`
                                    : _`Your profile is hidden. Only you can see it in this regional list.`}
                            </p>
                        </div>
                    )}

                    <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-700">
                        <div class="border-b border-gray-200 dark:border-gray-700 p-4">
                            <div class="flex items-center gap-2">
                                <LuUserCheck class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{_`Visible Members`}</h2>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-7">
                                {_`Discover active members in the ${capitalizeFirst(regionName)} region.`}
                            </p>
                        </div>

                        {/* Members list and pagination same structure */}
                        {members.value.items.length > 0 ? (
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                                {members.value.items.map((member: any) => (
                                    <div key={member.id} class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <div class="relative">
                                            <Image
                                                src={member.image || "/images/default-avatar.png"}
                                                alt={member.username || "User"}
                                                width={48}
                                                height={48}
                                                class="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                                            />
                                            {member.is_current_user && (
                                                <div class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                            )}
                                        </div>
                                        <div class="flex-1 overflow-hidden">
                                            <h3 class="font-medium truncate text-gray-900 dark:text-white">{member.name || member.username || _`Anonymous User`}</h3>
                                            {member.username && (
                                                <p class="text-sm text-gray-600 dark:text-gray-400 truncate">@{member.username}</p>
                                            )}
                                        </div>
                                        {!member.is_current_user && isAuthenticated.value && (
                                            <button
                                                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                aria-label={_`View profile of ${member.username}`}
                                                onClick$={() => nav(`/user/${member.username}`)}
                                            >
                                                <LuEye class="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div class="flex flex-col items-center justify-center p-8 text-center">
                                <LuEyeOff class="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
                                <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">{_`No visible members`}</h3>
                                <p class="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                                    {isAuthenticated.value
                                        ? _`Be the first to make your profile visible in ${capitalizeFirst(regionName)} region.`
                                        : _`Regional members have chosen to keep their profiles private.`}
                                </p>
                            </div>
                        )}

                        {members.value.total_anonymous > 0 && (
                            <div class="flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-700">
                                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <LuEyeOff class="w-4 h-4" />
                                    <span>{members.value.total_anonymous} anonymous members</span>
                                </div>
                            </div>
                        )}

                        {members.value.pages > 1 && (
                            <div class="flex justify-center items-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick$={async () => {
                                        if (currentPage.value > 1) {
                                            currentPage.value--;
                                            await nav(`/${nationName}/${regionName}/members?page=${currentPage.value}`);
                                        }
                                    }}
                                    disabled={currentPage.value === 1}
                                    class={`px-3 py-1 rounded ${currentPage.value === 1
                                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                            : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                                        }`}
                                >
                                    {_`Previous`}
                                </button>

                                <span class="text-sm text-gray-600 dark:text-gray-400">
                                    {_`Page ${currentPage.value} of ${members.value.pages}`}
                                </span>

                                <button
                                    onClick$={async () => {
                                        if (currentPage.value < members.value.pages) {
                                            currentPage.value++;
                                            await nav(`/${nationName}/${regionName}/members?page=${currentPage.value}`);
                                        }
                                    }}
                                    disabled={currentPage.value === members.value.pages}
                                    class={`px-3 py-1 rounded ${currentPage.value === members.value.pages
                                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                            : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                                        }`}
                                >
                                    {_`Next`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const regionName = capitalizeFirst(params.region || "");
    const nationName = capitalizeFirst(params.nation || "");
    return {
        title: _`${regionName}, ${nationName} - Members`,
        meta: [
            {
                name: "description",
                content: _`Members of the regional community in ${regionName}, ${nationName}`,
            },
        ],
    };
};
