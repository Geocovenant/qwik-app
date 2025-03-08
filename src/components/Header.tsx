import { $, component$, useSignal, useContext, useContextProvider } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { NestedDropdown } from "~/components/NestedDropdown";
import { useSession } from "~/routes/plugin@auth";
import { Button } from "./ui";
import SocialLoginButtons from "./SocialLoginButtons";
import Modal from "~/components/Modal";
import Logo from '~/icons/logo.svg?jsx';
import { Link } from "@builder.io/qwik-city";
import { LuSearch, LuMenu } from "@qwikest/icons/lucide";

export default component$(() => {
    const session = useSession();
    const loginModalVisible = useSignal<boolean>(false);
    const searchValue = useSignal<string>('');
    const showSearchMessage = useSignal<boolean>(false);
    const isMobileMenuOpen = useSignal<boolean>(false);

    // Función para abrir/cerrar el sidebar en dispositivos móviles
    const toggleMobileSidebar = $(() => {
        isMobileMenuOpen.value = !isMobileMenuOpen.value;
        // Disparar un evento personalizado que el sidebar pueda escuchar
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar', {
                detail: { isOpen: isMobileMenuOpen.value }
            }));
        }
    });

    return (
        <header class="bg-[#713fc2] border-b border-[#8255c9] h-16 flex items-center px-3 sm:px-6 shadow-sm">
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center">
                    {/* Botón de menú solo visible en móviles */}
                    <button 
                        onClick$={toggleMobileSidebar}
                        class="mr-2 p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors md:hidden"
                        aria-label="Menú"
                    >
                        <LuMenu class="w-6 h-6" />
                    </button>
                    
                    <Link href="/" aria-label="Geounity Homepage" class="flex items-center">
                        <div class="flex items-center">
                            <Logo
                                style={{ width: '48px', height: '48px' }}
                                class="text-white hover:text-gray-100 transition-colors duration-200 animate-spin-fast"
                            />
                            {/* Título solo visible en pantallas medianas y grandes */}
                            <span class="ml-2 font-semibold text-xl text-white hidden sm:inline">{_`Geounity`}</span>
                        </div>
                    </Link>
                </div>
                
                {/* Barra de búsqueda con ancho responsive */}
                <div class="flex-1 max-w-xl mx-2 sm:mx-4">
                    <div class="relative">
                        <input
                            type="text"
                            placeholder={_`Example: Climate Change`}
                            class="w-full bg-white/10 border border-white/20 rounded-full py-1.5 sm:py-2 pl-8 sm:pl-10 pr-3 sm:pr-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm sm:text-base"
                            value={searchValue.value}
                            onInput$={(event) => {
                                const input = event.target as HTMLInputElement;
                                searchValue.value = input.value;
                                showSearchMessage.value = input.value.length > 0;
                            }}
                        />
                        <LuSearch class="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
                        {showSearchMessage.value && (
                            <div class="absolute top-full left-0 right-0 mt-2 bg-white text-[#713fc2] p-3 rounded-lg shadow-lg text-sm z-10 border border-[#8255c9]/30 animate-fadeIn">
                                <div class="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                    <span>{_`La función de búsqueda estará disponible pronto. Estamos trabajando para implementarla.`}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Área de usuario/login con botón más compacto en móvil */}
                <div>
                    {session.value?.user ? (
                        <NestedDropdown
                            userId={session.value.user.id}
                            username={session.value.user.username || undefined}
                            name={session.value.user.name || undefined}
                            email={session.value.user.email || undefined}
                            image={session.value.user.image || undefined}
                        />
                    ) : (
                        <Button
                            onClick$={() => loginModalVisible.value = true}
                            class="bg-white text-[#713fc2] font-medium
                                   px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full 
                                   hover:bg-gray-100
                                   dark:bg-white/90 dark:hover:bg-white
                                   shadow-lg hover:shadow-xl
                                   transform hover:scale-105
                                   transition-all duration-200
                                   border border-white/10
                                   hover:ring-2 hover:ring-white/30
                                   flex items-center gap-1 sm:gap-2
                                   text-sm sm:text-base"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 sm:w-4 sm:h-4">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                <polyline points="10 17 15 12 10 7"></polyline>
                                <line x1="15" y1="12" x2="3" y2="12"></line>
                            </svg>
                            {_`Login`}
                        </Button>
                    )}
                </div>
            </div>
            <Modal
                title={_`Login`}
                description={_`Login to your account`}
                show={loginModalVisible}
            >
                <SocialLoginButtons />
            </Modal>
        </header>
    );
});