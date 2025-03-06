import { $, component$, useComputed$, useSignal, useTask$ } from '@builder.io/qwik';
import { useForm, valiForm$, setValue, insert, remove } from '@modular-forms/qwik';
import { _ } from 'compiled-i18n';
import { TextInput } from '~/components/input/TextInput';
import { TextArea } from '~/components/input/TextArea';
import { FormFooter } from '~/components/forms/FormFooter';
import { CustomToggle } from '~/components/input/CustomToggle';
import { CommunityType } from '~/constants/communityType';
import { LuPlus, LuTrash, LuGripVertical } from "@qwikest/icons/lucide";
import { Select } from '~/components/ui';
import { useLocation } from '@builder.io/qwik-city';
import { dataArray as countries } from "~/data/countries";
import { CountrySelectInput } from '~/components/input/CountrySelectInput';
import { TagInput } from '~/components/input/TagInput';

// Importar el esquema del proyecto desde un archivo separado
import type { ProjectForm } from '~/schemas/projectSchema';
import { ProjectSchema } from '~/schemas/projectSchema';
import { useFormProjectLoader } from '~/shared/loaders';
import { useFormProjectAction, type ProjectResponseData } from '~/shared/actions';

// Interfaces
export interface FormProjectProps {
    onSubmitCompleted: () => void;
    defaultScope?: CommunityType;
    defaultRegionId?: number;
    defaultSubregionId?: number;
    regions?: any[];
    subregions?: any[];
    tags?: { id: string, name: string }[];
}

export default component$<FormProjectProps>(({
    onSubmitCompleted,
    defaultScope = CommunityType.NATIONAL,
    defaultRegionId = null,
    defaultSubregionId = null,
    tags = [],
    regions = [],
    subregions = [],
}) => {
    const [projectForm, { Form, Field, FieldArray }] = useForm<ProjectForm, ProjectResponseData>({
        loader: useFormProjectLoader(),
        action: useFormProjectAction(),
        fieldArrays: ['steps', 'steps.$.resources']
        validate: valiForm$(ProjectSchema),
    });

    useTask$(({ track }) => {
        const scope = track(() => defaultScope);
        setValue(projectForm, 'scope', scope as CommunityType);

        // Clear community_ids when scope changes
        setValue(projectForm, 'community_ids',
            scope === CommunityType.GLOBAL ? ['1'] : []
        );
    });

    // Update community_ids when region or subregion changes
    useTask$(({ track }) => {
        track(() => defaultScope);
        track(() => defaultRegionId);
        track(() => defaultSubregionId);

        if (defaultScope === CommunityType.REGIONAL && defaultRegionId) {
            setValue(projectForm, 'community_ids', [defaultRegionId.toString()]);
        }

        if (defaultScope === CommunityType.SUBREGIONAL && defaultSubregionId) {
            setValue(projectForm, 'community_ids', [defaultSubregionId.toString()]);
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
            setValue(projectForm, 'community_ids', [country.cca2]);
        }
    });

    // Update is_anonymous when toggle changes
    useTask$(({ track }) => {
        const anonymousValue = track(() => isAnonymous.value);
        setValue(projectForm, 'is_anonymous', anonymousValue);
    });

    const handleSubmit = $((values: ProjectForm, event: any) => {
        console.log('Submitting Project form:', values);
        console.log('event', event);
        // eslint-disable-next-line qwik/valid-lexical-scope
        onSubmitCompleted();
        // Here you can perform the submit action (client-side or progressively enhanced with action)
    });

    const countriesOptions = countries.map(c => ({
        value: c.cca2,
        name: `${c.flag} ${c.name}`
    }));

    // Función para añadir un step
    const addStep = $(() => {
        const stepsLength = (projectForm.internal.fields['steps']?.value as any[])?.length || 0;
        
        insert(projectForm, 'steps', {
            value: {
                title: '',
                description: '',
                order: stepsLength,
                status: 'PENDING',
                resources: []
            }
        });
    });

    // Función para añadir un recurso a un step
    const addResource = $((stepIndex: number) => {
        insert(projectForm, `steps.${stepIndex}.resources`, {
            value: {
                type: 'LABOR',
                description: '',
                quantity: '',
                unit: ''
            }
        });
    });

    return (
        <Form onSubmit$={handleSubmit} class="space-y-6">
            {/* Project type indicator */}
            {defaultScope === CommunityType.GLOBAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`Global project`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This project will be visible to all Geounity users`}
                    </span>
                </div>
            )}
            {defaultScope === CommunityType.INTERNATIONAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`International project`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This project will be visible to users from selected countries`}
                    </span>
                </div>
            )}
            {defaultScope === CommunityType.NATIONAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`National project`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This project will be visible to users from selected country`}
                    </span>
                </div>
            )}
            {defaultScope === CommunityType.REGIONAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`Regional project`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This project will be visible to users from selected region`}
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
                                        form={projectForm}
                                        label={_`Countries involved`}
                                        predefinedCountries={countriesOptions}
                                        error={field.error}
                                    />
                                </div>
                            );

                        case CommunityType.NATIONAL:
                            return (
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">{_`Select a country`}</label>
                                    <select
                                        {...props}
                                        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={defaultCountry.value?.cca2 || (Array.isArray(field.value) ? field.value[0] : field.value)}
                                    >
                                        {countries.map((country) => (
                                            <option key={country.cca2} value={country.cca2}>
                                                {`${country.flag} ${country.name}`}
                                            </option>
                                        ))}
                                    </select>
                                    {field.error && (
                                        <div class="text-sm text-destructive">{field.error}</div>
                                    )}
                                </div>
                            );

                        case CommunityType.REGIONAL:
                            return (
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">{_`Select a region`}</label>
                                    <select
                                        {...props}
                                        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={defaultRegionId ? defaultRegionId.toString() : undefined}
                                    >
                                        {regions.length > 0 ? regions.map((region) => (
                                            <option key={region.id} value={region.id}>
                                                {region.name}
                                            </option>
                                        )) : (
                                            <option value="">{_`No region available`}</option>
                                        )}
                                    </select>
                                    {field.error && (
                                        <div class="text-sm text-destructive">{field.error}</div>
                                    )}
                                </div>
                            );

                        case CommunityType.SUBREGIONAL:
                            return (
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">{_`Select a subregion`}</label>
                                    <select
                                        {...props}
                                        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={defaultSubregionId ? defaultSubregionId.toString() : undefined}
                                    >
                                        {subregions.length > 0 ? subregions.map((subregion) => (
                                            <option key={subregion.id} value={subregion.id}>
                                                {subregion.name}
                                            </option>
                                        )) : (
                                            <option value="">{_`No subregion available`}</option>
                                        )}
                                    </select>
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

            {/* Project content */}
            <div class="space-y-4">
                <h2 class="font-medium text-foreground">{_`Project Content`}</h2>
                <Field name="title">
                    {(field, props) => (
                        <TextInput
                            {...props}
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
                            placeholder={_`Provide detailed information about the project`}
                            value={field.value}
                            error={field.error}
                            maxLength={5000}
                            rows={4}
                        />
                    )}
                </Field>

                <Field name="status">
                    {(field, props) => (
                        <div class="space-y-2">
                            <label class="text-sm font-medium">{_`Status`}</label>
                            <select
                                {...props}
                                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                value={field.value}
                            >
                                <option value="DRAFT">{_`Draft`}</option>
                                <option value="OPEN">{_`Open for Collaboration`}</option>
                                <option value="IN_PROGRESS">{_`In Progress`}</option>
                                <option value="COMPLETED">{_`Completed`}</option>
                                <option value="CANCELLED">{_`Cancelled`}</option>
                            </select>
                            {field.error && (
                                <div class="text-sm text-destructive">{field.error}</div>
                            )}
                        </div>
                    )}
                </Field>

                <Field name="goal_amount">
                    {(field, props) => (
                        <div class="space-y-2">
                            <label class="text-sm font-medium">{_`Goal Amount`}</label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                    $
                                </span>
                                <input
                                    {...props}
                                    type="number"
                                    class="pl-7 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder={_`Enter target amount (optional)`}
                                    value={field.value}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            {field.error && (
                                <div class="text-sm text-destructive">{field.error}</div>
                            )}
                            <p class="text-xs text-muted-foreground">{_`Leave empty if no specific funding goal`}</p>
                        </div>
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
                            form={projectForm}
                            label={_`Tags`}
                            predefinedTags={tags}
                        />
                    )}
                </Field>
            </div>

            {/* Project Steps */}
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <h2 class="font-medium text-foreground">{_`Project Steps`}</h2>
                    <button
                        type="button"
                        class="inline-flex items-center rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
                        onClick$={addStep}
                    >
                        <LuPlus class="w-4 h-4 mr-1" />
                        {_`Add Step`}
                    </button>
                </div>

                <FieldArray name="steps">
                    {(fieldArray) => (
                        <div class="space-y-6">
                            {fieldArray.items.map((item, stepIndex) => (
                                <div key={item} class="border rounded-md p-4 bg-gray-50 dark:bg-gray-800/50">
                                    <div class="flex items-center justify-between mb-4">
                                        <div class="flex items-center">
                                            <LuGripVertical class="w-5 h-5 text-gray-400 mr-2" />
                                            <span class="text-sm font-medium">{_`Step ${stepIndex + 1}`}</span>
                                        </div>
                                        {fieldArray.items.length > 1 && (
                                            <button
                                                type="button"
                                                class="text-sm text-red-600 hover:text-red-700"
                                                onClick$={() => remove(projectForm, 'steps', { at: stepIndex })}
                                            >
                                                <LuTrash class="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div class="space-y-4">
                                        <Field name={`steps.${stepIndex}.title`}>
                                            {(field, props) => (
                                                <TextInput
                                                    {...props}
                                                    label={_`Title`}
                                                    placeholder={_`Enter step title`}
                                                    required
                                                    value={field.value}
                                                    error={field.error}
                                                />
                                            )}
                                        </Field>

                                        <Field name={`steps.${stepIndex}.description`}>
                                            {(field, props) => (
                                                <TextArea
                                                    {...props}
                                                    label={_`Description`}
                                                    placeholder={_`Describe this step`}
                                                    value={field.value}
                                                    error={field.error}
                                                    rows={2}
                                                />
                                            )}
                                        </Field>

                                        <Field name={`steps.${stepIndex}.status`}>
                                            {(field, props) => (
                                                <div class="space-y-2">
                                                    <label class="text-sm font-medium">{_`Status`}</label>
                                                    <select
                                                        {...props}
                                                        value={field.value}
                                                        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                    >
                                                        <option value="PENDING">{_`Pending`}</option>
                                                        <option value="IN_PROGRESS">{_`In Progress`}</option>
                                                        <option value="COMPLETED">{_`Completed`}</option>
                                                    </select>
                                                    {field.error && (
                                                        <div class="text-sm text-destructive">{field.error}</div>
                                                    )}
                                                </div>
                                            )}
                                        </Field>

                                        {/* Resources Section */}
                                        <div class="space-y-2">
                                            <div class="flex items-center justify-between">
                                                <h4 class="text-sm font-medium">{_`Resources Needed`}</h4>
                                                <button
                                                    type="button"
                                                    class="inline-flex items-center rounded-md bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs font-medium text-gray-700"
                                                    onClick$={() => addResource(stepIndex)}
                                                >
                                                    <LuPlus class="w-3 h-3 mr-1" />
                                                    {_`Add Resource`}
                                                </button>
                                            </div>

                                            <FieldArray name={`steps.${stepIndex}.resources`}>
                                                {(resourceArray) => (
                                                    <div class="space-y-4">
                                                        {resourceArray.items.length > 0 ? (
                                                            resourceArray.items.map((resourceItem, resourceIndex) => (
                                                                <div
                                                                    key={resourceItem}
                                                                    class="grid grid-cols-12 gap-2 items-start p-2 border rounded bg-white dark:bg-gray-800"
                                                                >
                                                                    {/* Resource Type */}
                                                                    <div class="col-span-12 sm:col-span-3">
                                                                        <Field name={`steps.${stepIndex}.resources.${resourceIndex}.type`}>
                                                                            {(field, props) => (
                                                                                <div class="space-y-1">
                                                                                    <label class="block text-xs font-medium">{_`Type`}</label>
                                                                                    <select
                                                                                        {...props}
                                                                                        value={field.value}
                                                                                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                                    >
                                                                                        <option value="LABOR">{_`Labor`}</option>
                                                                                        <option value="MATERIAL">{_`Material`}</option>
                                                                                        <option value="ECONOMIC">{_`Economic`}</option>
                                                                                    </select>
                                                                                </div>
                                                                            )}
                                                                        </Field>
                                                                    </div>

                                                                    {/* Resource Description */}
                                                                    <div class="col-span-12 sm:col-span-5">
                                                                        <Field name={`steps.${stepIndex}.resources.${resourceIndex}.description`}>
                                                                            {(field, props) => (
                                                                                <div class="space-y-1">
                                                                                    <label class="block text-xs font-medium">
                                                                                        {_`Description`} <span class="text-red-500">*</span>
                                                                                    </label>
                                                                                    <input
                                                                                        {...props}
                                                                                        type="text"
                                                                                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                                        placeholder={_`Describe resource`}
                                                                                        value={field.value}
                                                                                    />
                                                                                    {field.error && (
                                                                                        <div class="text-xs text-destructive">{field.error}</div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </Field>
                                                                    </div>

                                                                    {/* Resource Quantity */}
                                                                    <div class="col-span-6 sm:col-span-2">
                                                                        <Field name={`steps.${stepIndex}.resources.${resourceIndex}.quantity`}>
                                                                            {(field, props) => (
                                                                                <div class="space-y-1">
                                                                                    <label class="block text-xs font-medium">{_`Quantity`}</label>
                                                                                    <input
                                                                                        {...props}
                                                                                        type="number"
                                                                                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                                        placeholder={_`Amount`}
                                                                                        value={field.value}
                                                                                        min="0"
                                                                                        step="0.01"
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </Field>
                                                                    </div>

                                                                    {/* Resource Unit */}
                                                                    <div class="col-span-5 sm:col-span-1">
                                                                        <Field name={`steps.${stepIndex}.resources.${resourceIndex}.unit`}>
                                                                            {(field, props) => (
                                                                                <div class="space-y-1">
                                                                                    <label class="block text-xs font-medium">{_`Unit`}</label>
                                                                                    <input
                                                                                        {...props}
                                                                                        type="text"
                                                                                        class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                                        placeholder={_`hrs/kg`}
                                                                                        value={field.value}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </Field>
                                                                    </div>

                                                                    {/* Remove Resource Button */}
                                                                    <div class="col-span-1 pt-6">
                                                                        <button
                                                                            type="button"
                                                                            class="p-1 text-red-600 hover:text-red-700 bg-transparent"
                                                                            onClick$={() => remove(projectForm, `steps.${stepIndex}.resources`, { at: resourceIndex })}
                                                                        >
                                                                            <LuTrash class="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p class="text-sm text-gray-500 italic">{_`No resources added yet`}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </FieldArray>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </FieldArray>
            </div>

            {/* Additional settings */}
            <div class="space-y-4">
                <h2 class="font-medium text-foreground">{_`Additional Settings`}</h2>
                <div class="pt-4 border-t">
                    <CustomToggle
                        label={_`Anonymous project`}
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
                            ? _`Your identity will be hidden as project creator.`
                            : _`Your username will be visible as project creator.`}
                    </p>
                </div>
            </div>

            {/* Form footer */}
            <div class="sticky bottom-0 bg-background py-4 border-t mt-4">
                <FormFooter of={projectForm} />
            </div>
        </Form>
    );
});
