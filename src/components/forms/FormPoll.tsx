import { $, component$, useSignal, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { useForm, valiForm$, insert, remove, setValue } from '@modular-forms/qwik';
import { TextInput } from '~/components/input/TextInput';
import { TextArea } from '~/components/input/TextArea';
import type { PollForm } from '~/schemas/pollSchema';
import { PollSchema } from '~/schemas/pollSchema';
import { FormFooter } from '~/components/forms/FormFooter';
import { PollType } from '~/constants/pollType';
import { CommunityType } from '~/constants/communityType';
import { dataArray as countries } from "~/data/countries";
import { Select, ToggleGroup } from '~/components/ui';
import { CustomToggle } from '~/components/input/CustomToggle';
import { TagInput } from '~/components/input/TagInput';
import { LuMinus } from '@qwikest/icons/lucide';
import { useFormPollAction } from '~/shared/forms/actions';
import type { PollResponseData } from '~/schemas/pollSchema';
import { _ } from 'compiled-i18n';
import { useFormPollLoader } from '~/shared/forms/loaders';
import { MultiCountryCombobox } from '../input/MultiCountryCombobox';

export interface FormPollProps {
    onSubmitCompleted: () => void;
    defaultScope?: CommunityType;
    defaultCountry?: string;
    defaultRegionId?: number;
    defaultSubregionId?: number;
    regions?: any[];
    subregions?: any[];
    tags?: { id: string, name: string }[];
}

export default component$<FormPollProps>(({ 
    onSubmitCompleted,
    defaultScope = CommunityType.NATIONAL,
    defaultCountry = null,
    defaultRegionId = null,
    defaultSubregionId = null,
    regions = [],
    subregions = [],
    tags = []
}) => {
    const [pollForm, { Form, Field, FieldArray }] = useForm<PollForm, PollResponseData>({
        loader: useFormPollLoader(),
        action: useFormPollAction(),
        fieldArrays: ['options'],
        validate: valiForm$(PollSchema)
    });
    console.log('pollForm', pollForm)

    // Control to show/hide end date
    const showEndDate = useSignal(false);

    // If toggle is deactivated, clear date field
    useTask$(({ track }) => {
        track(() => showEndDate.value);
        if (!showEndDate.value) {
            setValue(pollForm, 'ends_at', '');
        }
    });
    useTask$(({ track }) => {
        const scope = track(() => defaultScope);
        setValue(pollForm, 'scope', scope.toUpperCase());
        
        // Clear community_ids when scope changes
        setValue(pollForm, 'community_ids', 
            scope === CommunityType.GLOBAL ? ['1'] : []
        );
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
        track(() => defaultScope);
        track(() => defaultRegionId);
        track(() => defaultSubregionId);
        
        if (defaultScope === CommunityType.REGIONAL && defaultRegionId) {
            // Instead of assigning to provinces, we should use setValue for community_ids
            setValue(pollForm, 'community_ids', [defaultRegionId.toString()]);
        }

        if (defaultScope === CommunityType.SUBREGIONAL && defaultSubregionId) {
            setValue(pollForm, 'community_ids', [defaultSubregionId.toString()]);
        }
    });

    const isAnonymous = useSignal(false);

    const handleSubmit = $((values: PollForm, event: any) => {
        console.log('Submitting Poll form:', values);
        console.log('event', event);
        // eslint-disable-next-line qwik/valid-lexical-scope
        onSubmitCompleted()
        // Here you can perform the submit action (client-side or progressively enhanced with action)
    });

    return (
        <Form onSubmit$={handleSubmit} class="space-y-6">
            {/* Poll type indicator */}
            {defaultScope === CommunityType.GLOBAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`Global poll`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This poll will be visible to all Geounity users`}
                    </span>
                </div>
            )}
            {defaultScope === CommunityType.INTERNATIONAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`International poll`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This poll will be visible to users from selected countries`}
                    </span>
                </div>
            )}
            {defaultScope === CommunityType.NATIONAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`National poll`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This poll will be visible to users from selected country`}
                    </span>
                </div>
            )}
            {defaultScope === CommunityType.REGIONAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`Regional poll`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This poll will be visible to users from selected region`}
                    </span>
                </div>
            )}

            {/* Poll Settings Section */}
            <div class="space-y-4">
                {/* <h2 class="font-medium text-foreground">{_`Poll Settings`}</h2> */}
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
                                            setValue(pollForm, 'community_ids', value);
                                        })}
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
            </div>

            {/* Poll Content Section */}
            <div class="space-y-4">
                <h2 class="font-medium text-foreground">{_`Poll Content`}</h2>
                <Field name="title">
                    {(field, props) => (
                        <TextInput
                            {...props}
                            autofocus
                            label={_`Title`}
                            placeholder={_`Enter a clear and concise title`}
                            required
                            value={field.value}
                            error={field.error}
                            maxLength={100}
                        />
                    )}
                </Field>

                <Field name="description">
                    {(field, props) => (
                        <TextArea
                            {...props}
                            label={_`Description`}
                            placeholder={_`Provide additional context or details about your poll`}
                            value={field.value}
                            error={field.error}
                            maxLength={5000}
                        />
                    )}
                </Field>
            </div>

            {/* Poll Options Section */}
            <div class="space-y-2">
                <h2 class="font-medium text-foreground">{_`Poll Type`}</h2>
                <p class="text-sm text-muted-foreground">
                    {_`Select the type of poll you want to create. The type of poll will determine the number of options you can add.`}
                </p>
                <ToggleGroup.Root
                    value={pollForm.internal.fields.type?.value}
                    onChange$={(v: string) => {
                        console.log('v', v)
                        setValue(pollForm, 'type', v as PollType);
                    }}
                >
                    <ToggleGroup.Item value={PollType.BINARY} aria-label={_`Binary`} class="toggle">
                        {_`Binary`}
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value={PollType.SINGLE_CHOICE} aria-label={_`Single Choice`} class="toggle">
                        {_`Single Choice`}
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value={PollType.MULTIPLE_CHOICE} aria-label={_`Multiple Choice`} class="toggle">
                        {_`Multiple Choice`}
                    </ToggleGroup.Item>
                </ToggleGroup.Root>

                <div class="space-y-2">
                    {pollForm.internal.fields.type?.value === PollType.BINARY && (
                        <p class="text-sm text-muted-foreground">
                            {_`Binary polls have only two options, such as Yes or No.`}
                        </p>
                    )}
                    {pollForm.internal.fields.type?.value === PollType.SINGLE_CHOICE && (
                        <p class="text-sm text-muted-foreground">
                            {_`Single choice polls allow participants to select only one option.`}
                        </p>
                    )}
                    {pollForm.internal.fields.type?.value === PollType.MULTIPLE_CHOICE && (
                        <p class="text-sm text-muted-foreground">
                            {_`Multiple choice polls allow participants to select multiple options.`}
                        </p>
                    )}
                </div>

                <Field name="type">
                    {(field, props) => (
                        <input type="hidden" {...props} value={field.value} />
                    )}
                </Field>

                <FieldArray name="options">
                    {(fieldArray) => (
                        <div class="space-y-3">
                            {(pollForm.internal.fields.type?.value === PollType.BINARY 
                                ? fieldArray.items.slice(0, 2) 
                                : fieldArray.items).map((option, index) => (
                                    <div key={option} class="flex items-center gap-2">
                                        <Field name={`options.${index}`}>
                                            {(field, props) => (
                                                <div class="flex-1">
                                                    <TextInput
                                                        {...props}
                                                        label={_`Option ${index + 1}`}
                                                        placeholder={_`Enter option ${index + 1}`}
                                                        required
                                                        value={field.value}
                                                        error={field.error}
                                                        maxLength={150}
                                                    />
                                                </div>
                                            )}
                                        </Field>
                                        {fieldArray.items.length > 2 && pollForm.internal.fields.type?.value !== PollType.BINARY && (
                                            <button 
                                                type="button" 
                                                class="mt-6 p-2 text-muted-foreground hover:text-destructive transition-colors"
                                                onClick$={() => remove(pollForm, 'options', { at: index })}
                                                aria-label={`${_`Remove Option`} ${index + 1}`}
                                            >
                                                <LuMinus />
                                            </button>
                                        )}
                                    </div>
                            ))}
                            {fieldArray.items.length < 10 && pollForm.internal.fields.type?.value !== PollType.BINARY && (
                                <button 
                                    type="button" 
                                    class="text-primary hover:text-primary/80 transition-colors text-sm"
                                    onClick$={() => insert(pollForm, 'options', { value: '' })}
                                >
                                    + {_`Add option`}
                                </button>
                            )}
                        </div>
                    )}
                </FieldArray>
            </div>

            {/* TAGS */}
            <div class="space-y-4">
                <h2 class="font-medium text-foreground">{_`Categorization`}</h2>
                <Field name="tags" type="string[]">
                    {(field, props) => (
                        <TagInput
                            {...props}
                            error={field.error}
                            form={pollForm}
                            label={_`Tags`}
                            predefinedTags={tags}
                        />
                    )}
                </Field>
            </div>

            {/* Additional Settings Section */}
            <div class="space-y-4">
                <h2 class="font-medium text-foreground">{_`Additional Settings`}</h2>

                <div class="space-y-4">
                    <div>
                        <CustomToggle
                            label={_`Set end date`}
                            checked={showEndDate.value}
                            onChange$={$((checked) => {
                                showEndDate.value = checked;
                            })}
                        />
                        <Field name="ends_at">
                            {(field, props) =>
                                showEndDate.value && (
                                    <TextInput
                                        {...props}
                                        type="date"
                                        label={_`End date`}
                                        value={field.value}
                                        error={field.error}
                                    />
                                )
                            }
                        </Field>
                        <p class="mt-2 text-sm text-muted-foreground">
                            {_`Specify the date when the poll will end. Participants won't be able to vote after this date.`}
                        </p>
                    </div>

                    <div>
                        <CustomToggle
                            label={_`Anonymous poll`}
                            checked={isAnonymous.value}
                            onChange$={$((checked) => {
                                isAnonymous.value = checked;
                                setValue(pollForm, 'is_anonymous', checked);
                            })}
                        />
                        <Field name="is_anonymous" type="boolean">
                            {(field, props) => (
                                <input type="hidden" {...props} value={field.value ? 'true' : 'false'} />
                            )}
                        </Field>
                        <p class="mt-2 text-sm text-muted-foreground">
                            {pollForm.internal.fields.is_anonymous?.value
                                ? _`Your identity will be hidden as poll creator.`
                                : _`Your username will be visible as poll creator.`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form footer - Ahora fuera del contenedor scrollable para que sea siempre el último elemento */}
            <FormFooter of={pollForm} />
        </Form>
    );
});
