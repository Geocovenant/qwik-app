import { component$ } from "@builder.io/qwik";
import clsx from "clsx";
import { capitalizeFirst } from "~/utils/capitalizeFirst";

export type InputLabelProps = {
    /** Identificador del input al que se asocia la etiqueta */
    name: string;
    /** Texto de la etiqueta */
    label?: string;
    /** Indica si el campo es obligatorio, añadiendo un asterisco */
    required?: boolean;
    /** Si se especifica "none", se omite el margen inferior por defecto */
    margin?: "none";
    /** Clases CSS adicionales */
    class?: string;
};

/**
 * Componente para la etiqueta de un campo de formulario.
 * Muestra el texto con la primera letra en mayúscula y, opcionalmente, un asterisco si el campo es requerido.
 */
export const InputLabel = component$(
    ({ name, label, required, margin, class: className }: InputLabelProps) => {
        if (!label) return null;

        return (
            <label
                for={name}
                class={clsx(
                    "inline-block font-medium md:text-lg lg:text-xl",
                    !margin && "mb-2 lg:mb-3",
                    className
                )}
            >
                {capitalizeFirst(label)}
                {required && <span class="ml-1 text-red-600 dark:text-red-400">*</span>}
            </label>
        );
    }
);
