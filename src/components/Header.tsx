import { component$, useSignal } from "@builder.io/qwik";
import NotificationDropdown from "./NotificationDropdown";
import { _ } from "compiled-i18n";
import { NestedDropdown } from "~/components/NestedDropdown";
import { useSession } from "~/routes/plugin@auth";
import { Button } from "./ui";
import SocialLoginButtons from "./SocialLoginButtons";
import Modal from "~/components/Modal";
import Logo from '~/icons/logo.svg?jsx';
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
    const session = useSession();
    const loginModalVisible = useSignal<boolean>(false);

    return (
        <header class="dark:bg-[#713fc2] border-b border-[#A855F7] dark:border-[#8255c9] h-16 flex items-center px-6 shadow-sm">
            <div class="flex justify-between items-center w-full">
                <Link href="/" aria-label="Geounity Homepage" class="inline-block mr-auto">
                    <Logo
                        style={{ width: '48px', height: '48px' }}
                        class="text-white hover:text-gray-100 transition-colors duration-200"
                    />
                </Link>
                <div class="flex items-center space-x-4">
                    <input
                        disabled
                        type="text"
                        placeholder={_`Example: Climate Change`}
                    />
                    {/* <NotificationDropdown /> */}
                    {session.value?.user ? (
                        <NestedDropdown
                            userId={session.value.user.username || session.value.user.id}
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