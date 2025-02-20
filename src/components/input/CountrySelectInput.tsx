import { $, component$, useSignal } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';
import { InputError } from './InputError';
import { capitalizeFirst } from '~/utils/capitalizeFirst';
import clsx from 'clsx';

type CountryOption = {
    value: string;
    name: string;
};

export type CountrySelectInputProps = {
    name: string;
    label?: string;
    error?: string;
    required?: boolean;
    form: any;
    predefinedCountries: CountryOption[];
    onInput$?: PropFunction<(event: Event, element: HTMLSelectElement) => void>;
    onChange$?: PropFunction<(event: Event, element: HTMLSelectElement) => void>;
    onBlur$?: PropFunction<(event: Event, element: HTMLSelectElement) => void>;
};

export const CountrySelectInput = component$((props: CountrySelectInputProps) => {
    const { name, label, error, required, predefinedCountries, form } = props;

    const searchTerm = useSignal('');
    const showDropdown = useSignal(false);

    const filteredCountries = predefinedCountries.filter(country => 
        country.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );

    const handleSelect = $((country: CountryOption) => {
        const selectedCountries = form.internal.fields[name]?.value || [];
        if (!selectedCountries.includes(country.value)) {
            form.internal.fields[name].value = [...selectedCountries, country.value];
        }
        showDropdown.value = false;
        searchTerm.value = '';
    });

    const handleRemove = $((countryValue: string) => {
        const selectedCountries = form.internal.fields[name]?.value || [];
        form.internal.fields[name].value = selectedCountries.filter((value: string) => value !== countryValue);
    });

    const handleKeyDown = $((e: KeyboardEvent) => {
        if (e.key === 'Enter' && searchTerm.value && filteredCountries.length > 0) {
            e.preventDefault();
            handleSelect(filteredCountries[0]);
        }
    });

    const selectedCountries = form.internal.fields[name]?.value || [];

    return (
        <div class="space-y-2">
            {label && (
                <div class="flex items-center gap-1">
                    <span class="text-sm text-foreground">{capitalizeFirst(label)}</span>
                    {required && <span class="text-destructive">*</span>}
                </div>
            )}

            {/* Selected countries chips */}
            <div class="flex flex-wrap gap-2 mb-2">
                {selectedCountries.map((countryValue: string) => {
                    const country = predefinedCountries.find(c => c.value === countryValue);
                    if (!country) return null;
                    return (
                        <div 
                            key={country.value}
                            class="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full"
                        >
                            <span>{country.name}</span>
                            <button 
                                type="button"
                                class="hover:text-destructive transition-colors"
                                onClick$={() => handleRemove(country.value)}
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Search input */}
            <div class="relative">
                <input
                    type="text"
                    class={clsx(
                        "w-full h-12 bg-background",
                        "border rounded-lg px-3 focus:outline-none transition-all duration-200",
                        "text-foreground placeholder:text-muted-foreground/60",
                        error
                            ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                            : "border-input hover:border-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    )}
                    placeholder="Search countries..."
                    value={searchTerm.value}
                    onFocus$={() => showDropdown.value = true}
                    onInput$={(e) => searchTerm.value = (e.target as HTMLInputElement).value}
                    onKeyDown$={handleKeyDown}
                />

                {/* Dropdown arrow */}
                <div class="absolute top-1/2 -translate-y-1/2 right-3 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                    </svg>
                </div>
            </div>

            {/* Dropdown */}
            {showDropdown.value && (
                <div 
                    class="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    onBlur$={() => {
                        setTimeout(() => {
                            showDropdown.value = false;
                            searchTerm.value = '';
                        }, 200);
                    }}
                >
                    {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                            <div
                                key={country.value}
                                class={clsx(
                                    "px-3 py-2 cursor-pointer flex items-center gap-2",
                                    "hover:bg-muted/50 transition-colors",
                                    selectedCountries.includes(country.value) && "bg-primary/10"
                                )}
                                onClick$={() => handleSelect(country)}
                            >
                                {country.name}
                            </div>
                        ))
                    ) : (
                        <div class="px-3 py-2 text-muted-foreground">
                            No countries found
                        </div>
                    )}
                </div>
            )}

            <InputError name={name} error={error} />
        </div>
    );
});
