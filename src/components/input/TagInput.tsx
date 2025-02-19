import { $, component$, useSignal } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';
import { getValue, setValue } from '@modular-forms/qwik';

interface TagInputProps {
    class?: string;
    error?: string;
    form: any;
    name: string;
    label?: string;
    predefinedTags: { id: string; name: string }[];
}

export const TagInput = component$<TagInputProps>((props) => {
    const inputValue = useSignal('');

    // Get the current value from the form
    const value = getValue(props.form, props.name) as string[];

    // Add a new tag if it doesn't already exist
    const addTag = $((tag: string) => {
        const currentValue = getValue(props.form, props.name) || [];
        if (
            tag &&
            Array.isArray(currentValue) &&
            currentValue.every((t) => typeof t === 'string') &&
            !currentValue.includes(tag)
        ) {
            setValue(props.form, props.name, [...currentValue, tag]);
            inputValue.value = '';
        }
    });

    // Remove a tag from the list
    const removeTag = $((tag: string) => {
        if (Array.isArray(value)) {
            setValue(props.form, props.name, value.filter((t: string) => t !== tag));
        }
    });

    // Handle the 'Enter' or ',' key press to add a tag
    const handleKeyDown = $((event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addTag(inputValue.value.trim());
        }
    });

    return (
        <div class={clsx('w-full space-y-2')}>
            {/* Label */}
            {props.label && (
                <label
                    for={props.name}
                    class={clsx('block text-sm font-medium', props.error ? 'text-red-500' : 'text-gray-700')}
                >
                    {props.label}
                </label>
            )}

            {/* Input */}
            <div class="relative">
                <input
                    type="text"
                    id={props.name}
                    // @ts-ignore
                    list={`${props.name}-list`}
                    value={inputValue.value}
                    onInput$={(e) => (inputValue.value = (e.target as HTMLInputElement).value)}
                    onKeyDown$={handleKeyDown}
                    placeholder="Add a tag and press Enter"
                    aria-invalid={!!props.error}
                    aria-errormessage={`${props.name}-error`}
                    class={clsx(
                        'w-full bg-white dark:bg-black text-black dark:text-white',
                        'border-2 rounded-sm pt-2 pb-2 px-3 focus:outline-none transition-colors duration-200',
                        props.error
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500',
                        props.class
                    )}
                />
                {/* Datalist for predefined tags */}
                <datalist id={`${props.name}-list`}>
                    {props.predefinedTags.map((tag) => (
                        <option key={tag.id} value={tag.name} />
                    ))}
                </datalist>
            </div>

            {/* Selected tags */}
            <div class="flex items-center gap-2 flex-wrap">
                {Array.isArray(value) &&
                    value.map((tag) => (
                        <span
                            key={tag}
                            class="flex items-center bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium"
                        >
                            {tag}
                            <button
                                type="button"
                                class="ml-2 text-blue-700 hover:text-blue-900"
                                onClick$={() => removeTag(tag)}
                            >
                                ✕
                            </button>
                        </span>
                    ))}
            </div>

            {/* Error message */}
            <InputError name={props.name} error={props.error} />
        </div>
    );
});
