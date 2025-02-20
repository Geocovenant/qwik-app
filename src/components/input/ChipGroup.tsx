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
            <div class="flex flex-wrap gap-2">
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
                                "px-4 py-2 rounded-lg border-2 transition-all duration-200",
                                value === option.value 
                                    ? [
                                        "bg-primary/10 border-primary",
                                        "text-primary-700 dark:text-primary-300",
                                        "font-medium shadow-sm",
                                        "dark:bg-primary/20 dark:border-primary/70"
                                      ]
                                    : [
                                        "bg-white dark:bg-gray-800",
                                        "border-gray-200 dark:border-gray-700",
                                        "text-gray-700 dark:text-gray-300",
                                        "hover:border-gray-300 dark:hover:border-gray-600",
                                        "hover:bg-gray-50 dark:hover:bg-gray-700"
                                      ]
                            )}
                        >
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
            {/* Si la opción seleccionada tiene descripción, se muestra */}
            {options.find((option) => option.value === value)?.description && (
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    {options.find((option) => option.value === value)?.description}
                </p>
            )}
            {error && <InputError name={name} error={error} />}
        </div>
    );
});
