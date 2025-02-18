import { $, component$, Slot, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import clsx from 'clsx';
import { Spinner } from '~/components/Spinner';

export type LinkProps = {
    type: 'link';
    href: string;
    download?: boolean | string;
    target?: '_blank';
};

export type ButtonProps = {
    type: 'button' | 'reset' | 'submit';
    'preventdefault:click'?: boolean;
    onClick$?: () => unknown;
    loading?: boolean;
    form?: string;
};

export type DefaultButtonProps = LinkProps | ButtonProps;

export type UnstyledButtonProps = DefaultButtonProps & {
    class?: string;
    'aria-label'?: string;
};

/**
 * Botón básico sin estilos, encargado de la lógica de loading y eventos.
 */
export const UnstyledButton = component$((props: UnstyledButtonProps) => {
    const loading = useSignal(false);

    // Si el botón es de tipo link, renderiza el Link.
    if (props.type === 'link') {
        return (
            <Link {...props} rel={props.target === '_blank' ? 'noreferrer' : undefined}>
                <Slot />
            </Link>
        );
    }

    return (
        <button
            {...props}
            onClick$={
                props.onClick$
                    ? $(async () => {
                        loading.value = true;
                        await props.onClick$();
                        loading.value = false;
                    })
                    : undefined
            }
            disabled={loading.value || props.loading}
            class={clsx(props.class)}
        >
            <div
                class={clsx(
                    'transition-[opacity,transform,visibility] duration-200',
                    loading.value || props.loading
                        ? 'invisible translate-x-5 opacity-0'
                        : 'visible delay-300'
                )}
            >
                <Slot />
            </div>
            <div
                class={clsx(
                    'absolute duration-200',
                    loading.value || props.loading
                        ? 'visible delay-300'
                        : 'invisible -translate-x-5 opacity-0'
                )}
            >
                <Spinner />
            </div>
        </button>
    );
});
