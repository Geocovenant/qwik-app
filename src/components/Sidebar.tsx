import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Collapsible } from '@qwik-ui/headless';
import { LuChevronRight } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import { Button } from "flowbite-qwik";

type Community = {
    id: string
    name: string
    path: string
    icon: any
    children: Community[]
}

const communities: Community[] = [
    {
        id: "global",
        name: "Global",
        path: "/global",
        icon: "🌎",
        children: []
    },
    {
        id: "international",
        name: "International",
        path: "/international",
        icon: "🌎",
        children: [
            {
                id: "europe",
                name: "Europe",
                path: "/international/europe",
                icon: "🌎",
                children: []
            },
            {
                id: "asia",
                name: "Asia",
                path: "/international/asia",
                icon: "🌏",
                children: []
            },
            {
                id: "africa",
                name: "Africa",
                path: "/international/africa", 
                icon: "🌍",
                children: []
            },
            {
                id: "oceania",
                name: "Oceania",
                path: "/international/oceania",
                icon: "🌏",
                children: []
            },
            {
                id: "americas",
                name: "Americas",
                path: "/international/americas",
                icon: "🌎",
                children: [
                    {
                        id: "north-america",
                        name: "North America",
                        path: "/international/americas/north-america",
                        icon: "🌎",
                        children: []
                    },
                    {
                        id: "south-america", 
                        name: "South America",
                        path: "/international/americas/south-america",
                        icon: "🌎",
                        children: []
                    }
                ]
            }
        ]
    },
    {
        id: "argentina",
        name: "Argentina",
        path: "/argentina",
        icon: "🌎",
        children: [
            {
                id: "buenos-aires",
                name: "Buenos Aires",
                path: "/argentina/buenos-aires",
                icon: "🌎",
                children: [
                    {
                        id: "general-alvarado",
                        name: "General Alvarado",
                        path: "/argentina/buenos-aires/general-alvarado",
                        icon: "🌎",
                        children: [
                            {
                                id: "miramar",
                                name: "Miramar",
                                path: "/argentina/buenos-aires/general-alvarado/miramar",
                                icon: "🌎",
                                children: []
                            }
                        ]
                    },
                    {
                        id: "general-pueyrredon",
                        name: "General Pueyrredón",
                        path: "/argentina/buenos-aires/general-pueyrredon",
                        icon: "🌎",
                        children: [
                            {
                                id: "mar-del-plata",
                                name: "Mar del Plata",
                                path: "/argentina/buenos-aires/general-pueyrredon/mar-del-plata",
                                icon: "🌎",
                                children: []
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

const CommunityItem = component$(({ community, level = 0}: {community: Community, level?: number}) => {
    const isOpen = useSignal<boolean>(false)
    const hasChildren = community.children.length > 0
    if(hasChildren) {
        return (
            <Collapsible.Root bind:open={isOpen}>
                <div class="relative">
                    <div class="flex items-center">
                        <Link
                            href={community.path}
                            class="flex flex-1 items-center px-3 py-2"
                        >
                            <span>{community.icon}</span>
                            <span>{community.name}</span>
                        </Link>
                        <Collapsible.Trigger>
                            <div class={`transition-transform duration-200 ${isOpen.value ? "rotate-90" : ""}`}>
                                <LuChevronRight />
                            </div>
                        </Collapsible.Trigger>
                    </div>
                        <Collapsible.Content>
                            {community.children.map(child => (
                                <div key={child.id} class="pl-4">
                                    <CommunityItem community={child} level={level + 1} />
                                </div>
                            ))}
                        </Collapsible.Content>
                </div>
            </Collapsible.Root>
        )
    }
    return (
        <Link href={community.path}>
            <div class={`flex items-center px-3 py-2 text-sm rounded-md ${level > 0 ? `ml-${level * 4}` : ""}`}>
                <div class="h-5 w-5 mr-3">
                    {community.icon}
                </div>
                <span>{community.name}</span>
            </div>
        </Link>
    )
})

export default component$(() => {
    return (
        <aside class="w-64 border-r border-r-gray-700 bg-gray-80 h-screen flex flex-col">
            <div class="flex-1 overflow-y-auto">
                <div class="px-2 py-4">
                    {communities.map(community => (
                        <CommunityItem key={community.id} community={community} />
                    ))}
                </div>
            </div>
            <div class="p-4 border-t border-gray-700">
                <Button class="bg-emerald-500 hover:bg-emerald-600 text-white">
                    {_`+ New community`}
                </Button>
            </div>
        </aside>
    );
});
