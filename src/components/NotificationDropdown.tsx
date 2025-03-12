import { component$, useSignal } from "@builder.io/qwik";
import { Dropdown } from "~/components/ui";
import { _ } from "compiled-i18n";

export default component$(() => {
    const unreadCount = useSignal(0);
    const notifications: any[] = [];

    return (
        <Dropdown.Root class="z-50">
            <Dropdown.Trigger>
                {'trigger'}
            </Dropdown.Trigger>
            
            <Dropdown.Item>
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
            <Dropdown.Separator />
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
            <Dropdown.Separator />
            <Dropdown.Item>
                <span class="text-center text-blue-600">{_`View all notifications`}</span>
            </Dropdown.Item>
        </Dropdown.Root>
    );
});
