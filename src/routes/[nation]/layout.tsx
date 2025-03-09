import { component$, Slot } from "@builder.io/qwik";
import { Breadcrumb } from "~/components/ui";
import { _ } from "compiled-i18n";
import { NavLink } from "~/components/NavLink";
import { useLocation } from "@builder.io/qwik-city";
import { capitalizeFirst } from "~/utils/capitalizeFirst";

export default component$(() => {
    const location = useLocation();
    const nationParam = location.params.nation;
    const regionParam = location.params.region;

    const baseClass = "py-2 px-4 font-medium transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300";
    const activeClass = "!text-blue-600 font-semibold border-b-2 border-blue-600 dark:!text-blue-400 dark:border-blue-400";

    // If we are in a region view or lower levels, we only render the slot without the nation-specific navigation
    if (regionParam) {
        return (
            <div class="container mx-auto px-4 pt-1 pb-4">
                <Slot />
            </div>
        );
    }

    // If we are directly in the nation view (without region), we show the full navigation
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
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                </div>
                <div>
                    <nav class="flex border-b border-gray-200 dark:border-gray-700">
                        <NavLink
                            href={`/${nationParam}`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Overview`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/polls`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Polls`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/debates`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Debates`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/issues`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Issues`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/projects`}
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Projects`}
                        </NavLink>
                        <NavLink
                            href={`/${nationParam}/members`}
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
