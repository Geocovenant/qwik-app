import { $, component$, useTask$, type PropFunction } from "@builder.io/qwik";
import { LuSend } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import { setValue, useForm, valiForm$ } from "@modular-forms/qwik";
import { dataArray as countries } from "~/data/countries";
import { Button, Select, Textarea } from "~/components/ui";
import type { OpinionForm } from "~/schemas/opinionSchema";
import { OpinionSchema } from "~/schemas/opinionSchema";
import { useFormOpinionLoader } from "~/shared/loaders";
import { useFormOpinionAction, type OpinionResponseData } from "~/shared/actions";

interface FormOpinionGlobalDebateProps {
    onSubmitCompleted: PropFunction<() => void>;
    defaultCountryCca2: string;
}

export const FormOpinionGlobalDebate = component$<FormOpinionGlobalDebateProps>(({
    onSubmitCompleted,
    defaultCountryCca2
}) => {
    console.log('defaultCountryCca2', defaultCountryCca2)
    const [opinionForm, { Form, Field }] = useForm<OpinionForm, OpinionResponseData>({
        loader: useFormOpinionLoader(),
        action: useFormOpinionAction(),
        validate: valiForm$(OpinionSchema),
    });
    
    // Establecer el país por defecto cuando se monta el componente
    useTask$(({ track }) => {
        const country = track(() => defaultCountryCca2);
        if (country) {
            setValue(opinionForm, 'country', defaultCountryCca2);
        }
    });

    const handleSubmit = $((values: OpinionForm, event: any) => {
        console.log('Submitting Opinion form:', values);
        console.log('event', event);
        // eslint-disable-next-line qwik/valid-lexical-scope
        onSubmitCompleted()
        // Here you can perform the submit action (client-side or progressively enhanced with action)
    });

    return (
        <Form class="space-y-2" onSubmit$={handleSubmit}>
            <Field name="country" type="string">
                {(field, props) => {
                    return (
                        <div class="space-y-2 max-w-xs">
                            <Select.Root
                                {...props} 
                                value={defaultCountryCca2 || field.value}
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
                }}
            </Field>
            <div class="flex gap-2" >
                <Field name="opinion">
                    {(field, props) => (
                        <div class="flex-1 relative">
                            <Textarea
                                {...props}
                                placeholder={_`Write your perspective from ${defaultCountryCca2}`}
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
