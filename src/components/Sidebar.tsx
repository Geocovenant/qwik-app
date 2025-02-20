import { component$, useSignal } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Collapsible } from '@qwik-ui/headless';
import { LuBuilding, LuChevronRight, LuGlobe, LuPanelLeftClose, LuPanelLeftOpen } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import { Button } from "flowbite-qwik";
import { Resource, useResource$ } from "@builder.io/qwik";

type Community = {
    id: string
    cca2?: string
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
const LuBuildingIcon = component$(() => <LuBuilding class="h-5 w-5" />)

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
        children: []
    },
    {
        id: "argentina",
        cca2: "AR",
        name: "Argentina",
        path: "/argentina",
        icon: "🇦🇷",
        children: []
    },
    {
        id: "uruguay",
        cca2: "UY",
        name: "Uruguay",
        path: "/uruguay",
        icon: "🇺🇾",
        children: []
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
    const isOpen = useSignal<boolean>(false);
    const hasChildren = community.children.length > 0;
    const location = useLocation();
    const pathname = location.url.pathname;
    const isActive = pathname.startsWith(community.path);
    
    // Determinamos si es un país basado en su posición en la estructura
    const isCountry = !community.path.includes('international') && community.id !== 'global';
    
    // El botón de expandir se muestra para international y países
    const shouldShowExpandButton = (hasChildren || isCountry) && 
        community.id !== 'global' && 
        community.id !== 'international';
    
    // Obtenemos el código del país del ID si es un país
    const countryCode = isCountry ? community.cca2?.toUpperCase() : null;

    const divisions = useResource$(async ({ track, cleanup }) => {
        track(() => isOpen.value);
        
        // Solo hacemos el request si es un país y está abierto
        if (!isOpen.value || !isCountry || !countryCode) return [];
        
        const controller = new AbortController();
        cleanup(() => controller.abort());
        
        try {
            const response = await fetch(
                `/api/v1/countries/${countryCode}/divisions`,
                {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error('Error al obtener las divisiones');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al cargar las divisiones:', error);
            return [];
        }
    });

    const itemClass = `
        flex items-center gap-2 px-3 py-2 rounded-lg
        ${isActive 
            ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
        }
        ${level > 0 ? `ml-${level * 4}` : ""}
        ${isCollapsed ? "justify-center" : ""}
        transition-colors duration-200
    `;

    if (hasChildren || isCountry) {
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
                        {!isCollapsed && shouldShowExpandButton && (
                            <Collapsible.Trigger 
                                class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 dark:bg-gray-900 rounded-md transition-colors duration-200"
                            >
                                <div class={`transition-transform duration-200 ${isOpen.value ? "rotate-90" : ""}`}>
                                    <LuChevronRight class="h-4 w-4" />
                                </div>
                            </Collapsible.Trigger>
                        )}
                    </div>
                    <Collapsible.Content>
                        {isCountry ? (
                            <Resource
                                value={divisions}
                                onPending={() => <div class="pl-4 py-2">Cargando...</div>}
                                onRejected={() => <div class="pl-4 py-2 text-red-500">Error al cargar divisiones</div>}
                                onResolved={(divisions) => (
                                    <>
                                        {divisions.map((division: any) => (
                                            <div key={division.id} class="pl-4">
                                                <CommunityItem 
                                                    community={{
                                                        id: division.id,
                                                        name: division.name,
                                                        path: `${community.path}/${division.slug}`,
                                                        icon: <LuBuildingIcon />,
                                                        children: []
                                                    }} 
                                                    level={level + 1} 
                                                    isCollapsed={isCollapsed} 
                                                />
                                            </div>
                                        ))}
                                    </>
                                )}
                            />
                        ) : (
                            community.children.map(child => (
                                <div key={child.id} class="pl-4">
                                    <CommunityItem community={child} level={level + 1} isCollapsed={isCollapsed} />
                                </div>
                            ))
                        )}
                    </Collapsible.Content>
                </div>
            </Collapsible.Root>
        );
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
        <aside class={`transition-all duration-300 ease-in-out ${isCollapsed.value ? "w-16" : "w-64"} border-r bg-gray-100 dark:bg-gray-900 h-screen flex flex-col`}>
            <div class={`p-4 border-b border-gray-200  dark:border-gray-700 flex items-center ${isCollapsed.value ? 'justify-center' : ''}`}>
                <button
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                    onClick$={() => isCollapsed.value = !isCollapsed.value}
                >
                    {isCollapsed.value ? <LuPanelLeftOpen class="h-5 w-5" /> : <LuPanelLeftClose class="h-5 w-5" />}
                </button>
                {!isCollapsed.value && (
                    <span class="ml-2 font-semibold text-lg text-gray-900 dark:text-white">Geounity</span>
                )}
            </div>

            <div class="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
                <div class="px-2 py-4">
                    {/* Global y International */}
                    <div class="space-y-2">
                        {communities.slice(0, 2).map(community => (
                            <CommunityItem key={community.id} community={community} isCollapsed={isCollapsed.value} />
                        ))}
                    </div>
                    
                    {/* Título Countries */}
                    {!isCollapsed.value && (
                        <div class="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mt-4 mb-2">
                            Countries
                        </div>
                    )}
                    
                    {/* Argentina y otros países */}
                    <div class="space-y-1">
                        {communities.slice(2).map(community => (
                            <CommunityItem key={community.id} community={community} isCollapsed={isCollapsed.value} />
                        ))}
                    </div>
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
                                        ? 'bg-gray-200 dark:bg-gray-700 font-medium text-gray-900 dark:text-white' 
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
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
