import { type QRL, component$, useSignal } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';

type SelectProps = {
    ref: QRL<(element: HTMLSelectElement) => void>;
    name: string;
    value: string | number | readonly string[] | undefined;
    onInput$: QRL<(event: Event, element: HTMLSelectElement) => void>;
    onChange$: QRL<(event: Event, element: HTMLSelectElement) => void>;
    onBlur$: QRL<(event: Event, element: HTMLSelectElement) => void>;
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
        const searchTerm = useSignal('');
        const showDropdown = useSignal(false);

        const filteredOptions = props.options.filter(option => 
            option.name.toLowerCase().includes(searchTerm.value.toLowerCase())
        );

        return (
            <div class={clsx('relative', props.class)}>
                {props.label && (
                    <div class="flex items-center gap-1 mb-2">
                        <span class="text-sm text-foreground">{props.label}</span>
                        {props.required && <span class="text-destructive">*</span>}
                    </div>
                )}

                <div class="relative">
                    <input
                        type="text"
                        class={clsx(
                            "w-full h-12 bg-background",
                            "border rounded-lg px-3 focus:outline-none transition-all duration-200",
                            "text-foreground placeholder:text-muted-foreground/60",
                            props.error
                                ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                                : "border-input hover:border-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        )}
                        placeholder={props.placeholder || "Buscar..."}
                        value={searchTerm.value}
                        onFocus$={() => showDropdown.value = true}
                        onInput$={(e) => searchTerm.value = (e.target as HTMLInputElement).value}
                    />

                    <div 
                        class="absolute top-1/2 -translate-y-1/2 right-3 text-muted-foreground cursor-pointer"
                        onClick$={() => showDropdown.value = !showDropdown.value}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m6 9 6 6 6-6"/>
                        </svg>
                    </div>
                </div>

                {/* Select nativo oculto para modular-forms */}
                <select
                    {...props}
                    class="sr-only"
                    aria-hidden="true"
                >
                    <option value="">Seleccionar...</option>
                    {props.options.map(({ name, value }) => (
                        <option 
                            key={value} 
                            value={value}
                            selected={value === props.value}
                        >
                            {name}
                        </option>
                    ))}
                </select>

                {/* Dropdown personalizado */}
                {showDropdown.value && (
                    <div class="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    class={clsx(
                                        "px-3 py-2 cursor-pointer flex items-center gap-2",
                                        "hover:bg-muted/50 transition-colors",
                                        option.value === props.value && "bg-primary/10"
                                    )}
                                    onClick$={() => {
                                        const selectElement = document.querySelector(`select[name="${props.name}"]`) as HTMLSelectElement;
                                        selectElement.value = option.value;
                                        selectElement.dispatchEvent(new Event('input', { bubbles: true }));
                                        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                                        showDropdown.value = false;
                                    }}
                                >
                                    {option.name}
                                </div>
                            ))
                        ) : (
                            <div class="px-3 py-2 text-muted-foreground">
                                No se encontraron resultados
                            </div>
                        )}
                    </div>
                )}

                <InputError name={props.name} error={props.error} />
            </div>
        );
    }
);
