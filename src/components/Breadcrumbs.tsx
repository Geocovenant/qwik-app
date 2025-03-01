import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { LuGlobe } from "@qwikest/icons/lucide";
import { Breadcrumb } from "~/components/ui";

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
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="/docs/styled/introduction/">Components</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
    );
});
