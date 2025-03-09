import { component$ } from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import { type FormStore, reset } from '@modular-forms/qwik';
import { ActionButton } from './ActionButton';
import { _ } from 'compiled-i18n';

export type FormFooterProps = {
    /** FormStore from Modular Forms to interact with the form */
    of: FormStore<any, any>;
    /** Optional action to reset the form */
    resetAction?: ActionStore<object, Record<string, any>, true>;
    /** Form attribute to associate the button with a specific form (optional) */
    form?: string;
};

/**
 * Footer of the form that includes a submit button and, if provided, a reset button.
 * Uses the ActionButton to maintain consistency in style and functionality.
 */
export const FormFooter = component$(
    ({ of: formStore, resetAction, form }: FormFooterProps) => {
        return (
            <footer class="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
                {/* Submit Button */}
                <ActionButton
                    class="w-full md:w-auto"
                    variant="primary"
                    label={_`Submit`}
                    type="submit"
                    form={form}
                />

                {/* Reset Button, shown only if the reset action is provided */}
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
