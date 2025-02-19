import { component$, useSignal } from "@builder.io/qwik";
import { Input } from "flowbite-qwik";
import NotificationDropdown from "./NotificationDropdown";
import { _ } from "compiled-i18n";
import { NestedDropdown } from "~/components/NestedDropdown";
import { useSession } from "~/routes/plugin@auth";
import { Button } from "./ui";
import SocialLoginButtons from "./SocialLoginButtons";
import Modal from "~/components/Modal";

export default component$(() => {
    const session = useSession();
    const loginModalVisible = useSignal<boolean>(false);

    return (
        <header class="bg-white border-b border-gray-200 h-16 flex items-center px-6 shadow-sm">
            <div class="flex justify-between items-center w-full">
                <div class="items-center hidden md:flex">
                    <h1 class="text-xl font-semibold text-gray-800">Geounity</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <Input
                        type="text"
                        placeholder={_`Example: Climate Change`}
                        class="w-64"
                    />
                    <NotificationDropdown />
                    {session.value?.user ? (
                        <NestedDropdown 
                            name={session.value.user.name || undefined}
                            email={session.value.user.email || undefined}
                            image={session.value.user.image || undefined}
                        />
                    ) : (
                        <>
                            <Button onClick$={() => loginModalVisible.value = true}>
                                {_`Login`}
                            </Button>
                        </>
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