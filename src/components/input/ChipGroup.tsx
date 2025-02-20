import { component$, type QRL } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';
import { capitalizeFirst } from '~/utils/capitalizeFirst';

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
            {label && (
                <div class="flex items-center gap-1">
                    <span class="text-sm text-foreground">{capitalizeFirst(label)}</span>
                    {required && <span class="text-destructive">*</span>}
                </div>
            )}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                        <div
                            class={clsx(
                                "w-full p-3 rounded-lg border transition-all duration-200",
                                "flex flex-col gap-1",
                                value === option.value 
                                    ? [
                                        "border-primary bg-primary/5",
                                        "text-foreground",
                                      ]
                                    : [
                                        "border-input bg-card",
                                        "text-foreground hover:border-primary/30",
                                      ]
                            )}
                        >
                            <span class="font-medium">{option.label}</span>
                            {option.description && (
                                <span class="text-xs text-muted-foreground">
                                    {option.description}
                                </span>
                            )}
                        </div>
                    </label>
                ))}
            </div>
            <InputError name={name} error={error} />
        </div>
    );
});
