import { component$, type QRL } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';
import { capitalizeFirst } from '~/utils/capitalizeFirst';

export type TextAreaProps = {
    /** Input name, used for id and accessibility attributes */
    name: string;
    /** Descriptive label for the textarea */
    label?: string;
    /** Textarea placeholder */
    placeholder?: string;
    /** Current value */
    value?: string;
    /** Error message (if any) */
    error?: string;
    /** Indicates if the field is required */
    required?: boolean;
    /** Additional CSS class */
    class?: string;
    /** Maximum allowed length */
    maxLength?: number;
    /** Number of rows to display */
    rows?: number;
    /** Autofocus when rendering */
    autofocus?: boolean;
    /** Whether to hide the textarea */
    hidden?: boolean;
    /** Reference to the element to integrate with Modular Forms */
    ref?: QRL<(element: HTMLTextAreaElement) => void>;
    /** onInput event */
    onInput$?: (event: Event, element: HTMLTextAreaElement) => void;
    /** onChange event */
    onChange$?: (event: Event, element: HTMLTextAreaElement) => void;
    /** onBlur event */
    onBlur$?: (event: Event, element: HTMLTextAreaElement) => void;
};

export const TextArea = component$(
    ({
        label,
        name,
        error,
        rows = 4,
        ...props
    }: TextAreaProps) => {
        return (
            <div
                class={clsx(
                    'w-full space-y-1 relative',
                    props.hidden && 'hidden'
                )}
            >
                <textarea
                    {...props}
                    name={name}
                    id={name}
                    rows={rows}
                    aria-invalid={!!error}
                    aria-errormessage={`${name}-error`}
                    class={clsx(
                        'w-full bg-background dark:bg-background',
                        'border-2 rounded-lg pt-8 pb-2 px-3 focus:outline-none transition-all duration-200',
                        'text-foreground dark:text-foreground placeholder:text-muted-foreground/60',
                        'resize-none',
                        error
                            ? 'border-destructive focus:border-destructive'
                            : 'border-input hover:border-muted-foreground/50 focus:border-primary',
                        props.class
                    )}
                />
                {label && (
                    <div class={clsx(
                        "absolute top-2 left-3 text-sm pointer-events-none transition-colors duration-200",
                        error ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                        {capitalizeFirst(label)}
                        {props.required && <span class="text-destructive ml-1">*</span>}
                    </div>
                )}
                {props.value !== undefined && props.maxLength && (
                    <div class="absolute top-2 right-3 text-sm text-muted-foreground">
                        {props.value.length} / {props.maxLength}
                    </div>
                )}
                <InputError name={name} error={error} />
            </div>
        );
    }
);
