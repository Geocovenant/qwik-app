import { component$, useSignal, useStylesScoped$, useComputed$ } from "@builder.io/qwik";
import { LuCheck, LuChevronDown, LuX } from "@qwikest/icons/lucide";
import { dataArray as countries } from "~/data/countries";
import type { PropFunction } from "@builder.io/qwik";
import { InputError } from "./InputError";
import styles from './MultiCountryCombobox.css?inline';

export interface MultiCountryComboboxProps {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  value?: string[] | string;
  onChange$?: PropFunction<(value: string[]) => void>;
  onBlur$?: PropFunction<(event: Event, element: HTMLInputElement) => void>;
  onInput$?: PropFunction<(event: Event, element: HTMLInputElement) => void>;
}

export const MultiCountryCombobox = component$<MultiCountryComboboxProps>(({
  name,
  label = "Select Countries",
  error,
  required,
  value = [],
  onChange$,
  onBlur$,
  onInput$
}) => {
  useStylesScoped$(styles);
  
  const searchText = useSignal<string>('');
  const selected = useSignal<string[]>(Array.isArray(value) ? value : value ? [value] : []);
  const inputRef = useSignal<HTMLInputElement>();
  const showDropdown = useSignal<boolean>(false);

  // Mapea los países para mostrarlos con bandera
  const countryOptions = countries.map(c => ({
    value: c.cca2,
    label: `${c.flag} ${c.name}`
  }));

  // Usar useComputed$ en lugar de $() para el filtrado
  const filteredCountries = useComputed$(() => {
    if (!searchText.value) return countryOptions;
    return countryOptions.filter(c => 
      c.label.toLowerCase().includes(searchText.value.toLowerCase())
    );
  });

  return (
    <div class="space-y-2 country-combobox-wrapper">
      {label && (
        <div class="flex items-center gap-1">
          <label class="text-sm font-medium text-foreground">
            {label}
            {required && <span class="text-destructive ml-1">*</span>}
          </label>
        </div>
      )}
      
      {/* Campo oculto para el formulario */}
      <select 
        name={name} 
        class="sr-only" 
        aria-hidden="true" 
        multiple
        value={selected.value}
      >
        {selected.value.map(val => (
          <option key={val} value={val} selected>{val}</option>
        ))}
      </select>
      
      {/* Países seleccionados - mostrados como pills arriba del control */}
      {selected.value.length > 0 && (
        <div class="country-selected-container mb-2 flex flex-wrap gap-2">
          {selected.value.map((item) => {
            const country = countryOptions.find(c => c.value === item);
            const displayText = country?.label || item;
            
            return (
              <div class="country-pill bg-primary/10 text-primary text-sm px-2 py-1 rounded-full flex items-center" key={item}>
                <span>{displayText}</span>
                <button 
                  type="button"
                  class="ml-1 hover:text-destructive transition-colors"
                  onClick$={() => {
                    const newValue = selected.value.filter(val => val !== item);
                    selected.value = newValue;
                    if (onChange$) {
                      onChange$(newValue);
                    }
                  }}
                >
                  <LuX aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Control de búsqueda */}
      <div class="relative">
        <div class="country-combobox-control flex items-center p-2 border rounded-md">
          <input
            class="flex-1 outline-none bg-transparent p-1"
            ref={inputRef}
            value={searchText.value}
            placeholder="Buscar países..."
            onFocus$={() => {
              showDropdown.value = true;
            }}
            onBlur$={(e) => {
              // Delay para permitir el clic en las opciones
              setTimeout(() => {
                showDropdown.value = false;
              }, 200);
              if (onBlur$) onBlur$(e, e.target as HTMLInputElement);
            }}
            onInput$={(e) => {
              setTimeout(() => {
                searchText.value = (e.target as HTMLInputElement).value;
                if (onInput$) onInput$(e, e.target as HTMLInputElement);
              }, 200);
            }}
            onKeyUp$={() => {
              showDropdown.value = true;
            }}
          />
          
          <button 
            type="button" 
            class="p-1 text-muted-foreground"
            onClick$={() => {
              showDropdown.value = !showDropdown.value;
              if (showDropdown.value) {
                inputRef.value?.focus();
              }
            }}
          >
            <LuChevronDown />
          </button>
        </div>
        
        {/* Dropdown de países */}
        {showDropdown.value && (
          <div class="country-dropdown absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredCountries.value.length > 0 ? (
              filteredCountries.value.map((country) => (
                <div
                  key={country.value}
                  class={`px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-muted/50 ${selected.value.includes(country.value) ? 'bg-primary/10' : ''}`}
                  onClick$={() => {
                    let newValue;
                    if (!selected.value.includes(country.value)) {
                      newValue = [...selected.value, country.value];
                    } else {
                      newValue = selected.value.filter(val => val !== country.value);
                    }
                    selected.value = newValue;
                    if (onChange$) {
                      onChange$(newValue);
                    }
                    searchText.value = '';
                    inputRef.value?.focus();
                  }}
                >
                  <span>{country.label}</span>
                  {selected.value.includes(country.value) && (
                    <LuCheck class="text-primary" />
                  )}
                </div>
              ))
            ) : (
              <div class="px-3 py-2 text-muted-foreground">
                No se encontraron países
              </div>
            )}
          </div>
        )}
      </div>
      
      <InputError name={name} error={error} />
    </div>
  );
}); 