import { component$, createContextId, type Signal, useContextProvider, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";

export const ThemeContext = createContextId<Signal<string>>(
    'docs.theme-context'
);

export default component$(() => {
    const theme = useSignal('light');
    useContextProvider(ThemeContext, theme);

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        const savedTheme = localStorage.getItem('theme');
        theme.value = savedTheme || 'light';
    });

    return (
        <label class="theme-toggle" title="Toggle theme">
            <input 
                type="checkbox" 
                checked={theme.value === 'dark'}
                onClick$={() => {
                    const newTheme = theme.value === 'light' ? 'dark' : 'light';
                    document.documentElement.className = newTheme;
                    localStorage.setItem('theme', newTheme);
                    theme.value = newTheme;
                }}
            />
            <span class="theme-toggle-sr">{_`Toggle theme`}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                width="1.2em"
                height="1.2em"
                fill="currentColor"
                stroke-linecap="round"
                class={`theme-toggle__classic ${theme.value === 'dark' ? 'theme-toggle__classic--dark' : ''}`}
                viewBox="0 0 32 32"
            >
                <clipPath id="theme-toggle__classic__cutout">
                    <path d="M0-5h30a1 1 0 0 0 9 13v24H0Z" />
                </clipPath>
                <g clip-path="url(#theme-toggle__classic__cutout)">
                    <circle cx="16" cy="16" r="9.34" />
                    <g stroke="currentColor" stroke-width="1.5">
                        <path d="M16 5.5v-4" />
                        <path d="M16 30.5v-4" />
                        <path d="M1.5 16h4" />
                        <path d="M26.5 16h4" />
                        <path d="m23.4 8.6 2.8-2.8" />
                        <path d="m5.7 26.3 2.9-2.9" />
                        <path d="m5.8 5.8 2.8 2.8" />
                        <path d="m23.4 23.4 2.9 2.9" />
                    </g>
                </g>
            </svg>
        </label>
    );
});
