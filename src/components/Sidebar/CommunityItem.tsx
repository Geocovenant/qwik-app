import { type QRL, component$, Resource, useComputed$, useResource$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Collapsible } from '@qwik-ui/headless';
import { LuBuilding, LuChevronRight, LuMapPin } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";

// Define the Community interface for the community structure
export interface Community {
    id: string
    cca2?: string
    name: string
    path: string
    icon: any
    children: Community[]
    divisionType?: string
}

// Reusable icon components
export const LuBuildingIcon = component$(() => <LuBuilding class="h-5 w-5" />);
export const LuMapPinIcon = component$(() => <LuMapPin class="h-5 w-5" />);

export const CommunityItem = component$(({ 
    community, 
    level = 0, 
    isCollapsed,
    onClick$
}: {
    community: Community, 
    level?: number, 
    isCollapsed: boolean,
    onClick$?: QRL<() => void>
}) => {
    const isOpen = useSignal<boolean>(false);
    const location = useLocation();
    const pathname = location.url.pathname;
    
    // Modify the logic to detect if the item is active
    // Check if the current path exactly matches the community path
    // or if it is a subpath (to keep the parent item active)
    const isExactMatch = pathname === community.path || pathname === `${community.path}/`;
    const isParentMatch = pathname.startsWith(`${community.path}/`);
    const isActive = isExactMatch || isParentMatch;
    
    // If it is an exact match or a parent of the current path, automatically open the item
    useTask$(({ track }) => {
        track(() => pathname);
        if (isActive && !isOpen.value) {
            isOpen.value = true;
        }
    });
    
    // Determine if it can have subdivisions
    const canHaveSubdivisions = community.id !== 'global' && community.id !== 'international';
    
    // Determine if this is a subregion that might have localities
    // Now using a more reliable approach based on path structure and level
    const isSubregion = level === 3 || 
                        (community.path.split('/').length >= 3 && !community.cca2);

    const divisions = useResource$(async ({ track, cleanup }) => {
        track(() => isOpen.value);
        
        // Only make the request if it can have subdivisions and is open
        if (!isOpen.value || !canHaveSubdivisions) return [];
        
        const controller = new AbortController();
        cleanup(() => controller.abort());
        
        try {
            let url;
            
            // Determine the appropriate endpoint based on the type of community
            if (isSubregion) {
                // If it's a subregion, use the localities endpoint
                url = `https://fastapi-production-c234e.up.railway.app/api/v1/subregions/${community.id}/localities`;
            } else if (community.cca2) {
                // If it is a country (has cca2), use the country route
                url = `https://fastapi-production-c234e.up.railway.app/api/v1/countries/${community.cca2}/divisions`;
            } else {
                // Otherwise, use the regions route
                url = `https://fastapi-production-c234e.up.railway.app/api/v1/regions/${community.id}/subregions`;
            }
            
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
    
    const calculateIndent = (level: number) => {
        if (isCollapsed) return "";
        switch (level) {
            case 0: return "";
            case 1: return "ml-4";
            case 2: return "ml-8";
            case 3: return "ml-16";
            case 4: return "ml-20";
            default: return `ml-${6 * level}`;
        }
    };
    
    const indentClass = calculateIndent(level);
    
    const itemClass = `
        flex items-center gap-2 py-1.5 rounded-lg
        ${isActive 
            ? "bg-primary/20 dark:bg-primary/20 text-primary dark:text-primary-foreground font-medium shadow-sm" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary-foreground"
        }
        ${isCollapsed ? "justify-center px-3" : "px-2"}
        transition-all duration-200 ease-in-out
    `;

    // Ajustar también el indicador visual de nivel para que coincida con la nueva indentación
    const levelIndicator = !isCollapsed && level > 0 ? (
        <div class="absolute left-0 top-0 bottom-0 flex h-full">
            {[...Array(level)].map((_, i) => (
                <div 
                    key={i}
                    class="h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    style={{ marginLeft: `${i * 6 + 3}px` }} // Cambiar multiplicador de 8 a 6
                />
            ))}
        </div>
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
                        <div class={`flex items-center group ${indentClass.value}`}>
                            {!isCollapsed && level < 3 && (
                                <Collapsible.Trigger 
                                    class="p-1 flex-shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 
                                        hover:text-primary dark:hover:text-primary-foreground rounded-md 
                                        transition-all duration-200 ease-in-out"
                                >
                                    <div class={`transition-transform duration-200 ${isOpen.value ? "rotate-90" : ""}`}>
                                        <LuChevronRight class="h-3.5 w-3.5" />
                                    </div>
                                </Collapsible.Trigger>
                            )}
                            <Link
                                href={`/${community.path}`}
                                class={itemClass}
                                onClick$={onClick$}
                                prefetch={false}
                            >
                                <div class="h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110">
                                    {community.icon}
                                </div>
                                {!isCollapsed && (
                                    <span class="font-medium truncate whitespace-nowrap">{community.name}</span>
                                )}
                            </Link>
                        </div>
                        {isOpen.value && (
                            <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                        )}
                    </div>

                    <Collapsible.Content>
                        <div class="relative pl-0">
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
                                    <div class="space-y-1 py-1">
                                        {divisions.map((division: any) => {
                                            const slug = division.name
                                                .toLowerCase()
                                                .normalize("NFD")
                                                .replace(/[\u0300-\u036f]/g, "")
                                                .replace(/\s+/g, '-')
                                                .replace(/[^a-z0-9-]/g, '');
                                            
                                            // Determine correct icon based on division type
                                            const icon = division.type === 'locality' 
                                                ? <LuMapPinIcon /> 
                                                : <LuBuildingIcon />;
                                            
                                            return (
                                                <CommunityItem 
                                                    key={division.id}
                                                    community={{
                                                        id: division.id,
                                                        name: division.name,
                                                        path: `${community.path}/${slug}`,
                                                        icon: icon,
                                                        children: [],
                                                        divisionType: division.type
                                                    }} 
                                                    level={level + 1} 
                                                    isCollapsed={isCollapsed}
                                                    onClick$={onClick$}
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
        <Link href={community.path} onClick$={onClick$}>
            <div class={`relative ${itemClass}`}>
                {levelIndicator}
                <div class="h-5 w-5 flex-shrink-0">
                    {community.icon}
                </div>
                {!isCollapsed && <span>{community.name}</span>}
            </div>
        </Link>
    )
});

export default CommunityItem; 