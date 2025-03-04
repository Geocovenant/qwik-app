import { $, component$, useTask$, type QRL } from "@builder.io/qwik";
import { LuSend } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import { setValue, useForm, valiForm$ } from "@modular-forms/qwik";
import { Button, Textarea } from "~/components/ui";
import type { OpinionForm } from "~/schemas/opinionSchema";
import { OpinionSchema } from "~/schemas/opinionSchema";
import { useFormOpinionLoader, useGetCountryDivisions } from "~/shared/loaders";
import { useFormOpinionAction, type OpinionResponseData } from "~/shared/actions";

interface FormOpinionNationalDebateProps {
    onSubmitCompleted$: QRL<() => void>;
    defaultDivisionId?: string;
}

export const FormOpinionNationalDebate = component$<FormOpinionNationalDebateProps>(({
    onSubmitCompleted$,
    defaultDivisionId
}) => {
    const divisions = useGetCountryDivisions();

    const [opinionForm, { Form, Field }] = useForm<OpinionForm, OpinionResponseData>({
        loader: useFormOpinionLoader(),
        action: useFormOpinionAction(),
        validate: valiForm$(OpinionSchema),
    });
    
    // Establecer la división por defecto cuando se monta el componente
    useTask$(({ track }) => {
        const division = track(() => defaultDivisionId);
        if (division) {
            setValue(opinionForm, 'region_id', division);
        }
    });

    const handleSubmit = $((values: OpinionForm, event: any) => {
        console.log('Submitting Opinion form:', values);
        console.log('event', event);
        // eslint-disable-next-line qwik/valid-lexical-scope
        onSubmitCompleted$()
    });

    return (
        <Form class="space-y-2" onSubmit$={handleSubmit}>
            <Field name="debate_id" type="number">
                {(field, props) => {
                    return <input {...props} value={field.value} type="hidden" />
                }}
            </Field>
            <Field name="region_id" type="string">
                {(field, props) => {
                    return (
                        <div class="space-y-2 max-w-xs">
                            <select {...props} class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2">
                                {divisions.value.map((division) => (
                                    <option 
                                        key={division.id} 
                                        value={division.id} 
                                        selected={field.value === division.id.toString()}
                                    >
                                        {division.name}
                                    </option>
                                ))}
                            </select>
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
                                placeholder={_`Write your perspective from your province`}
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