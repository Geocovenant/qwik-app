import { component$, useSignal, type QRL } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';
import { Select as SelectFlowbite } from 'flowbite-qwik'

type SelectProps = {
    ref: QRL<(element: HTMLSelectElement) => void>;
    name: string;
    value: string | number | readonly string[] | undefined;
    onInput$: (event: Event, element: HTMLSelectElement) => void;
    onChange$: (event: Event, element: HTMLSelectElement) => void;
    onBlur$: (event: Event, element: HTMLSelectElement) => void;
    options: { name: string; value: string }[];
    multiple?: boolean;
    size?: number;
    placeholder?: string;
    required?: boolean;
    class?: string;
    label?: string;
    error?: string;
};

export const Select = component$(
    (props: SelectProps) => {
        const selected = useSignal('')
        return (
            <div class={clsx('', props.class)}>
                <div class="relative flex items-center">
                    <SelectFlowbite
                        {...props}
                        bind:value={selected}
                        label={props.label}
                        options={props.options}
                    />
                </div>
                <InputError name={props.name} error={props.error} />
            </div>
        );
    }
);
