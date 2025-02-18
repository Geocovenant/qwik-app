import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { isBrowser } from '@builder.io/qwik/build';
import { Expandable } from '~/components/Expandable';

export type InputErrorProps = {
    /** Nombre del input, usado para el id del mensaje de error */
    name: string;
    /** Mensaje de error a mostrar */
    error?: string;
};

/**
 * Componente para mostrar el mensaje de error de un input.
 *
 * Utiliza una señal "congelada" para evitar saltos en la UI mientras el mensaje se oculta.
 */
export const InputError = component$(({ name, error }: InputErrorProps) => {
    // Señal para "congelar" el mensaje de error y evitar saltos en la UI.
    const frozenError = useSignal<string>('');

    useTask$(({ track, cleanup }) => {
        // Se monitorea el valor del error.
        const nextError = track(() => error) ?? '';
        // Si estamos en el navegador y el error acaba de desaparecer,
        // se congela el mensaje por 200ms para evitar cambios bruscos en la UI.
        if (isBrowser && !nextError) {
            const timeout = setTimeout(() => {
                frozenError.value = nextError;
            }, 200);
            cleanup(() => clearTimeout(timeout));
        } else {
            frozenError.value = nextError;
        }
    });

    return (
        <Expandable expanded={!!error}>
            <div
                id={`${name}-error`}
                class="pt-1 text-sm text-red-500 dark:text-red-400 md:text-base"
            >
                {frozenError.value}
            </div>
        </Expandable>
    );
});
