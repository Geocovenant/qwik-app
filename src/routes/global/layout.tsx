import { component$, Slot } from "@builder.io/qwik";
import { Breadcrumb } from "~/components/ui";
import { _ } from "compiled-i18n";
import { NavLink } from "~/components/NavLink";

export {
    useGetGlobalPolls, useGetGlobalDebates, useGetGlobalProjects,
    useFormReportLoader
} from "~/shared/loaders"
export { useFormReportAction } from "~/shared/actions"

export default component$(() => {
    const baseClass = "py-2 px-4 font-medium transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300";
    const activeClass = "!text-blue-600 font-semibold border-b-2 border-blue-600 dark:!text-blue-400 dark:border-blue-400";

    return (
        <div class="container mx-auto px-4 pt-1 pb-4">
            <div class="bg-white dark:bg-gray-900 shadow-sm mb-3">
                <div class="py-1 px-4">
                    <Breadcrumb.Root>
                        <Breadcrumb.List>
                            <Breadcrumb.Item>
                                <Breadcrumb.Link href="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {_`Global`}
                                </Breadcrumb.Link>
                            </Breadcrumb.Item>
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                </div>
                <div>
                    <nav class="flex border-b border-gray-200 dark:border-gray-700">
                        <NavLink
                            href="/global"
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Overview`}
                        </NavLink>
                        <NavLink
                            href="/global/polls"
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Polls`}
                        </NavLink>
                        <NavLink
                            href="/global/debates"
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Debates`}
                        </NavLink>
                        <NavLink
                            href="/global/projects"
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Projects`}
                        </NavLink>
                        <NavLink
                            href="/global/members"
                            class={baseClass}
                            activeClass={activeClass}
                        >
                            {_`Members`}
                        </NavLink>
                    </nav>
                </div>
            </div>
            <div class="bg-white dark:bg-gray-900 shadow-sm">
                <Slot />
            </div>
        </div>
    );
});
