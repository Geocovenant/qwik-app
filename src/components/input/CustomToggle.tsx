import { $, component$, useSignal } from '@builder.io/qwik';

interface CustomToggleProps {
    label: string;
    checked: boolean;
    onChange$: (checked: boolean) => void;
}

export const CustomToggle = component$<CustomToggleProps>(({ label, checked, onChange$ }) => {
    const isChecked = useSignal(checked);

    const handleToggle = $(() => {
        isChecked.value = !isChecked.value;
        // eslint-disable-next-line qwik/valid-lexical-scope
        onChange$(isChecked.value);
    });

    return (
        <div class="flex items-center space-x-3 py-2">
            <span class="text-sm font-medium text-gray-700">{label}</span>
            <button
                type="button"
                onClick$={handleToggle}
                class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isChecked.value ? 'bg-blue-600' : 'bg-gray-200'
                }`}
            >
                <span
                    class={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                        isChecked.value ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                />
            </button>
        </div>
    );
}); 