import { component$, Slot } from "@builder.io/qwik";
import { Breadcrumb } from "~/components/ui";
import { _ } from "compiled-i18n";
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
    const location = useLocation();
    const slug = location.params.slug;

    return (
        <div class="container mx-auto px-4 pt-1 pb-4">
            <div class="bg-white dark:bg-gray-900 shadow-sm mb-3">
                <div class="py-1 px-4">
                    <Breadcrumb.Root>
                        <Breadcrumb.List>
                            <Breadcrumb.Item>
                                <Breadcrumb.Link href="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {_`Debate`}
                                </Breadcrumb.Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Separator />
                            <Breadcrumb.Item>
                                <Breadcrumb.Link href={`/debates/${slug}`}>{slug}</Breadcrumb.Link>
                            </Breadcrumb.Item>
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                </div>
            </div>
            <div class="bg-white dark:bg-gray-900 shadow-sm">
                <Slot />
            </div>
        </div>
    );
});
