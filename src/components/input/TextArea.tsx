import { component$, type QRL } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';
import { capitalizeFirst } from '~/utils/capitalizeFirst';

export type TextAreaProps = {
    /** Nombre del input, usado para el id y atributos de accesibilidad */
    name: string;
    /** Etiqueta descriptiva del textarea */
    label?: string;
    /** Placeholder del textarea */
    placeholder?: string;
    /** Valor actual */
    value?: string;
    /** Mensaje de error (si lo hay) */
    error?: string;
    /** Indica si el campo es obligatorio */
    required?: boolean;
    /** Clase CSS adicional */
    class?: string;
    /** Longitud máxima permitida */
    maxLength?: number;
    /** Número de filas a mostrar */
    rows?: number;
    /** Autofoco al renderizar */
    autofocus?: boolean;
    /** Si se debe ocultar el textarea */
    hidden?: boolean;
    /** Referencia al elemento para integrarse con Modular Forms */
    ref?: QRL<(element: HTMLTextAreaElement) => void>;
    /** Evento onInput */
    onInput$?: (event: Event, element: HTMLTextAreaElement) => void;
    /** Evento onChange */
    onChange$?: (event: Event, element: HTMLTextAreaElement) => void;
    /** Evento onBlur */
    onBlur$?: (event: Event, element: HTMLTextAreaElement) => void;
};

export const TextArea = component$(
    ({
        label,
        name,
        error,
        rows = 4,
        class: className,
        ...props
    }: TextAreaProps) => {
        return (
            <div
                class={clsx(
                    'w-full space-y-1 relative',
                    props.hidden && 'hidden'
                )}
            >
                <textarea
                    {...props}
                    name={name}
                    id={name}
                    rows={rows}
                    aria-invalid={!!error}
                    aria-errormessage={`${name}-error`}
                    class={clsx(
                        'w-full bg-background dark:bg-background',
                        'border-2 rounded-lg pt-8 pb-2 px-3 focus:outline-none transition-all duration-200',
                        'text-foreground dark:text-foreground placeholder:text-muted-foreground/60',
                        'resize-none',
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
