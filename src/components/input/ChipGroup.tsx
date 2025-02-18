import { component$, type QRL } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';
import { InputLabel } from './InputLabel';

export type ChipGroupOption = {
    label: string;
    value: string;
    description?: string;
};

export type ChipGroupProps = {
    /** Nombre del grupo, usado para el atributo name y accesibilidad */
    name: string;
    /** Valor actualmente seleccionado */
    value?: string;
    /** Opciones disponibles */
    options: ChipGroupOption[];
    /** Manejador del evento onInput */
    onInput$?: QRL<(ev: Event) => void>;
    /** Manejador del evento onChange */
    onChange$?: QRL<(ev: Event) => void>;
    /** Etiqueta descriptiva del grupo */
    label?: string;
    /** Mensaje de error asociado */
    error?: string;
    /** Indica si el campo es obligatorio */
    required?: boolean;
    /** Clase CSS adicional */
    class?: string;
};

export const ChipGroup = component$((props: ChipGroupProps) => {
    const { name, value, options, label, error, required, onInput$, onChange$, class: className } = props;

    return (
        <div class={clsx("space-y-2", className)}>
            {label && <InputLabel name={name} label={label} required={required} />}
            <div class="flex space-x-2">
                {options.map((option) => (
                    <label key={option.value} class="relative cursor-pointer">
                        <input
                            type="radio"
                            name={name}
                            id={`${name}-${option.value}`}
                            value={option.value}
                            checked={value === option.value}
                            onInput$={onInput$}
                            onChange$={onChange$}
                            aria-invalid={!!error}
                            aria-errormessage={`${name}-error`}
                            class="hidden"
                        />
                        <span
                            class={clsx(
                                "px-4 py-2 rounded-full transition-colors duration-200",
                                value === option.value ? "bg-primary text-white" : "bg-muted text-foreground"
                            )}
                        >
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
            {/* Si la opción seleccionada tiene descripción, se muestra */}
            {options.find((option) => option.value === value)?.description && (
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {options.find((option) => option.value === value)?.description}
                </p>
            )}
            {error && <InputError name={name} error={error} />}
        </div>
    );
});
