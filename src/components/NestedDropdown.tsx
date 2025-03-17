import { component$, useSignal, $, useStylesScoped$, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LuUser, LuLogOut, LuChevronDown } from '@qwikest/icons/lucide';
import styles from './nested-dropdown.css?inline';
import { useSignOut } from '~/routes/plugin@auth';
import { Avatar } from '~/components/ui';
import { _ } from 'compiled-i18n';

interface NestedDropdownProps {
    userId?: string;
    username?: string;
    name?: string;
    email?: string;
    image?: string;
}

export const NestedDropdown = component$<NestedDropdownProps>((props) => {
    useStylesScoped$(styles);
    const signOut = useSignOut();
    const isOpen = useSignal(false);
    const dropdownRef = useSignal<HTMLDivElement>();

    const toggleDropdown = $(() => {
        isOpen.value = !isOpen.value;
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
                isOpen.value = false;
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    });

    return (
        <div class="dropdown" ref={dropdownRef}>
            <button onClick$={toggleDropdown} class="dropdown-trigger">
                <div class="flex items-center gap-1">
                    <Avatar.Root class="avatar">
                        <Avatar.Image
                            src={props.image}
                            alt={props.name}
                        />
                    </Avatar.Root>
                    <LuChevronDown class={`chevron-icon ${isOpen.value ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <div class={`dropdown-content ${isOpen.value ? 'show' : ''}`}>
                <div class="user-info">
                    <Avatar.Root class="avatar-large">
                        <Avatar.Image
                            src={props.image}
                            alt={props.name}
                        />
                    </Avatar.Root>
                    <div class="user-details">
                        <div class="user-name">{props.name || props.username}</div>
                        {props.email && <div class="user-email">{props.email}</div>}
                    </div>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item" onClick$={() => isOpen.value = false}>
                    <Link 
                        href={props.username ? `/user/${props.username}` : '/login'} 
                        class="flex items-center w-full"
                    >
                        <LuUser class="w-5 h-5" />
                        <span>{_`My Profile`}</span>
                    </Link>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item" onClick$={() => signOut.submit({ redirectTo: "/" })}>
                    <LuLogOut class="w-5 h-5" /> 
                    <span>{_`Sign Out`}</span>
                </div>
            </div>
        </div>
    );
});
