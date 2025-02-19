import { component$, useSignal, $, useStylesScoped$, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LuUser, LuChevronRight, LuGlobe, LuMapPin, LuLogOut, LuCheck } from '@qwikest/icons/lucide';
import { _ } from 'compiled-i18n';
import styles from './nested-dropdown.css?inline';
import { ThemeSwitch } from './theme-switch/ThemeSwitch';
import { useSession, useSignOut } from '~/routes/plugin@auth';
import { Avatar } from '~/components/ui';

interface NestedDropdownProps {
    name?: string;
    email?: string;
    image?: string;
}

interface Language {
    code: string;
    name: string;
    native: string;
}

const languages: Language[] = [
    { code: "en", name: "English", native: _`English` },
    { code: "es", name: "Español", native: _`Spanish` },
];

export const NestedDropdown = component$<NestedDropdownProps>((props) => {
    useStylesScoped$(styles);
    const signOut = useSignOut();
    const isOpen = useSignal(false);
    const isSubOpen = useSignal(false);
    const dropdownRef = useSignal<HTMLDivElement>();

    const toggleDropdown = $(() => {
        isOpen.value = !isOpen.value;
        if (!isOpen.value) {
            isSubOpen.value = false;
        }
    });

    const toggleSubDropdown = $((event: Event) => {
        event.stopPropagation();
        isSubOpen.value = !isSubOpen.value;
    });
    

    const user = {
        language: 'es-AR',
        location: 'Buenos Aires, Argentina',
    }
    
    const selectLanguage = $((lang: string) => {
        user.language = lang;
        isOpen.value = false;
        isSubOpen.value = false;
        // Aquí podrías agregar lógica adicional para cambiar el idioma en la aplicación
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
                isOpen.value = false;
                isSubOpen.value = false;
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    });

    return (
        <div class="dropdown" ref={dropdownRef}>
            <button onClick$={toggleDropdown}>
                <div class="mt-1">
                    <Avatar.Root>
                        <Avatar.Image
                            src={props.image}
                            alt={props.name}
                            sizes="sm"
                        />
                    </Avatar.Root>
                </div>
            </button>
            <div class={`dropdown-content ${isOpen.value ? 'show' : ''}`}>
                <div class="dropdown-item" onClick$={() => isOpen.value = false}>
                    <Link 
                        href={props.name ? `/user/${props.name}` : '/login'} 
                        class="flex items-center"
                    >
                        <LuUser class="w-5 h-5" />
                        <span>{_`My Profile`}</span>
                    </Link>
                </div>
                <div class="dropdown-divider"></div>
                <div class="sub-dropdown">
                    <div class="dropdown-item" onClick$={toggleSubDropdown}>
                        <LuGlobe class="w-5 h-5" />
                        <span>{_`Language`}</span>
                        <LuChevronRight class="w-4 h-4 ml-auto" />
                    </div>
                    <div class={`sub-dropdown-content ${isSubOpen.value ? 'show' : ''}`}>
                        {languages.map((lang) => (
                            <div
                                key={lang.code}
                                class={`dropdown-item ${user.language === lang.code ? 'font-bold' : ''}`}
                                onClick$={() => selectLanguage(lang.code)}
                            >
                                {lang.name} ({lang.native}) &nbsp; {user.language === lang.code && <LuCheck />}
                            </div>
                        ))}
                    </div>
                </div>
                <div class="dropdown-item">
                    <LuMapPin class="w-5 h-5" /> <span>{_`Location`}</span>
                </div>
                <div class="dropdown-item">
                    <ThemeSwitch />
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item" onClick$={() => signOut.submit({ redirectTo: "/" })}>
                    <LuLogOut class="w-5 h-5" /> <span>{_`Log Out`}</span>
                </div>
            </div>
        </div>
    );
});
