import { $, component$, useSignal, useResource$, useVisibleTask$ } from "@builder.io/qwik";
import { LuGlobe, LuPanelLeftClose, LuPanelLeftOpen, LuPlusCircle } from "@qwikest/icons/lucide";
import { dataArray } from "~/data/countries";
import { _ } from "compiled-i18n";
import CommunityItem, { type Community } from "./CommunityItem";
import ClassicTheme from "~/components/ClassicTheme";
import Modal from "~/components/Modal";
import RequestCommunityForm from "~/components/forms/RequestCommunityForm";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import Footer from "~/components/Footer";

// Component for the LuGlobe icon
const LuGlobeIcon = component$(() => <LuGlobe class="h-5 w-5" />);

// We create the base communities (Global and International)
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

// We convert the countries from the dataArray to communities
const countryCommunities: Community[] = dataArray.map(country => ({
    id: country.cca2.toLowerCase(),
    cca2: country.cca2,
    name: country.name,
    path: country.path, // We use the path defined in countries.ts
    icon: country.flag,
    children: []
}));

export default component$(() => {
    const session = useSession();
    const isCollapsed = useSignal<boolean>(false);
    const isMobileView = useSignal<boolean>(false);
    const isSidebarOpen = useSignal<boolean>(false);
    const sidebarWidth = useSignal<number>(256);
    const isDragging = useSignal<boolean>(false);
    const showNewCommunityModal = useSignal<boolean>(false);
    const searchQuery = useSignal<string>('');

    const MIN_WIDTH = 64;
    const MAX_WIDTH = 384;

    // Detect mobile view and collapse sidebar automatically
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        const checkMobileView = () => {
            const isMobile = window.innerWidth < 768; // md breakpoint
            isMobileView.value = isMobile;
            
            // Collapse sidebar by default on mobile
            if (isMobile && !isDragging.value) {
                isCollapsed.value = true;
                sidebarWidth.value = MIN_WIDTH;
                isSidebarOpen.value = false;
            } else if (!isMobile && !isDragging.value) {
                isCollapsed.value = false;
                sidebarWidth.value = 256;
            }
        };

        checkMobileView();
        window.addEventListener('resize', checkMobileView);
        
        return () => {
            window.removeEventListener('resize', checkMobileView);
        };
    });

    // Handle the resize of the sidebar
    useResource$(({ track, cleanup }) => {
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

    // Handle the collapse of the sidebar
    const toggleCollapse = $(() => {
        const newCollapsed = !isCollapsed.value;
        isCollapsed.value = newCollapsed;
        sidebarWidth.value = newCollapsed ? MIN_WIDTH : 256;
    });

    // Toggle mobile sidebar
    const toggleMobileSidebar = $(() => {
        isSidebarOpen.value = !isSidebarOpen.value;
    });

    // Filter the countries based on the search
    const filteredCountries = !searchQuery.value 
        ? countryCommunities // Show all countries always
        : countryCommunities.filter(country => 
            country.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );

    // Escuchar el evento del Header para abrir/cerrar el sidebar en móvil
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        const handleToggleSidebar = (event: CustomEvent) => {
            if (isMobileView.value) {
                isSidebarOpen.value = event.detail.isOpen;
            }
        };
        
        window.addEventListener('toggle-mobile-sidebar', handleToggleSidebar as EventListener);
        
        return () => {
            window.removeEventListener('toggle-mobile-sidebar', handleToggleSidebar as EventListener);
        };
    });

    return (
        <div class="flex h-full">
            {/* Mobile sidebar backdrop */}
            {isMobileView.value && isSidebarOpen.value && (
                <div 
                    class="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick$={toggleMobileSidebar}
                />
            )}
            
            {/* Sidebar */}
            <div 
                class={`
                    flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
                    transition-all duration-300 ease-in-out
                    ${isMobileView.value ? 'fixed z-50 h-full' : 'relative'}
                    ${isMobileView.value && !isSidebarOpen.value ? '-translate-x-full' : 'translate-x-0'}
                `}
                style={{ width: `${isMobileView.value ? '85%' : sidebarWidth.value}px`, maxWidth: '300px' }}
            >
                <div class="sticky top-0 z-20 bg-white dark:bg-gray-900">
                    <div class={`p-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between ${isCollapsed.value && !isMobileView.value ? 'justify-center' : ''}`}>
                        {(!isCollapsed.value || isMobileView.value) && (
                            <span class="font-semibold text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-200">{_`Menu`}</span>
                        )}
                        {isMobileView.value ? (
                            <button
                                onClick$={toggleMobileSidebar}
                                class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                            >
                                <LuPanelLeftClose class="h-5 w-5" />
                            </button>
                        ) : (
                            <button
                                onClick$={toggleCollapse}
                                class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                            >
                                {isCollapsed.value ? <LuPanelLeftOpen class="h-5 w-5" /> : <LuPanelLeftClose class="h-5 w-5" />}
                            </button>
                        )}
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto">
                    <div class="px-2 py-4">
                        <div class="space-y-2">
                            {baseCommunities.map(community => (
                                <CommunityItem key={community.id} community={community} isCollapsed={isCollapsed.value && !isMobileView.value} />
                            ))}
                        </div>
                        
                        {(!isCollapsed.value || isMobileView.value) && (
                            <div class="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mt-4 mb-2 transition-opacity duration-200">
                                <span>{_`Countries`}</span>
                            </div>
                        )}
                        
                        {(!isCollapsed.value || isMobileView.value) && (
                            <div class="px-3 mb-2 transition-opacity duration-200">
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
                                <CommunityItem 
                                    key={community.id} 
                                    community={community} 
                                    isCollapsed={isCollapsed.value && !isMobileView.value} 
                                    onClick$={isMobileView.value ? toggleMobileSidebar : undefined}
                                />
                            ))}
                            
                            {(!isCollapsed.value || isMobileView.value) && filteredCountries.length === 0 && (
                                <div class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-200">
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
                            {(!isCollapsed.value || isMobileView.value) && <span class="transition-opacity duration-200">{_`New Community`}</span>}
                        </button>
                        <ClassicTheme />
                    </div>
                    
                    {/* Reemplazar el footer con el nuevo componente */}
                    <Footer 
                        isCollapsed={isCollapsed.value} 
                        isMobileView={isMobileView.value} 
                        variant="sidebar"
                    />
                </div>

                {!isMobileView.value && (
                    <div
                        class="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40"
                        onMouseDown$={() => isDragging.value = true}
                    />
                )}
            </div>
            <Modal
                title={_`Request new community`}
                show={showNewCommunityModal}
            >
                {session.value?.user
                    ? <RequestCommunityForm 
                        onClose$={() => showNewCommunityModal.value = false}
                    />
                    : <div>
                        <p>{_`Please sign in to request a new community`}</p>
                        <SocialLoginButtons />
                    </div>
                }
            </Modal>
        </div>
    );
});
