import { component$, useSignal } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { NestedDropdown } from "~/components/NestedDropdown";
import { useSession } from "~/routes/plugin@auth";
import { Button } from "./ui";
import SocialLoginButtons from "./SocialLoginButtons";
import Modal from "~/components/Modal";
import Logo from '~/icons/logo.svg?jsx';
import { Link } from "@builder.io/qwik-city";
import { LuSearch } from "@qwikest/icons/lucide";

export default component$(() => {
    const session = useSession();
    const loginModalVisible = useSignal<boolean>(false);

    return (
        <header class="bg-[#713fc2] border-b border-[#8255c9] h-16 flex items-center px-6 shadow-sm">
            <div class="flex items-center justify-between w-full">
                <Link href="/" aria-label="Geounity Homepage" class="flex items-center">
                    <div class="flex items-center">
                        <Logo
                            style={{ width: '48px', height: '48px' }}
                            class="text-white hover:text-gray-100 transition-colors duration-200 animate-spin-fast"
                        />
                        <span class="ml-2 font-semibold text-xl text-white">Geounity</span>
                    </div>
                </Link>
                <div class="flex-1 max-w-xl mx-4">
                    <div class="relative">
                        <input
                            type="text"
                            placeholder={_`Example: Climate Change`}
                            class="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-10 pr-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                        />
                        <LuSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                    </div>
                </div>
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
                                   px-6 py-2.5 rounded-full 
                                   hover:bg-gray-100
                                   dark:bg-white/90 dark:hover:bg-white
                                   shadow-lg hover:shadow-xl
                                   transform hover:scale-105
                                   transition-all duration-200
                                   border border-white/10
                                   hover:ring-2 hover:ring-white/30
                                   flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
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