import { component$, Slot } from "@builder.io/qwik";
import { Breadcrumb } from "~/components/ui";
import { NavLink } from "~/components/NavLink";
import { useLocation } from "@builder.io/qwik-city";
import { capitalizeFirst } from "~/utils/capitalizeFirst";
import { _ } from "compiled-i18n";

export { useGetSubregions } from "~/shared/regional/loaders"
export { useGetSubregion, useGetSubregionalPolls, useGetSubregionalDebates, useGetSubregionalProjects, useGetSubregionalIssues, useGetSubregionalMembers } from "~/shared/subregional/loaders"

export default component$(() => {
    const location = useLocation();
    const nationParam = location.params.nation;
    const regionParam = location.params.region;
    const subregionParam = location.params.subregion;
    const localityParam = location.params.locality;

    const baseClass = "py-2 px-4 font-medium transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300";
    const activeClass = "!text-blue-600 font-semibold border-b-2 border-blue-600 dark:!text-blue-400 dark:border-blue-400";

    // If we are in a locality view, we only render the Slot without the subregional-specific navigation
    if (localityParam) {
        return (
            <div class="container mx-auto px-4 pt-1 pb-4">
                <Slot />
            </div>
        );
    }

    return (
        <div class="container mx-auto px-4 pt-1 pb-4">
            <div class="bg-white dark:bg-gray-900 shadow-sm mb-3 rounded-lg">
                <div class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-1 px-2">
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
                                <Breadcrumb.Link href={`/${nationParam}/${regionParam}`} class="dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">{capitalizeFirst(regionParam.replace(/-/g, ' '))}</Breadcrumb.Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Separator class="dark:text-gray-500" />
                            <Breadcrumb.Item>
                                <Breadcrumb.Link href={`/${nationParam}/${regionParam}/${subregionParam}`} class="dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">{capitalizeFirst(subregionParam.replace(/-/g, ' '))}</Breadcrumb.Link>
                            </Breadcrumb.Item>
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                </div>
                <div>
                    <nav class="flex border-b border-gray-200 dark:border-gray-700">
                        <NavLink
                            href={`/${nationParam}/${regionParam}/${subregionParam}`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Overview`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/${regionParam}/${subregionParam}/polls`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Polls`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/${regionParam}/${subregionParam}/debates`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Debates`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/${regionParam}/${subregionParam}/issues`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Issues`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/${regionParam}/${subregionParam}/projects`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Projects`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/${regionParam}/${subregionParam}/members`}
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
