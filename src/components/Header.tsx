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
                            class="text-white hover:text-gray-100 transition-colors duration-200"
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
                            name={session.value.user.name || undefined}
                            email={session.value.user.email || undefined}
                            image={session.value.user.image || undefined}
                        />
                    ) : (
                        <Button
                            onClick$={() => loginModalVisible.value = true}
                            class="bg-gradient-to-r from-[#9333EA] to-[#A855F7] text-white 
                                   hover:from-[#A855F7] hover:to-[#9333EA] 
                                   dark:from-[#8255c9] dark:to-[#713fc2]
                                   dark:hover:from-[#713fc2] dark:hover:to-[#8255c9]
                                   shadow-lg hover:shadow-xl
                                   transform hover:scale-105
                                   transition-all duration-200"
                        >
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