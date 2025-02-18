import { component$ } from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import { type FormStore, reset } from '@modular-forms/qwik';
import { ActionButton } from './ActionButton';
import { _ } from 'compiled-i18n';

export type FormFooterProps = {
    /** FormStore de Modular Forms para interactuar con el formulario */
    of: FormStore<any, any>;
    /** Acción opcional para resetear el formulario */
    resetAction?: ActionStore<object, Record<string, any>, true>;
    /** Atributo form para asociar el botón a un formulario concreto (opcional) */
    form?: string;
};

/**
 * Pie de formulario que incluye un botón de submit y, si se proporciona, uno de reset.
 * Utiliza el ActionButton para mantener consistencia en el estilo y la funcionalidad.
 */
export const FormFooter = component$(
    ({ of: formStore, resetAction, form }: FormFooterProps) => {
        return (
            <footer class="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
                {/* Botón de Submit */}
                <ActionButton
                    class="w-full md:w-auto"
                    variant="primary"
                    label={_`Submit`}
                    type="submit"
                    form={form}
                />

                {/* Botón de Reset, se muestra solo si se proporciona la acción de reset */}
                {resetAction && (
                    <ActionButton
                        class="w-full md:w-auto"
                        variant="secondary"
                        label={_`Reset`}
                        type="button"
                        preventdefault:click
                        onClick$={() => reset(formStore)}
                    />
                )}
            </footer>
        );
    }
);
