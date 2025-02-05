import { component$ } from "@builder.io/qwik";
import { Input } from "flowbite-qwik";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import LanguageDropdown from "./LanguageDropdown";

export default component$(() => {
    return (
        <header class="bg-white border-b border-gray-200 h-16 flex items-center px-6 shadow-sm">
            <div class="flex justify-between items-center w-full">
                <div class="flex items-center">
                    <h1 class="text-xl font-semibold text-gray-800">Geounity</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <Input
                        type="text"
                        placeholder="Ej: Cambio climático"
                        class="w-64"
                    />
                    <LanguageDropdown />
                    <NotificationDropdown />
                    <UserDropdown />
                </div>
            </div>
        </header>
    );
});