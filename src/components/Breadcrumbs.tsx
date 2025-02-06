import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { LuGlobe } from "@qwikest/icons/lucide";
import { Breadcrumb } from "flowbite-qwik";

const LuGlobeIcon = component$(() => <LuGlobe />)

export default component$(() => {
    const location = useLocation()
    const pathname = location.url.pathname
    const communities = pathname.split("/").filter(Boolean)
    const breadcrumbs = communities.map((segment, index) => {
        const path = `/${communities.slice(0, index + 1).join("/")}`
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
        return { path, label }
    })
    return (
        <div class="h-12 flex items-center px-4 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Breadcrumb>
                {breadcrumbs.map((breadcrumb, index) => (
                    <div key={breadcrumb.path} class="flex items-center">
                        <Breadcrumb.Item
                            href={breadcrumb.path}
                            home={index === 0}
                            homeIcon={index === 0 ? LuGlobeIcon : undefined}
                        >
                            <span class={`ml-1 ${index === breadcrumbs.length - 1 ? "text-gray-900" : ""}`}>
                                {breadcrumb.label}
                            </span>
                        </Breadcrumb.Item>
                    </div>
                ))}
            </Breadcrumb>
        </div>
    );
});
