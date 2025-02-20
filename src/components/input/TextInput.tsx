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
                )}
            >
                <input
                    {...props}
                    name={name}
                    id={name}
                    aria-invalid={!!error}
                    aria-errormessage={`${name}-error`}
                    class={clsx(
                        'w-full bg-background dark:bg-background',
                        'border-2 rounded-lg pt-8 pb-2 px-3 focus:outline-none transition-all duration-200',
                        'text-foreground dark:text-foreground placeholder:text-muted-foreground/60',
                        error
                            ? 'border-destructive focus:border-destructive'
                            : 'border-input hover:border-muted-foreground/50 focus:border-primary',
                        className
                    )}
                />
                {label && (
                    <div class={clsx(
                        "absolute top-2 left-3 text-sm pointer-events-none transition-colors duration-200",
                        error ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                        {capitalizeFirst(label)}
                        {props.required && <span class="text-destructive ml-1">*</span>}
                    </div>
                )}
                {props.value !== undefined && props.maxLength && (
                    <div class="absolute top-2 right-3 text-sm text-muted-foreground">
                        {props.value.length} / {props.maxLength}
                    </div>
                )}
                <InputError name={name} error={error} />
            </div>
        );
    }
);
