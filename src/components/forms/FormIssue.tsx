import { type QRL, $, component$, useTask$ } from "@builder.io/qwik"
import { setValue, useForm, valiForm$ } from "@modular-forms/qwik"
import { _ } from "compiled-i18n"
import { Button, Select } from "~/components/ui"
import { type IssueForm, type IssueResponseData, IssueSchema } from "~/schemas/issueSchema"
import { CustomToggle } from '~/components/input/CustomToggle';
import { CommunityType } from "~/constants/communityType"
import { dataArray as countries } from "~/data/countries"
import { MultiCountryCombobox } from "../input/MultiCountryCombobox"
import { TagInput } from "~/components/input/TagInput"

import { useFormIssueLoader } from "~/shared/forms/loaders"
import { useFormIssueAction } from "~/shared/forms/actions"

export interface FormIssueProps {
    onSubmitCompleted: QRL<() => void>
    defaultScope?: CommunityType
    defaultCountry?: string
    defaultRegionId?: number
    defaultSubregionId?: number
    defaultLocalityId?: number
    regions?: any[]
    subregions?: any[]
    localities?: any[]
    tags?: { id: string; name: string }[]
}

export default component$<FormIssueProps>(({
    onSubmitCompleted,
    defaultScope = CommunityType.NATIONAL,
    defaultCountry = null,
    defaultRegionId = null,
    defaultSubregionId = null,
    defaultLocalityId = null,
    regions = [],
    subregions = [],
    localities = [],
    tags = []
}) => {
    const [issueForm, { Form, Field }] = useForm<IssueForm, IssueResponseData>({
        loader: useFormIssueLoader(),
        action: useFormIssueAction(),
        validate: valiForm$(IssueSchema)
    })

    // Update scope when defaultScope changes
    useTask$(({ track }) => {
        const scope = track(() => defaultScope);
        setValue(issueForm, 'scope', scope as CommunityType);

        // Set community_ids based on the scope
        setValue(issueForm, 'community_ids',
            scope === CommunityType.GLOBAL ? ['1'] : []
        );
    });

    // Update community_ids when region or subregion changes
    useTask$(({ track }) => {
        track(() => defaultScope);
        track(() => defaultRegionId);
        track(() => defaultSubregionId);
        track(() => defaultLocalityId);

        if (defaultScope === CommunityType.REGIONAL && defaultRegionId) {
            setValue(issueForm, 'community_ids', [defaultRegionId.toString()]);
        }

        if (defaultScope === CommunityType.SUBREGIONAL && defaultSubregionId) {
            setValue(issueForm, 'community_ids', [defaultSubregionId.toString()]);
        }

        if (defaultScope === CommunityType.LOCAL && defaultLocalityId) {
            setValue(issueForm, 'community_ids', [defaultLocalityId.toString()]);
        }
    });

    const handleSubmitCompleted = $(() => {
        onSubmitCompleted()
    })

    const handleChangeSelectNational = $((value: string | string[]) => {
        const valueArray = typeof value === 'string' ? [value] : value;
        setValue(issueForm, 'community_ids', valueArray);
    });

    return (
        <Form class="space-y-6" onSubmit$={handleSubmitCompleted}>
            {/* Issue type indicator */}
            {defaultScope === CommunityType.GLOBAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`Global issue`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This issue will be visible to all Geounity users`}
                    </span>
                </div>
            )}
            {defaultScope === CommunityType.INTERNATIONAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`International issue`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This issue will be visible to users from selected countries`}
                    </span>
                </div>
            )}
            {defaultScope === CommunityType.NATIONAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`National issue`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This issue will be visible to users from selected country`}
                    </span>
                </div>
            )}
            {defaultScope === CommunityType.REGIONAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`Regional issue`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This issue will be visible to users from selected region`}
                    </span>
                </div>
            )}
            {defaultScope === CommunityType.SUBREGIONAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`Subregional issue`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This issue will be visible to users from selected subregion`}
                    </span>
                </div>
            )}
            {defaultScope === CommunityType.LOCAL && (
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800">
                        {_`Local issue`}
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {_`This issue will be visible to users from selected locality`}
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

            {/* Community selection based on scope */}
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
                                            setValue(issueForm, 'community_ids', value);
                                        })}
                                    />
                                </div>
                            );

                        case CommunityType.NATIONAL:
                            return (
                                <div class="space-y-2">
                                    <Select.Root
                                        {...props as any}
                                        onChange$={handleChangeSelectNational}
                                        value={defaultCountry || (Array.isArray(field.value) ? field.value[0] : field.value)}
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
                                    <Select.Root {...props as any} value={defaultRegionId?.toString()}>
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
                                        {...props as any}
                                        value={defaultSubregionId ? defaultSubregionId.toString() : undefined}
                                    >
                                        <Select.Label>{_`Select a subregion`}</Select.Label>
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

                        case CommunityType.LOCAL:
                            return (
                                <div class="space-y-2">
                                    <Select.Root {...props as any} value={defaultLocalityId?.toString()}>
                                        <Select.Label>{_`Select a locality`}</Select.Label>
                                        <Select.Trigger>
                                            <Select.DisplayValue placeholder={_`Select locality...`} />
                                        </Select.Trigger>
                                        <Select.Popover>
                                            {localities.length > 0 ? localities.map((locality) => (
                                                <Select.Item key={locality.id} value={locality.id}>
                                                    <Select.ItemLabel>
                                                        {locality.name}
                                                    </Select.ItemLabel>
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            )) : (
                                                <Select.Item value="placeholder">
                                                    <Select.ItemLabel>{_`No locality available`}</Select.ItemLabel>
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

            <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                    {_`Title`}
                </label>
                <Field name="title">
                    {(field, props) => (
                        <div>
                            <input
                                {...props}
                                id="title"
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                value={field.value}
                                placeholder={_`Write a clear and concise title. Example: Water leak in Central Square.`}
                            />
                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                        </div>
                    )}
                </Field>
            </div>

            <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                    {_`Description`}
                </label>
                <Field name="description">
                    {(field, props) => (
                        <div>
                            <textarea
                                {...props}
                                id="description"
                                rows={5}
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                value={field.value}
                                placeholder={_`Explain the problem in detail so that it is easy to understand.`}
                            />
                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                        </div>
                    )}
                </Field>
            </div>

            <div>
                <label for="organization_name" class="block text-sm font-medium text-gray-700 mb-1">
                    {_`Organization or official`}
                </label>
                <Field name="organization_name">
                    {(field, props) => (
                        <div>
                            <input
                                {...props}
                                id="organization_name"
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                value={field.value}
                                placeholder={_`Organization or official to whom this issue is addressed (optional)`}
                            />
                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
                        </div>
                    )}
                </Field>
            </div>

            <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
                    {_`Status`}
                </label>
                <Field name="status">
                    {(field, props) => (
                        <div>
                            <select
                                {...props}
                                id="status"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                value={field.value}
                            >
                                <option value="OPEN">{_`Open`}</option>
                                <option value="IN_PROGRESS">{_`In Progress`}</option>
                                <option value="RESOLVED">{_`Resolved`}</option>
                                <option value="CLOSED">{_`Closed`}</option>
                            </select>
                            {field.error && <div class="text-red-500 text-sm mt-1">{field.error}</div>}
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
                            form={issueForm}
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
                    <CustomToggle
                        label={_`Anonymous issue`}
                        checked={!!issueForm.internal.fields.is_anonymous?.value}
                        onChange$={$((checked) => {
                            setValue(issueForm, 'is_anonymous', checked);
                        })}
                    />
                    <Field name="is_anonymous" type="boolean">
                        {(field, props) => (
                            <input type="hidden" {...props} value={field.value ? 'true' : 'false'} />
                        )}
                    </Field>
                    <p class="mt-2 text-sm text-muted-foreground">
                        {issueForm.internal.fields.is_anonymous?.value
                            ? _`Your identity will be hidden as issue creator.`
                            : _`Your username will be visible as issue creator.`}
                    </p>
                </div>
            </div>

            <div class="flex justify-end gap-2 pt-4">
                <Button
                    type="button"
                    class="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    onClick$={handleSubmitCompleted}
                >
                    {_`Cancel`}
                </Button>
                <Button
                    type="submit"
                    class="bg-cyan-600 hover:bg-cyan-700 text-white"
                    disabled={issueForm.submitting}
                >
                    {issueForm.submitting ? _`Submitting...` : _`Submit Issue`}
                </Button>
            </div>
        </Form>
    )
})
