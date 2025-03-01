import { $, component$, useComputed$, useSignal, useTask$ } from '@builder.io/qwik';
import { useForm, valiForm$, setValue } from '@modular-forms/qwik';
import { TextInput } from '~/components/input/TextInput';
import { TextArea } from '~/components/input/TextArea';
import { FormFooter } from '~/components/forms/FormFooter';
import { CustomToggle } from '~/components/input/CustomToggle';
import { _ } from 'compiled-i18n';
import { CommunityType } from '~/constants/communityType';
import type { DebateForm } from '~/schemas/debateSchema';
import { DebateSchema } from '~/schemas/debateSchema';
import { useFormDebateLoader } from '~/shared/loaders';
import { useFormDebateAction, type DebateResponseData } from '~/shared/actions';
import { TagInput } from '~/components/input/TagInput';
import { CountrySelectInput } from '~/components/input/CountrySelectInput';
import { dataArray as countries } from "~/data/countries";
import { Select } from '~/components/ui';
import { useLocation } from '@builder.io/qwik-city';

export interface FormDebateProps {
  onSubmitCompleted: () => void;
  defaultScope?: CommunityType;
  defaultRegionId?: number;
  defaultSubregionId?: number;
  regions?: any[];
  subregions?: any[];
  tags: { id: string, name: string }[];
}

export default component$<FormDebateProps>(({
  onSubmitCompleted,
  defaultScope = CommunityType.NATIONAL,
  defaultRegionId = null,
  defaultSubregionId = null,
  tags = [],
  regions = [],
  subregions = [],
}) => {
  const [debateForm, { Form, Field }] = useForm<DebateForm, DebateResponseData>({
    loader: useFormDebateLoader(),
    action: useFormDebateAction(),
    validate: valiForm$(DebateSchema)
  });

  useTask$(({ track }) => {
    const scope = track(() => defaultScope);
    setValue(debateForm, 'scope', scope.toUpperCase());

    // Clear community_ids when scope changes
    setValue(debateForm, 'community_ids',
      scope === CommunityType.GLOBAL ? ['1'] : []
    );
  });

  // Update community_ids when region or subregion changes
  useTask$(({ track }) => {
    track(() => defaultScope);
    track(() => defaultRegionId);
    track(() => defaultSubregionId);

    if (defaultScope === CommunityType.REGIONAL && defaultRegionId) {
      setValue(debateForm, 'community_ids', [defaultRegionId.toString()]);
    }

    if (defaultScope === CommunityType.SUBREGIONAL && defaultSubregionId) {
      setValue(debateForm, 'community_ids', [defaultSubregionId.toString()]);
    }
  });

  const isAnonymous = useSignal(false);
  const location = useLocation();
  const nationName = location.params.nation;
  const defaultCountry = useComputed$(() => {
    if (!nationName) return null;
    return countries.find(country =>
      country.name.toLowerCase() === nationName.toLowerCase()
    );
  });

  // Establecer el país por defecto cuando se monta el componente
  useTask$(({ track }) => {
    const country = track(() => defaultCountry.value);
    if (country) {
      setValue(debateForm, 'community_ids', [country.cca2]);
    }
  });

  // Update is_anonymous when toggle changes
  useTask$(({ track }) => {
    const anonymousValue = track(() => isAnonymous.value);
    setValue(debateForm, 'is_anonymous', anonymousValue);
  });

  const handleSubmit = $((values: DebateForm, event: any) => {
    console.log('Submitting Debate form:', values);
    console.log('event', event);
    // eslint-disable-next-line qwik/valid-lexical-scope
    onSubmitCompleted()
    // Here you can perform the submit action (client-side or progressively enhanced with action)
  });

  const countriesOptions = countries.map(c => ({
    value: c.cca2,
    name: `${c.flag} ${c.name}`
  }))

  return (
    <Form onSubmit$={handleSubmit} class="space-y-6">
      {/* Debate type indicator */}
      {defaultScope === CommunityType.GLOBAL && (
        <div class="flex items-center gap-2 mb-4">
          <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
            {_`Global debate`}
          </div>
          <span class="text-sm text-muted-foreground">
            {_`This debate will be visible to all Geounity users`}
          </span>
        </div>
      )}
      {defaultScope === CommunityType.INTERNATIONAL && (
        <div class="flex items-center gap-2 mb-4">
          <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
            {_`International debate`}
          </div>
          <span class="text-sm text-muted-foreground">
            {_`This debate will be visible to users from selected countries`}
          </span>
        </div>
      )}
      {defaultScope === CommunityType.NATIONAL && (
        <div class="flex items-center gap-2 mb-4">
          <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
            {_`National debate`}
          </div>
          <span class="text-sm text-muted-foreground">
            {_`This debate will be visible to users from selected country`}
          </span>
        </div>
      )}
      {defaultScope === CommunityType.REGIONAL && (
        <div class="flex items-center gap-2 mb-4">
          <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
            {_`Regional debate`}
          </div>
          <span class="text-sm text-muted-foreground">
            {_`This debate will be visible to users from selected region`}
          </span>
        </div>
      )}

      {/* Hidden field for scope */}
      <Field name="scope">
        {(field, props) => (
          <input
            type="hidden"
            {...props}
            value={defaultScope}
          />
        )}
      </Field>

      {/* Hidden field for community_ids */}
      <Field name="community_ids" type="string[]">
        {(field, props) => {
          switch (defaultScope) {
            case CommunityType.GLOBAL:
              return <input type="hidden" {...props} value="1" />;

            case CommunityType.INTERNATIONAL:
              return (
                <div class="space-y-2">
                  <CountrySelectInput
                    {...props}
                    form={debateForm}
                    label={_`Countries involved`}
                    predefinedCountries={countriesOptions}
                    error={field.error}
                  />
                </div>
              );

            case CommunityType.NATIONAL:
              return (
                <div class="space-y-2">
                  <Select.Root
                    {...props}
                    value={defaultCountry.value?.cca2 || (Array.isArray(field.value) ? field.value[0] : field.value)}
                  >
                    <Select.Label>{_`Select a country`}</Select.Label>
                    <Select.Trigger>
                      <Select.DisplayValue placeholder={_`Search country...`} />
                    </Select.Trigger>
                    <Select.Popover>
                      {countries.map((country) => (
                        <Select.Item key={country.cca2} value={country.cca2}>
                          <Select.ItemLabel>
                            {`${country.flag} ${country.name}`}
                          </Select.ItemLabel>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Popover>
                  </Select.Root>
                  {field.error && (
                    <div class="text-sm text-destructive">{field.error}</div>
                  )}
                </div>
              );

            case CommunityType.REGIONAL:
              return (
                <div class="space-y-2">
                  <Select.Root {...props} value={defaultRegionId ? defaultRegionId.toString() : undefined}>
                    <Select.Label>{_`Select a region`}</Select.Label>
                    <Select.Trigger>
                      <Select.DisplayValue placeholder={_`Select region...`} />
                    </Select.Trigger>
                    <Select.Popover>
                      {regions.length > 0 ? regions.map((region) => (
                        <Select.Item key={region.id} value={region.id}>
                          <Select.ItemLabel>
                            {region.name}
                          </Select.ItemLabel>
                          <Select.ItemIndicator />
                        </Select.Item>
                      )) : (
                        <Select.Item value="placeholder">
                          <Select.ItemLabel>{_`No region available`}</Select.ItemLabel>
                          <Select.ItemIndicator />
                        </Select.Item>
                      )}
                    </Select.Popover>
                  </Select.Root>
                  {field.error && (
                    <div class="text-sm text-destructive">{field.error}</div>
                  )}
                </div>
              );

            case CommunityType.SUBREGIONAL:
              return (
                <div class="space-y-2">
                  <Select.Root {...props} value={defaultSubregionId ? defaultSubregionId.toString() : undefined}>
                    <Select.Label>{_`Select a region`}</Select.Label>
                    <Select.Trigger>
                      <Select.DisplayValue placeholder={_`Select subregion...`} />
                    </Select.Trigger>
                    <Select.Popover>
                      {subregions.length > 0 ? subregions.map((subregion) => (
                        <Select.Item key={subregion.id} value={subregion.id}>
                          <Select.ItemLabel>
                            {subregion.name}
                          </Select.ItemLabel>
                          <Select.ItemIndicator />
                        </Select.Item>
                      )) : (
                        <Select.Item value="placeholder">
                          <Select.ItemLabel>{_`No subregion available`}</Select.ItemLabel>
                          <Select.ItemIndicator />
                        </Select.Item>
                      )}
                    </Select.Popover>
                  </Select.Root>
                  {field.error && (
                    <div class="text-sm text-destructive">{field.error}</div>
                  )}
                </div>
              );

            default:
              return null;
          }
        }}
      </Field>

      {/* Debate content */}
      <div class="space-y-4">
        <h2 class="font-medium text-foreground">{_`Debate Content`}</h2>
        <Field name="title">
          {(field, props) => (
            <TextInput
              {...props}
              label={_`Title`}
              placeholder={_`Enter a clear and concise title`}
              required
              value={field.value}
              error={field.error}
              maxLength={150}
            />
          )}
        </Field>

        <Field name="description">
          {(field, props) => (
            <TextArea
              {...props}
              label={_`Description`}
              placeholder={_`Provide detailed information about the debate topic`}
              value={field.value}
              error={field.error}
              maxLength={2000}
              rows={6}
            />
          )}
        </Field>
      </div>

      {/* TAGS */}
      <div class="space-y-4">
        <h2 class="font-medium text-foreground">{_`Categorization`}</h2>
        <Field name="tags" type="string[]">
          {(field, props) => (
            <TagInput
              {...props}
              error={field.error}
              form={debateForm}
              label={_`Tags`}
              predefinedTags={tags}
            />
          )}
        </Field>
      </div>

      {/* Additional settings */}
      <div class="space-y-4">
        <h2 class="font-medium text-foreground">{_`Additional Settings`}</h2>
        <div class="pt-4 border-t">
          <CustomToggle
            label={_`Anonymous debate`}
            checked={isAnonymous.value}
            onChange$={$((checked) => {
              isAnonymous.value = checked;
            })}
          />
          <Field name="is_anonymous" type="boolean">
            {(field, props) => (
              <input type="hidden" {...props} value={isAnonymous.value ? 'true' : 'false'} />
            )}
          </Field>
          <p class="mt-2 text-sm text-muted-foreground">
            {isAnonymous.value
              ? _`Your identity will be hidden as debate creator.`
              : _`Your username will be visible as debate creator.`}
          </p>
        </div>
      </div>

      {/* Form footer */}
      <div class="sticky bottom-0 bg-background py-4 border-t mt-4">
        <FormFooter of={debateForm} />
      </div>
    </Form>
  );
}); 