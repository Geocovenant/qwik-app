import { $, component$, useSignal } from '@builder.io/qwik';
import { _ } from 'compiled-i18n';
import { InputLabel } from './InputLabel';
import { getValue, setValue } from '@modular-forms/qwik';
import { Select } from 'flowbite-qwik';

interface CountrySelectProps {
    error?: string;
    form: any;
    name: string;
    label?: string;
    predefinedCountries: { name: string; value: string }[];
}

export const CountrySelectInput = component$<CountrySelectProps>((props) => {
    const selectedValue = useSignal('');

    const addCountry = $((countryCode: string) => {
        const currentValue = (getValue(props.form, props.name) as string[]);
        if (countryCode && !currentValue.includes(countryCode)) {
            setValue(props.form, props.name, [...currentValue, countryCode]);
        }
    });

    const removeCountry = $((countryCode: string) => {
        const currentValue = (getValue(props.form, props.name) as string[]);
        setValue(props.form, props.name, currentValue.filter((c) => c !== countryCode));
    });

    const handleSelectChange = $((event: Event, element: HTMLSelectElement) => {
        console.log('handleSelectChange')
        console.log('event', event)
        console.log('element', element)
        const selectedCountry = element.value;
        console.log('selectedCountry', selectedCountry)
        if (selectedCountry) {
            addCountry(selectedCountry);
            // Resetear el valor del select
            selectedValue.value = '';
        }
    });

    const value = getValue(props.form, props.name) as string[];

    return (
        <div>
            {props.label && <InputLabel name={props.name} label={props.label} />}

            {/* Países seleccionados como badges */}
            <div class="flex items-center gap-2 flex-wrap mb-2">
                {Array.isArray(value) && value.map((countryCode) => {
                    const country = props.predefinedCountries.find((c) => c.value === countryCode);
                    return (
                        <span
                            key={countryCode}
                            class="flex items-center bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium"
                        >
                            {country?.name || countryCode}
                            <button
                                type="button"
                                class="ml-2 text-blue-700 hover:text-blue-900"
                                onClick$={() => removeCountry(countryCode)}
                            >
                                ✕
                            </button>
                        </span>
                    );
                })}
            </div>

            <Select
                bind:value={selectedValue}
                options={props.predefinedCountries}
                placeholder={_`Select a country`}
                // onChange$={handleSelectChange}
                onInput$={handleSelectChange}
            />

            {props.error && <div class="text-red-500 text-sm mt-1">{props.error}</div>}
        </div>
    );
});
