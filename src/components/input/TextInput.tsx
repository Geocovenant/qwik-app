import { component$, type QRL } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from '~/components/input/InputError';
import { capitalizeFirst } from '~/utils/capitalizeFirst';

export type TextInputProps = {
    /** Nombre del input (también se usa para id y aria-errormessage) */
    name: string;
    /** Tipo de input */
    type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'date';
    /** Etiqueta del input */
    label?: string;
    /** Placeholder del input */
    placeholder?: string;
    /** Valor actual */
    value?: string;
    /** Mensaje de error, si existe */
    error?: string;
    /** Campo obligatorio */
    required?: boolean;
    /** Clase CSS adicional */
    class?: string;
    /** Longitud máxima permitida */
    maxLength?: number;
    /** Autofoco al renderizar */
    autofocus?: boolean;
    /** Si se debe ocultar el input */
    hidden?: boolean;
    /** Referencia para acceder al elemento (usado por Modular Forms) */
    ref?: QRL<(element: HTMLInputElement) => void>;
    /** Evento onInput */
    onInput$?: (event: Event, element: HTMLInputElement) => void;
    /** Evento onChange */
    onChange$?: (event: Event, element: HTMLInputElement) => void;
    /** Evento onBlur */
    onBlur$?: (event: Event, element: HTMLInputElement) => void;
};

export const TextInput = component$(
    ({
        label,
        name,
        error,
        hidden,
        class: className,
        ...props
    }: TextInputProps) => {
        return (
            <div
                class={clsx(
                    'w-full space-y-1 relative',
                    hidden && 'hidden',
                    error ? 'text-red-500' : 'focus-within:text-blue-500'
                )}
            >
                <input
                    {...props}
                    name={name}
                    id={name}
                    aria-invalid={!!error}
                    aria-errormessage={`${name}-error`}
                    class={clsx(
                        'w-full bg-white dark:bg-black text-black dark:text-white',
                        'border-2 rounded-sm pt-8 pb-2 px-3 focus:outline-none transition-colors duration-200',
                        error
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500',
                        className
                    )}
                />
                {label && (
                    <div class="absolute top-2 left-3 text-sm pointer-events-none transition-colors duration-200">
                        {capitalizeFirst(label)}
                        {props.required && <span class="text-red-500 ml-1">*</span>}
                    </div>
                )}
                {props.value !== undefined && props.maxLength && (
                    <div class="absolute top-2 right-3 text-sm text-gray-600 dark:text-gray-300">
                        {props.value.length} / {props.maxLength}
                    </div>
                )}
                <InputError name={name} error={error} />
            </div>
        );
    }
);
