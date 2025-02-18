import { component$ } from '@builder.io/qwik';
import clsx from 'clsx';
import { type DefaultButtonProps } from './UnstyledButton';
import { UnstyledButton } from './UnstyledButton';

export type ActionButtonProps = DefaultButtonProps & {
    variant: 'primary' | 'secondary';
    label: string;
    class?: string;
};

/**
 * Botón de acción con estilos predefinidos para variantes primarias y secundarias.
 */
export const ActionButton = component$(
    ({ label, variant, class: className, ...props }: ActionButtonProps) => (
        <UnstyledButton
            {...props}
            class={clsx(
                'relative flex items-center justify-center rounded-lg px-5 py-2.5 font-medium transition-transform duration-300 md:text-lg',
                variant === 'primary'
                    ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700 hover:scale-105 hover:shadow-lg transition-all duration-200'
                    : 'bg-white border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 hover:scale-105 transition-all duration-200',
                className
            )}
            aria-label={props['aria-label'] || label}
        >
            {label}
        </UnstyledButton>
    )
);
