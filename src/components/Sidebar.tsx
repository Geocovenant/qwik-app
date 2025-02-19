import { component$, useSignal } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Collapsible } from '@qwik-ui/headless';
import { LuBuilding, LuBuilding2, LuChevronRight, LuFlag, LuGlobe, LuPanelLeftClose, LuPanelLeftOpen } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import { Button } from "flowbite-qwik";

type Community = {
    id: string
    name: string
    path: string
    icon: any
    children: Community[]
}

type TabItem = {
    id: string;
    name: string;
    path: string;
}

const LuGlobeIcon = component$(() => <LuGlobe class="h-5 w-5" />)
const LuFlagIcon = component$(() => <LuFlag class="h-5 w-5" />)
const LuBuildingIcon = component$(() => <LuBuilding class="h-5 w-5" />)
const LuBuilding2Icon = component$(() => <LuBuilding2 class="h-5 w-5" />)

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
        icon: <LuGlobeIcon />,
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
        icon: "🇦🇷",
        children: [
            {
                id: "buenos-aires",
                name: "Buenos Aires",
                path: "/argentina/buenos-aires",
                icon: <LuFlagIcon />,
                children: [
                    {
                        id: "general-alvarado",
                        name: "General Alvarado",
                        path: "/argentina/buenos-aires/general-alvarado",
                        icon: <LuBuildingIcon />,
                        children: [
                            {
                                id: "miramar",
                                name: "Miramar",
                                path: "/argentina/buenos-aires/general-alvarado/miramar",
                                icon: <LuBuilding2Icon />,
                                children: []
                            }
                        ]
                    },
                    {
                        id: "general-pueyrredon",
                        name: "General Pueyrredón",
                        path: "/argentina/buenos-aires/general-pueyrredon",
                        icon: <LuBuildingIcon />,
                        children: [
                            {
                                id: "mar-del-plata",
                                name: "Mar del Plata",
                                path: "/argentina/buenos-aires/general-pueyrredon/mar-del-plata",
                                icon: <LuBuilding2Icon />,
                                children: []
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

const tabs: TabItem[] = [
    { id: 'polls', name: 'Polls', path: '/polls' },
    { id: 'debates', name: 'Debates', path: '/debates' },
    { id: 'projects', name: 'Projects', path: '/projects' },
    { id: 'issues', name: 'Issues', path: '/issues' },
    { id: 'members', name: 'Members', path: '/members' },
]

const CommunityItem = component$(({ community, level = 0, isCollapsed}: {community: Community, level?: number, isCollapsed: boolean}) => {
    const isOpen = useSignal<boolean>(false)
    const hasChildren = community.children.length > 0
    const location = useLocation()
    const pathname = location.url.pathname
    const isActive = pathname.startsWith(community.path)

    const itemClass = `
        flex items-center gap-2 px-3 py-2 rounded-lg
        ${isActive ? "bg-gray-200 dark:bg-gray-700 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
        ${level > 0 ? `ml-${level * 4}` : ""}
        ${isCollapsed ? "justify-center" : ""}
        transition-colors duration-200
    `

    if(hasChildren) {
        return (
            <Collapsible.Root bind:open={isOpen}>
                <div class="relative">
                    <div class={`flex items-center ${isCollapsed ? "justify-center" : ""}`}>
                        <Link
                            href={community.path}
                            class={`flex flex-1 items-center gap-2 ${itemClass}`}
                        >
                            <div class="h-5 w-5 flex-shrink-0">{community.icon}</div>
                            {!isCollapsed && <span>{community.name}</span>}
                        </Link>
                        {!isCollapsed && hasChildren && (
                            <Collapsible.Trigger class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
                                <div class={`transition-transform duration-200 ${isOpen.value ? "rotate-90" : ""}`}>
                                    <LuChevronRight class="h-4 w-4" />
                                </div>
                            </Collapsible.Trigger>
                        )}
                    </div>
                    <Collapsible.Content>
                        {community.children.map(child => (
                            <div key={child.id} class="pl-4">
                                <CommunityItem community={child} level={level + 1} isCollapsed={isCollapsed} />
                            </div>
                        ))}
                    </Collapsible.Content>
                </div>
            </Collapsible.Root>
        )
    }

    return (
        <Link href={community.path}>
            <div class={itemClass}>
                <div class="h-5 w-5 flex-shrink-0">
                    {community.icon}
                </div>
                {!isCollapsed && <span>{community.name}</span>}
            </div>
        </Link>
    )
})

export default component$(() => {
    const isCollapsed = useSignal<boolean>(false);
    const location = useLocation();
    const currentPath = location.url.pathname;
    
    return (
        <aside class={`transition-all duration-300 ease-in-out ${isCollapsed.value ? "w-16" : "w-64"} border-r border-border bg-background h-screen flex flex-col`}>
            <div class="p-4 border-b border-border flex items-center">
                <button
                    class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick$={() => isCollapsed.value = !isCollapsed.value}
                >
                    {isCollapsed.value ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
                </button>
                {!isCollapsed.value && (
                    <span class="ml-2 font-semibold text-lg">Geounity</span>
                )}
            </div>

            <div class="flex-1 overflow-y-auto">
                <div class="px-2 py-4">
                    {communities.map(community => (
                        <CommunityItem key={community.id} community={community} isCollapsed={isCollapsed.value} />
                    ))}
                </div>
            </div>

            {!isCollapsed.value && currentPath.includes('/global') && (
                <div class="border-t border-border">
                    <nav class="flex flex-col p-2">
                        {tabs.map((tab) => (
                            <Link 
                                key={tab.id}
                                href={`/global${tab.path}`}
                                class={`px-4 py-2 rounded-md transition-colors ${
                                    currentPath.includes(tab.path) 
                                        ? 'bg-gray-200 dark:bg-gray-700 font-medium' 
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                {tab.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            <div class={`transition-all duration-300 ease-in-out mt-auto ${isCollapsed.value ? "p-2" : "p-4"} border-t border-border`}>
                <Button 
                    class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg"
                >
                    {isCollapsed.value ? "+" : _`+ New community`}
                </Button>
            </div>
        </aside>
    );
});
