import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate, useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { LuEye, LuEyeOff, LuSettings, LuUserCheck, LuUsers } from "@qwikest/icons/lucide";
import { useSession } from "~/routes/plugin@auth";
import { Image } from "@unpic/qwik";
import { capitalizeFirst } from "~/utils/capitalizeFirst";

// Note: We need to create a specific loader for regional members
// Using the global loader with adaptations in the meantime
import { useGetGlobalMembers, useGetRegions } from "~/shared/loaders";
import { useUpdateCommunityVisibility } from "~/shared/actions";

export { useGetGlobalMembers, useGetRegions } from "~/shared/loaders";
export { useUpdateCommunityVisibility } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    
    const regions = useGetRegions();
    
    // Temporary: use global loader until we have a specific regional one
    const members = useGetGlobalMembers();
    const updateCommunityVisibilityAction = useUpdateCommunityVisibility();
    
    const defaultRegion = useComputed$(() => {
        const normalizedRegionName = regionName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        return regions.value.find((r: { name: string; }) => r.name === normalizedRegionName);
    });
    
    // Assume the regional community has ID 3 (adjust as necessary)
    const regionalCommunityId = defaultRegion.value?.id || 3;
    const isPublic = useSignal(members.value.items.find((m: any) => m.is_current_user)?.is_public || false);
    const currentPage = useSignal(1);
    const nav = useNavigate();
    const isAuthenticated = useComputed$(() => !!session.value?.user);
    const regionDisplayName = capitalizeFirst(regionName.replace(/-/g, ' '));

    // Toggle to change user visibility
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
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="flex flex-col min-h-0">
                <div class="h-full overflow-y-auto p-4">
                    <div class="mb-6">
                        <h1 class="text-2xl font-bold mb-2 flex items-center gap-2">
                            <LuUsers class="w-6 h-6 text-blue-600" />
                            {_`Members of ${regionDisplayName}`}
                        </h1>
                        <p class="text-gray-600">{_`Connect with others in your regional community.`}</p>
                    </div>

                    {/* User visibility toggle */}
                    {isAuthenticated.value && (
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                            <div class="flex items-start gap-3">
                                <div class="bg-blue-100 rounded-full p-2 mt-1">
                                    <LuSettings class="w-5 h-5 text-blue-700" />
                                </div>
                                <div>
                                    <h3 class="font-medium text-blue-900">{_`Your visibility in ${regionDisplayName}`}</h3>
                                    <p class="text-sm text-blue-700">
                                        {isPublic.value
                                            ? _`You're visible to everyone in the community`
                                            : _`You're only visible to community administrators`}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick$={togglePublicVisibility}
                                class={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                    isPublic.value
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {isPublic.value ? (
                                    <>
                                        <LuEye class="w-5 h-5" />
                                        {_`Visible`}
                                    </>
                                ) : (
                                    <>
                                        <LuEyeOff class="w-5 h-5" />
                                        {_`Hidden`}
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Members list */}
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {members.value?.items?.map((member: any) => (
                            <div key={member.id} class="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div class="p-4">
                                    <div class="flex items-center gap-3">
                                        <div class="relative">
                                            <Image
                                                src={member.avatar_url || 'https://via.placeholder.com/48'}
                                                width={48}
                                                height={48}
                                                alt={member.name}
                                                class="rounded-full object-cover"
                                            />
                                            {member.is_current_user && (
                                                <div class="absolute -top-1 -right-1 bg-blue-100 rounded-full p-0.5">
                                                    <LuUserCheck class="w-4 h-4 text-blue-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 class="font-medium">{member.name}</h3>
                                            <p class="text-sm text-gray-500">{_`Joined: ${new Date(member.joined_at).toLocaleDateString()}`}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {members.value?.pages > 1 && (
                        <div class="flex justify-center gap-4 mt-6">
                            <button
                                onClick$={async () => {
                                    if (currentPage.value > 1) {
                                        currentPage.value--;
                                        await nav(`/${nationName}/${regionName}/members?page=${currentPage.value}`);
                                    }
                                }}
                                disabled={currentPage.value === 1}
                                class={`px-3 py-1 rounded ${
                                    currentPage.value === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {_`Previous`}
                            </button>

                            <span class="text-sm text-gray-600">
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
                                class={`px-3 py-1 rounded ${
                                    currentPage.value === members.value.pages
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {_`Next`}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const regionName = capitalizeFirst(params.region.replace(/-/g, ' '));
    return {
        title: `${regionName} - Members`,
        meta: [
            {
                name: "description",
                content: `Members of the ${regionName} community`,
            },
        ],
    };
};
