import { component$, Slot, useComputed$ } from "@builder.io/qwik";
import { Breadcrumb } from "~/components/ui";
import { NavLink } from "~/components/NavLink";
import { useLocation } from "@builder.io/qwik-city";
import { capitalizeFirst } from "~/utils/capitalizeFirst";
import { Button } from "~/components/ui";
import { useSession } from "~/routes/plugin@auth";
import { LuUserPlus, LuUserMinus } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";

import { useGetUser } from "~/shared/loaders";
import { useGetLocality } from "~/shared/local/loaders";
import { useJoinCommunity, useLeaveCommunity } from "~/shared/actions";

export { useGetLocalities } from "~/shared/subregional/loaders";
export { useGetLocality, useGetLocalPolls, useGetLocalDebates, useGetLocalProjects, useGetLocalIssues, useGetLocalMembers } from "~/shared/local/loaders";

export default component$(() => {
    const location = useLocation();
    const nationParam = location.params.nation;
    const regionParam = location.params.region;
    const subregionParam = location.params.subregion;
    const localityParam = location.params.locality;
    
    const user = useGetUser();
    const session = useSession();
    const locality = useGetLocality();
    
    const joinCommunityAction = useJoinCommunity();
    const leaveCommunityAction = useLeaveCommunity();

    const isMember = useComputed$(() => {
        return user.value.communities?.some(
            (community: any) => community.id === locality.value.id
        );
    });

    const baseClass = "py-2 px-4 font-medium transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300";
    const activeClass = "!text-blue-600 font-semibold border-b-2 border-blue-600 dark:!text-blue-400 dark:border-blue-400";

    return (
        <div class="container mx-auto px-4 pt-1 pb-4">
            <div class="bg-white dark:bg-gray-900 shadow-sm mb-3 rounded-lg">
                <div class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-1 px-2">
                    <div class="flex justify-between items-center flex-wrap gap-2">
                        <Breadcrumb.Root>
                            <Breadcrumb.List class="text-lg">
                                <Breadcrumb.Item>
                                    <Breadcrumb.Link href="/global" class="dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">{_`Global`}</Breadcrumb.Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Separator class="dark:text-gray-500" />
                                <Breadcrumb.Item>
                                    <Breadcrumb.Link href={`/${nationParam}`} class="dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">{capitalizeFirst(nationParam)}</Breadcrumb.Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Separator class="dark:text-gray-500" />
                                <Breadcrumb.Item>
                                    <Breadcrumb.Link href={`/${nationParam}/${regionParam}`} class="dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">{capitalizeFirst(regionParam?.replace(/-/g, ' '))}</Breadcrumb.Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Separator class="dark:text-gray-500" />
                                <Breadcrumb.Item>
                                    <Breadcrumb.Link href={`/${nationParam}/${regionParam}/${subregionParam}`} class="dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">{capitalizeFirst(subregionParam.replace(/-/g, ' '))}</Breadcrumb.Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Separator class="dark:text-gray-500" />
                                <Breadcrumb.Item>
                                    <Breadcrumb.Link href={`/${nationParam}/${regionParam}/${subregionParam}/${localityParam}`} class="dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">{capitalizeFirst(localityParam.replace(/-/g, ' '))}</Breadcrumb.Link>
                                </Breadcrumb.Item>
                            </Breadcrumb.List>
                        </Breadcrumb.Root>
                        
                        {session.value && (
                            <Button
                                class={`flex items-center gap-2 font-medium py-1.5 px-3 rounded-lg transition-colors text-sm ${
                                    isMember.value 
                                        ? 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white' 
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                                onClick$={() => {
                                    if (isMember.value) {
                                        leaveCommunityAction.submit({
                                            communityId: locality.value.id
                                        });
                                    } else {
                                        joinCommunityAction.submit({
                                            communityId: locality.value.id
                                        });
                                    }
                                }}
                            >
                                {isMember.value ? (
                                    <>
                                        <LuUserMinus class="w-4 h-4" />
                                        <span class="hidden sm:inline">{_`Leave Community`}</span>
                                        <span class="sm:hidden">{_`Leave`}</span>
                                    </>
                                ) : (
                                    <>
                                        <LuUserPlus class="w-4 h-4" />
                                        <span class="hidden sm:inline">{_`Join Community`}</span>
                                        <span class="sm:hidden">{_`Join`}</span>
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
                <div>
                    <nav class="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <NavLink
                            href={`/${nationParam}/${regionParam}/${subregionParam}/${localityParam}`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Overview`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/${regionParam}/${subregionParam}/${localityParam}/polls`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Polls`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/${regionParam}/${subregionParam}/${localityParam}/projects`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Projects`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/${regionParam}/${subregionParam}/${localityParam}/issues`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Issues`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/${regionParam}/${subregionParam}/${localityParam}/members`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Members`}
                        </NavLink>
                    </nav>
                </div>
            </div>
            <div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg">
                <Slot />
            </div>
        </div>
    );
});
