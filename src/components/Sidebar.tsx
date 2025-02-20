import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
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
    divisionType?: string
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
    const location = useLocation();
    const pathname = location.url.pathname;
    const isActive = pathname.startsWith(community.path);
    
    // Determinamos si puede tener subdivisiones
    const canHaveSubdivisions = community.id !== 'global' && 
                               community.id !== 'international';

    const divisions = useResource$(async ({ track, cleanup }) => {
        track(() => isOpen.value);
        
        // Solo hacemos el request si puede tener subdivisiones y está abierto
        if (!isOpen.value || !canHaveSubdivisions) return [];
        
        const controller = new AbortController();
        cleanup(() => controller.abort());
        
        try {
            // Si es un país (tiene cca2), usamos la ruta de países
            // Si no, usamos la ruta de subnations
            const url = community.cca2 
                ? `/api/v1/countries/${community.cca2}/divisions`
                : `/api/v1/subnations/${community.id}/divisions`;
            
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(_`Error loading divisions`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(_`Error loading divisions:`, error);
            return [];
        }
    });

    const indentClass = level > 0 ? `ml-${Math.min(level * 4, 12)}` : "";
    
    const itemClass = `
        flex items-center gap-2 px-3 py-1.5 rounded-lg
        ${isActive 
            ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground font-medium border-l-2 border-primary" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary-foreground"
        }
        ${indentClass}
        ${isCollapsed ? "justify-center" : ""}
        transition-all duration-200 ease-in-out
    `;

    // Añadir indicador visual de nivel
    const levelIndicator = !isCollapsed && level > 0 ? (
        <div 
            class="absolute left-0 h-full w-px bg-gray-300 dark:bg-gray-600"
            style={{ left: `${level * 12}px` }}
        />
    ) : null;

    if (canHaveSubdivisions) {
        return (
            <Collapsible.Root bind:open={isOpen}>
                <div class="relative">
                    {levelIndicator}
                    <div 
                        class={`
                            sticky bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm
                            ${level === 0 ? 'top-0' : `top-${level * 8}`}
                        `} 
                        style={{ 
                            zIndex: 30 - level,
                            boxShadow: isOpen.value ? '0 1px 2px 0 rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        <div class="flex items-center group">
                            <Link
                                href={community.path}
                                class={`flex flex-1 items-center gap-2 ${itemClass}`}
                            >
                                <div class="h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110">
                                    {community.icon}
                                </div>
                                {!isCollapsed && (
                                    <span class="font-medium">{community.name}</span>
                                )}
                            </Link>
                            {!isCollapsed && canHaveSubdivisions && (
                                <Collapsible.Trigger 
                                    class="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 
                                           hover:text-primary dark:hover:text-primary-foreground rounded-md 
                                           transition-all duration-200 ease-in-out"
                                >
                                    <div class={`transition-transform duration-200 ${isOpen.value ? "rotate-90" : ""}`}>
                                        <LuChevronRight class="h-3.5 w-3.5" />
                                    </div>
                                </Collapsible.Trigger>
                            )}
                        </div>
                        {isOpen.value && (
                            <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                        )}
                    </div>

                    <Collapsible.Content>
                        <div class="relative pl-4 py-0.5">
                            <Resource
                                value={divisions}
                                onPending={() => (
                                    <div class="py-1.5 px-3 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                                        {_`Loading...`}
                                    </div>
                                )}
                                onRejected={() => (
                                    <div class="py-1.5 px-3 text-sm text-red-500 dark:text-red-400">
                                        {_`Error loading divisions`}
                                    </div>
                                )}
                                onResolved={(divisions) => (
                                    <div class="space-y-0.5">
                                        {divisions.map((division: any) => {
                                            const slug = division.name
                                                .toLowerCase()
                                                .normalize("NFD")
                                                .replace(/[\u0300-\u036f]/g, "")
                                                .replace(/\s+/g, '-')
                                                .replace(/[^a-z0-9-]/g, '');
                                            
                                            return (
                                                <CommunityItem 
                                                    key={division.id}
                                                    community={{
                                                        id: division.id,
                                                        name: division.name,
                                                        path: `${community.path}/${slug}`,
                                                        icon: <LuBuildingIcon />,
                                                        children: [],
                                                        divisionType: division.type
                                                    }} 
                                                    level={level + 1} 
                                                    isCollapsed={isCollapsed} 
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            />
                        </div>
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
    const sidebarWidth = useSignal<number>(256); // 256px = 16rem (w-64 inicial)
    const isDragging = useSignal<boolean>(false);

    // Añadir límites de ancho
    const MIN_WIDTH = 64; // 4rem - cuando está colapsado
    const MAX_WIDTH = 384; // 24rem - ancho máximo

    // Sincronizar el colapso con el ancho
    const toggleCollapse = $(() => {
        isCollapsed.value = !isCollapsed.value;
        sidebarWidth.value = isCollapsed.value ? MIN_WIDTH : 256; // Volver al ancho por defecto cuando se expande
    });

    useVisibleTask$(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.value) return;
            
            const newWidth = e.clientX;
            // Actualizar isCollapsed basado en el ancho
            if (newWidth <= MIN_WIDTH + 20) { // Un poco de margen para el colapso
                isCollapsed.value = true;
                sidebarWidth.value = MIN_WIDTH;
            } else {
                isCollapsed.value = false;
                sidebarWidth.value = Math.min(newWidth, MAX_WIDTH);
            }
        };

        const handleMouseUp = () => {
            isDragging.value = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';

            // Asegurar que el sidebar se ajuste al ancho mínimo si está cerca
            if (sidebarWidth.value < MIN_WIDTH + 20) {
                sidebarWidth.value = MIN_WIDTH;
                isCollapsed.value = true;
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    });

    const location = useLocation();
    const currentPath = location.url.pathname;
    
    return (
        <aside 
            class="relative flex flex-col border-r bg-gray-100 dark:bg-gray-900 h-screen transition-all duration-300 ease-in-out"
            style={{ width: `${sidebarWidth.value}px` }}
        >
            <div class="sticky top-0 z-20 bg-gray-100 dark:bg-gray-900">
                <div class={`p-4 border-b border-gray-200 dark:border-gray-700 flex items-center ${isCollapsed.value ? 'justify-center' : ''}`}>
                    <button
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                        onClick$={toggleCollapse}
                    >
                        {isCollapsed.value ? <LuPanelLeftOpen class="h-5 w-5" /> : <LuPanelLeftClose class="h-5 w-5" />}
                    </button>
                    {!isCollapsed.value && (
                        <span class="ml-2 font-semibold text-lg text-gray-900 dark:text-white">Geounity</span>
                    )}
                </div>
            </div>

            <div class="flex-1 overflow-y-auto">
                <div class="px-2 py-4">
                    <div class="space-y-2">
                        {communities.slice(0, 2).map(community => (
                            <CommunityItem key={community.id} community={community} isCollapsed={isCollapsed.value} />
                        ))}
                    </div>
                    
                    {!isCollapsed.value && (
                        <div class="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mt-4 mb-2">
                            {_`Countries`}
                        </div>
                    )}
                    
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

            <div
                class="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40"
                onMouseDown$={() => {
                    isDragging.value = true;
                    document.body.style.cursor = 'col-resize';
                    document.body.style.userSelect = 'none';
                }}
            />
        </aside>
    );
});
