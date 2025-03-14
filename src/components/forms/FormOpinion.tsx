import { $, component$, type QRL } from "@builder.io/qwik";
import { LuInfo, LuSend } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import { setValue, useForm, valiForm$ } from "@modular-forms/qwik";
import { Alert, Button, Select, Textarea } from "~/components/ui";
import type { OpinionForm } from "~/schemas/opinionSchema";
import { OpinionSchema } from "~/schemas/opinionSchema";
import { useFormOpinionLoader } from "~/shared/loaders";
import { useFormOpinionAction, type OpinionResponseData } from "~/shared/actions";
import { dataArray as countries, getFlagByCca2 } from "~/data/countries";
import type { CountryView } from "~/shared/types";
import { CommunityType } from "~/constants/communityType";
import type { Division } from "~/types/debate";

interface FormOpinionProps {
    onSubmitCompleted$: QRL<() => void>;
    defaultSelectionId?: string;
    defaultCountryCca2?: string;
    pointsOfView?: CountryView[];
    divisions?: Division[];
    debateType: string;
}

export const FormOpinion = component$<FormOpinionProps>(({
    onSubmitCompleted$,
    defaultCountryCca2 = "",
    pointsOfView = [],
    divisions = [],
    debateType
}) => {
    const [opinionForm, { Form, Field }] = useForm<OpinionForm, OpinionResponseData>({
        loader: useFormOpinionLoader(),
        action: useFormOpinionAction(),
        validate: valiForm$(OpinionSchema),
    });

    const handleSubmit = $((values: OpinionForm, event: any) => {
        console.log('Submitting Opinion form:', values);
        console.log('event', event);
        // eslint-disable-next-line qwik/valid-lexical-scope
        onSubmitCompleted$()
    });

    // Get placeholder text based on debate type
    const getPlaceholderText = () => {
        switch (debateType) {
            case CommunityType.GLOBAL:
            case CommunityType.INTERNATIONAL:
                return _`Write your perspective from ${defaultCountryCca2 || "your country"}`;
            case CommunityType.NATIONAL:
                return _`Write your perspective from your region`;
            case CommunityType.REGIONAL:
                return _`Write your perspective from your subregion`;
            case CommunityType.SUBREGIONAL:
                return _`Write your perspective from your locality`;
            default:
                return _`Write your perspective`;
        }
    };

    const handleChangeSelect = $((value: string) => {
        setValue(opinionForm, 'community_id', value);
    });

    return (
        <Form class="space-y-2" onSubmit$={handleSubmit}>
            {opinionForm.response.message && (
                <Alert.Root class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 text-yellow-800 dark:text-yellow-200 rounded-xl p-5 shadow-md">
                    <LuInfo class="h-5 w-5" />
                    <Alert.Description class="font-medium">
                        {opinionForm.response.message}
                    </Alert.Description>
                </Alert.Root>
            )}
            <Field name="debate_id" type="number">
                {(field, props) => {
                    return <input {...props} value={field.value} type="hidden" />
                }}
            </Field>
            <Field name="debate_type" type="string">
                {(field, props) => {
                    return <input {...props} value={field.value} type="hidden" />
                }}
            </Field>
            <Field name="community_id" type="string">
                {(field, props) => {
                    switch (debateType) {
                        case CommunityType.GLOBAL:
                            return (
                                <div class="space-y-2">
                                    <Select.Root
                                        {...props as any}
                                        onChange$={handleChangeSelect}
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
                            )

                        case CommunityType.INTERNATIONAL:
                            return (
                                <div class="space-y-2">
                                    <Select.Root
                                        {...props as any}
                                        onChange$={handleChangeSelect}
                                    >
                                        <Select.Label>{_`Select a country`}</Select.Label>
                                        <Select.Trigger>
                                            <Select.DisplayValue placeholder={_`Search country...`} />
                                        </Select.Trigger>
                                        <Select.Popover>
                                            {pointsOfView.map((pov) => (
                                                <Select.Item key={pov.community.cca2} value={pov.community.id.toString()}>
                                                    <Select.ItemLabel>
                                                        {`${getFlagByCca2(pov.community.cca2)} ${pov.community.name}`}
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

                        case CommunityType.NATIONAL:
                            return (
                                <div class="space-y-2">
                                    <Select.Root
                                        {...props as any}
                                        onChange$={handleChangeSelect}
                                    >
                                        <Select.Label>{_`Select a country`}</Select.Label>
                                        <Select.Trigger>
                                            <Select.DisplayValue placeholder={_`Search country...`} />
                                        </Select.Trigger>
                                        <Select.Popover>
                                            {divisions.map((region) => (
                                                <Select.Item key={region.id} value={region.community_id.toString()}>
                                                    <Select.ItemLabel>
                                                        {region.name}
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
                                    <Select.Root
                                        {...props as any}
                                        onChange$={handleChangeSelect}
                                    >
                                        <Select.Label>{_`Select a subregion`}</Select.Label>
                                        <Select.Trigger>
                                            <Select.DisplayValue placeholder={_`Search subregion...`} />
                                        </Select.Trigger>
                                        <Select.Popover>
                                            {divisions.map((subregion) => (
                                                <Select.Item key={subregion.id} value={subregion.community_id.toString()}>
                                                    <Select.ItemLabel>
                                                        {subregion.name}
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

                        case CommunityType.SUBREGIONAL:
                            return (
                                <div class="space-y-2">
                                    <Select.Root
                                        {...props as any}
                                        onChange$={handleChangeSelect}
                                    >
                                        <Select.Label>{_`Select a locality`}</Select.Label>
                                        <Select.Trigger>
                                            <Select.DisplayValue placeholder={_`Search locality...`} />
                                        </Select.Trigger>
                                        <Select.Popover>
                                            {divisions.map((locality) => (
                                                <Select.Item key={locality.id} value={locality.community_id.toString()}>
                                                    <Select.ItemLabel>
                                                        {locality.name}
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

                        default:
                            return null;
                    }
                }}
            </Field>
            <div class="flex gap-2" >
                <Field name="opinion">
                    {(field, props) => (
                        <div class="flex-1 relative">
                            <Textarea
                                {...props}
                                placeholder={getPlaceholderText()}
                                value={field.value}
                                error={field.error}
                            />
                        </div>
                    )}
                </Field>
                <Button type="submit" class="self-end">
                    <LuSend class="h-4 w-4 mr-2" />
                    {_`Share Opinion`}
                </Button>
            </div>
        </Form>
    );
}); 