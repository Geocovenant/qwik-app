import { $, component$, Slot, useOnWindow, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import clsx from 'clsx';

export type ExpandableProps = {
    /** Clase CSS adicional */
    class?: string;
    /** ID del elemento */
    id?: string;
    /** Indica si el contenido está expandido */
    expanded: boolean;
};

/**
 * Componente wrapper para expandir o colapsar verticalmente su contenido.
 * Ajusta la altura del contenedor según su contenido para lograr una transición suave.
 */
export const Expandable = component$(({ id, expanded, class: className }: ExpandableProps) => {
    // Referencia al elemento contenedor
    const element = useSignal<HTMLDivElement>();

    /**
     * Actualiza la altura del elemento según su contenido y el estado "expanded".
     */
    const updateElementHeight = $(() => {
        if (element.value) {
            element.value.style.height = expanded ? `${element.value.scrollHeight}px` : '0px';
        }
    });

    // Se ejecuta cuando cambia el estado "expanded"
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
        track(() => expanded);
        updateElementHeight();
    });

    // Se actualiza la altura del elemento en cada cambio de tamaño de la ventana
    useOnWindow(
        'resize',
        $(() => {
            if (element.value) {
                element.value.style.maxHeight = '0';
                updateElementHeight();
                element.value.style.maxHeight = '';
            }
        })
    );

    return (
        <div
            id={id}
            ref={element}
            aria-hidden={!expanded}
            class={clsx(
                '!m-0 origin-top duration-200 transition-all',
                !expanded && 'invisible h-0 -translate-y-2 scale-y-75 opacity-0',
                className
            )}
        >
            <Slot />
        </div>
    );
});
