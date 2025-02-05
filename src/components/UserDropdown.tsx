import { component$ } from "@builder.io/qwik";
import { Dropdown } from "flowbite-qwik";
import { LuUser, LuSettings, LuHelpCircle, LuLogOut } from "@qwikest/icons/lucide";

const LuUserIcon = component$(() => <LuUser class="h-4 w-4 text-gray-700" />)
const LuSettingsIcon = component$(() => <LuSettings class="h-4 w-4 text-gray-700" />)
const LuHelpCircleIcon = component$(() => <LuHelpCircle class="h-4 w-4 text-gray-700" />)
const LuLogOutIcon = component$(() => <LuLogOut class="h-4 w-4 text-red-600" />)

export default component$(() => {
    return (
        <Dropdown
            label=""
            class="z-50"
            as={
                <button class="text-gray-600 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            }
        >
            <Dropdown.Item header>
                <div class="px-4 py-2">
                    <p class="text-sm font-semibold text-gray-900">Mi Cuenta</p>
                    <p class="text-sm text-gray-500 truncate">usuario@ejemplo.com</p>
                </div>
            </Dropdown.Item>
            <Dropdown.Item divider />

            <Dropdown.Item>
                <div class="flex items-center space-x-2">
                    <LuUserIcon />
                    <span class="text-gray-700">Perfil</span>
                </div>
            </Dropdown.Item>

            <Dropdown.Item>
                <div class="flex items-center space-x-2">
                    <LuSettingsIcon />
                    <span class="text-gray-700">Configuración</span>
                </div>
            </Dropdown.Item>

            <Dropdown.Item>
                <div class="flex items-center space-x-2">
                    <LuHelpCircleIcon />
                    <span class="text-gray-700">Ayuda</span>
                </div>
            </Dropdown.Item>

            <Dropdown.Item divider />

            <Dropdown.Item>
                <div class="flex items-center space-x-2 text-red-600 hover:bg-red-50 focus:bg-red-50">
                    <LuLogOutIcon />
                    <span>Cerrar sesión</span>
                </div>
            </Dropdown.Item>
        </Dropdown>
    );
});
