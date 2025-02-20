import { $, component$, useSignal } from "@builder.io/qwik";
import { LuCopy } from "@qwikest/icons/lucide";

interface FormSharePollProps {
    share_link: string;
}

export default component$<FormSharePollProps>(({ share_link }) => {
    const linkCopied = useSignal(false);

    const copyToClipboard = $(() => {
        navigator.clipboard.writeText(share_link);
        linkCopied.value = true;
        setTimeout(() => (linkCopied.value = false), 2000);
    });

    return (
        <div class="space-y-4 p-4">
            {/* Enlace Compartible */}
            <div class="flex items-center space-x-2">
                <input
                    type="text"
                    value={share_link}
                    readOnly
                    class="flex-1 px-3 py-2 border rounded-md text-gray-600 bg-gray-100 focus:outline-none"
                />
                <button
                    onClick$={copyToClipboard}
                    class="flex items-center space-x-2 px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 truncate"
                >
                    <LuCopy class="w-4 h-4" />
                    <span>{linkCopied.value ? "Copied!" : "Copy"}</span>
                </button>
            </div>
        </div>
    );
});
