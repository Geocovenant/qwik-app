import { component$, getLocale } from "@builder.io/qwik";
import { LuLanguages } from "@qwikest/icons/lucide";
import { _, locales } from "compiled-i18n";

const LuLanguagesIcon = component$(() => <LuLanguages class="h-4 w-4 text-gray-700" />)

export default component$(() => {
    const currentLocale = getLocale()
    return (
        <Dropdown
            label=""
            class="z-50"
            as={
                <button class="text-gray-600 hover:text-gray-800">
                    <LuLanguagesIcon />
                </button>
            }
        >
            <Dropdown.Item header>
                <div class="px-4 py-2">
                    <p class="text-sm font-semibold text-gray-900">{_`Languages`}</p>
                </div>
            </Dropdown.Item>

            <Dropdown.Item divider />

            {locales.map((locale) => {
                const isCurrent = locale === currentLocale
                return (
                    <Dropdown.Item key={locale}>
                        <a
                            href={`?locale=${locale}`}
                            aria-disabled={isCurrent}
                            class={`flex items-center space-x-2 w-full px-4 py-2 text-sm ${isCurrent ? 'bg-gray-100 text-gray-900 pointer-events-none' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <span>{locale === 'es_AR' ? _`Spanish` : _`English`}</span>
                        </a>
                    </Dropdown.Item>
                )
            })}
        </Dropdown>
    );
});
