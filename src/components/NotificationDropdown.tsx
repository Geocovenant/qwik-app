import { component$, useSignal } from "@builder.io/qwik";
import { Dropdown } from "flowbite-qwik";
import { LuBell } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";

const LuBellIcon = component$(() => <LuBell class="h-5 w-5 text-gray-700" />)

export default component$(() => {
    const unreadCount = useSignal(2);
    const notifications = [
        {
            id: 1,
            title: "Nueva respuesta en tu encuesta",
            description: "Juan comentó en 'Mejoras para el barrio'",
            time: "hace 5 minutos",
            unread: true,
        },
        {
            id: 2,
            title: "Debate actualizado",
            description: "Se añadieron 3 nuevas respuestas",
            time: "hace 1 hora",
            unread: true,
        },
        {
            id: 3,
            title: "Recordatorio", 
            description: "La encuesta termina en 24 horas",
            time: "hace 2 horas",
            unread: false,
        },
    ];

    return (
        <Dropdown
            label=""
            class="z-50"
            as={
                <button class="relative text-gray-600 hover:text-gray-800">
                    <LuBellIcon />
                    {unreadCount.value > 0 && (
                        <span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                            {unreadCount.value}
                        </span>
                    )}
                </button>
            }
        >
            <Dropdown.Item header>
                <div class="flex items-center justify-between px-4 py-2">
                    <span class="text-sm font-semibold text-gray-900">{_`Notifications`}</span>
                    <button
                        onClick$={() => (unreadCount.value = 0)}
                        class="text-blue-600 text-sm"
                    >
                        {_`Mark all as read`}
                    </button>
                </div>
            </Dropdown.Item>
            <Dropdown.Item divider />
            {notifications.map((n) => (
                <Dropdown.Item key={n.id}>
                    <div class="flex flex-col items-start gap-1 p-2">
                        <div class="flex w-full items-center justify-between">
                            <span class="font-medium text-gray-900">{n.title}</span>
                            {n.unread && (
                                <span class="rounded bg-blue-100 px-1 text-xs text-blue-600">{_`New`}</span>
                            )}
                        </div>
                        <p class="text-sm text-gray-500">{n.description}</p>
                        <span class="text-xs text-gray-400">{n.time}</span>
                    </div>
                </Dropdown.Item>
            ))}
            <Dropdown.Item divider />
            <Dropdown.Item>
                <span class="text-center text-blue-600">{_`View all notifications`}</span>
            </Dropdown.Item>
        </Dropdown>
    );
});
