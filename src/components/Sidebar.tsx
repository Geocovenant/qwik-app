import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Collapsible } from '@qwik-ui/headless';
import { LuBuilding, LuChevronRight, LuGlobe, LuPanelLeftClose, LuPanelLeftOpen, LuPlusCircle } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import { Resource, useResource$ } from "@builder.io/qwik";
import { ThemeSwitch } from "./theme-switch/ThemeSwitch";
import { dataArray } from "../data/countries"; // Importamos el array de países

type Community = {
    id: string
    cca2?: string
    name: string
    path: string
    icon: any
    children: Community[]
    divisionType?: string
}

const LuGlobeIcon = component$(() => <LuGlobe class="h-5 w-5" />)
const LuBuildingIcon = component$(() => <LuBuilding class="h-5 w-5" />)

// Creamos las comunidades base (Global e International)
const baseCommunities: Community[] = [
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
    }
];

// Convertimos los países del dataArray a comunidades
const countryCommunities: Community[] = dataArray.map(country => ({
    id: country.cca2.toLowerCase(),
    cca2: country.cca2,
    name: country.name,
    path: country.path, // Usamos el path definido en countries.ts
    icon: country.flag,
    children: []
}));

// Combinamos las comunidades base con las de países
const communities: Community[] = [
    ...baseCommunities,
    ...countryCommunities
];

const CommunityItem = component$(({ community, level = 0, isCollapsed}: {community: Community, level?: number, isCollapsed: boolean}) => {
    const isOpen = useSignal<boolean>(false);
    const location = useLocation();
    const pathname = location.url.pathname;
    const isActive = pathname.startsWith(community.path);
    
    // Determinamos si puede tener subdivisiones
    const canHaveSubdivisions = community.id !== 'global' && community.id !== 'international';

    const divisions = useResource$(async ({ track, cleanup }) => {
        track(() => isOpen.value);
        
        // Solo hacemos el request si puede tener subdivisiones y está abierto
        if (!isOpen.value || !canHaveSubdivisions) return [];
        
        const controller = new AbortController();
        cleanup(() => controller.abort());
        
        try {
            // Si es un país (tiene cca2), usamos la ruta de países
            // Si no, usamos la ruta de regions
            const url = community.cca2 
                ? `/api/v1/countries/${community.cca2}/divisions`
                : `/api/v1/regions/${community.id}/subregions`;
            
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
            ? "bg-primary/20 dark:bg-primary/20 text-primary dark:text-primary-foreground font-medium border-l-2 border-primary shadow-sm" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary-foreground"
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

    // Determinamos si es una nación (tiene cca2 pero no es una subdivisión)
    const isNation = community.cca2 && !community.divisionType;
    
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
                                href={`${community.path}${isNation ? '?scope=national' : ''}`}
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
    const sidebarWidth = useSignal<number>(256);
    const isDragging = useSignal<boolean>(false);
    const showNewCommunityModal = useSignal<boolean>(false);
    const searchQuery = useSignal<string>('');

    const MIN_WIDTH = 64;
    const MAX_WIDTH = 384;

    // Manejar el resize del sidebar
    useTask$(({ track, cleanup }) => {
        track(() => isDragging.value);
        
        if (typeof window === 'undefined') return;

        const handleMouseMove = $((e: MouseEvent) => {
            if (!isDragging.value) return;
            
            const newWidth = Math.max(MIN_WIDTH, Math.min(e.clientX, MAX_WIDTH));
            sidebarWidth.value = newWidth;
            isCollapsed.value = newWidth <= MIN_WIDTH + 20;
        });

        const handleMouseUp = $(() => {
            if (!isDragging.value) return;
            
            isDragging.value = false;
            if (typeof document !== 'undefined') {
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
            }

            if (sidebarWidth.value < MIN_WIDTH + 20) {
                sidebarWidth.value = MIN_WIDTH;
                isCollapsed.value = true;
            }
        });

        if (isDragging.value && typeof document !== 'undefined') {
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            cleanup(() => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            });
        }
    });

    // Manejar el colapso del sidebar
    const toggleCollapse = $(() => {
        const newCollapsed = !isCollapsed.value;
        isCollapsed.value = newCollapsed;
        sidebarWidth.value = newCollapsed ? MIN_WIDTH : 256;
    });

    const location = useLocation();
    const currentPath = location.url.pathname;
    
    // Filtramos los países según la búsqueda
    const filteredCountries = !searchQuery.value 
        ? countryCommunities // Mostramos todos los países siempre
        : countryCommunities.filter(country => 
            country.name.toLowerCase().includes(searchQuery.value.toLowerCase())
          );

    return (
        <div class="flex h-full">
            <div 
                class="flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 relative"
                style={{ width: `${sidebarWidth.value}px` }}
            >
                <div class="sticky top-0 z-20 bg-gray-100 dark:bg-gray-900">
                    <div class={`p-4 border-b border-gray-200 dark:border-gray-700 flex items-center ${isCollapsed.value ? 'justify-center' : ''}`}>
                        <button
                            onClick$={toggleCollapse}
                            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
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
                            {baseCommunities.map(community => (
                                <CommunityItem key={community.id} community={community} isCollapsed={isCollapsed.value} />
                            ))}
                        </div>
                        
                        {!isCollapsed.value && (
                            <div class="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mt-4 mb-2">
                                <span>{_`Countries`}</span>
                            </div>
                        )}
                        
                        {!isCollapsed.value && (
                            <div class="px-3 mb-2">
                                <input
                                    type="text"
                                    placeholder={_`Search countries...`}
                                    value={searchQuery.value}
                                    onInput$={(e: any) => searchQuery.value = e.target.value}
                                    class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                                           focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        )}
                        
                        <div class="space-y-1">
                            {filteredCountries.map(community => (
                                <CommunityItem key={community.id} community={community} isCollapsed={isCollapsed.value} />
                            ))}
                            
                            {!isCollapsed.value && filteredCountries.length === 0 && (
                                <div class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                    {_`No countries found`}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div class="mt-auto border-t border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between p-4">
                        <button
                            onClick$={() => showNewCommunityModal.value = true}
                            class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#713fc2] dark:hover:text-[#713fc2]"
                        >
                            <LuPlusCircle class="w-5 h-5 mr-2" />
                            {!isCollapsed.value && _`Nueva Comunidad`}
                        </button>
                        <ThemeSwitch />
                    </div>
                </div>

                <div
                    class="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40"
                    onMouseDown$={() => isDragging.value = true}
                />
            </div>
        </div>
    );
});
