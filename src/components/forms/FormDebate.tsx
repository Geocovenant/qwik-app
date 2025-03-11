import { $, component$, useSignal, useTask$ } from '@builder.io/qwik';
import { useForm, valiForm$, setValue } from '@modular-forms/qwik';
import { TextInput } from '~/components/input/TextInput';
import { TextArea } from '~/components/input/TextArea';
import { FormFooter } from '~/components/forms/FormFooter';
import { CustomToggle } from '~/components/input/CustomToggle';
import { _ } from 'compiled-i18n';
import { CommunityType } from '~/constants/communityType';
import type { DebateForm, DebateResponseData } from '~/schemas/debateSchema';
import { DebateSchema } from '~/schemas/debateSchema';
import { TagInput } from '~/components/input/TagInput';
import { dataArray as countries } from "~/data/countries";
import { Select } from '~/components/ui';
import { MultiCountryCombobox } from '~/components/input/MultiCountryCombobox';

import { useFormDebateLoader } from '~/shared/forms/loaders';
import { useFormDebateAction } from '~/shared/forms/actions';

export interface FormDebateProps {
  onSubmitCompleted: () => void;
  defaultScope?: CommunityType;
  defaultCountry?: string;
  defaultRegionId?: number;
  defaultSubregionId?: number;
  regions?: any[];
  subregions?: any[];
  tags: { id: string, name: string }[];
}

export default component$<FormDebateProps>(({
  onSubmitCompleted,
  defaultCountry = null,
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

  const isAnonymous = useSignal<boolean>(false);

  const handleSubmit = $(() => {
    // eslint-disable-next-line qwik/valid-lexical-scope
    onSubmitCompleted()
  });

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
                  <MultiCountryCombobox
                    {...props}
                    label={_`Select countries`}
                    value={field.value}
                    error={field.error}
                    onChange$={$((value) => {
                      setValue(debateForm, 'community_ids', value);
                    })}
                  />
                </div>
              );

            case CommunityType.NATIONAL:
              return (
                <div class="space-y-2">
                  <Select.Root
                    onChange$={$((value: string) => {
                      setValue(debateForm, 'community_ids', [value]);
                    })}
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
                  <Select.Root {...props} value={defaultRegionId?.toString()}>
                    <Select.Label>{_`Select a region`}</Select.Label>
                    <Select.Trigger>
                      <Select.DisplayValue placeholder={_`Select region...`} />
                    </Select.Trigger>
                    <Select.Popover>
                      {regions.length > 0 ? regions.map((region) => (
                        <Select.Item key={region.id} value={region.community_id.toString()}>
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
                  <Select.Root
                    onChange$={$((value: string) => {
                      setValue(debateForm, 'community_ids', [value]);
                    })}
                    value={defaultSubregionId ? defaultSubregionId.toString() : undefined}
                  >
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

      {/* <div class="space-y-4">
        <Field name="image" type="File">
          {(field, props) => (
            <FileInput
              {...props}
              value={field.value}
              error={field.error}
              label="File item"
            />
          )}
        </Field>
      </div> */}

      {/* Additional Settings Section */}
      <div class="space-y-4">
        <h2 class="font-medium text-foreground">{_`Additional Settings`}</h2>

        <div class="space-y-4">
          <CustomToggle
            label={_`Anonymous debate`}
            checked={isAnonymous.value}
            onChange$={$((checked) => {
              isAnonymous.value = checked;
              setValue(debateForm, 'is_anonymous', checked);
            })}
          />
          <Field name="is_anonymous" type="boolean">
            {(field, props) => (
              <input type="hidden" {...props} value={field.value ? 'true' : 'false'} />
            )}
          </Field>
          <p class="mt-2 text-sm text-muted-foreground">
            {debateForm.internal.fields.is_anonymous?.value
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