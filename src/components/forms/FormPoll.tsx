import { $, component$, useSignal, useTask$ } from '@builder.io/qwik';
import { useForm, valiForm$, insert, remove, setValue } from '@modular-forms/qwik';
import { TextInput } from '~/components/input/TextInput';
import { TextArea } from '~/components/input/TextArea';
import { ChipGroup } from '~/components/input/ChipGroup';
import type { PollForm } from '~/schemas/pollSchema';
import { PollSchema } from '~/schemas/pollSchema';
import { useFormPollLoader } from '~/shared/loaders';
import { useFormPollAction, type PollResponseData } from '~/shared/actions';
import { FormFooter } from '~/components/forms/FormFooter';
import { PollType } from '~/constants/pollType';
import { ScopeOptions } from '~/constants/scopeOption';
import { _ } from 'compiled-i18n';
import { CommunityType } from '~/constants/communityType';
import { CountrySelectInput } from '~/components/input/CountrySelectInput';
import { dataArray as countries } from "~/data/countries";
import { Select } from '../input/Select';
import { CustomToggle } from '~/components/input/CustomToggle';

interface FormPollProps {
    onSubmitCompleted: () => void;
}

export default component$<FormPollProps>(({ onSubmitCompleted }) => {
    const [pollForm, { Form, Field, FieldArray }] = useForm<PollForm, PollResponseData>({
        loader: useFormPollLoader(),
        action: useFormPollAction(),
        fieldArrays: ['options'],
        validate: valiForm$(PollSchema)
    });

    // Control to show/hide end date
    const showEndDate = useSignal(false);

    // If toggle is deactivated, clear date field
    useTask$(({ track }) => {
        track(() => showEndDate.value);
        if (!showEndDate.value) {
            setValue(pollForm, 'ends_at', '');
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

    const countriesOptions = countries.map(c => ({ 
        value: c.cca2,
        name: `${c.flag} ${c.name}` 
    }))

    return (
        <Form onSubmit$={handleSubmit} class="space-y-6 p-6">
            {/* Sección de Poll Settings */}
            <div class="space-y-4">
                <h2 class="font-medium text-foreground">{_`Poll Settings`}</h2>
                
                <Field name="scope">
                    {(field, props) => (
                        <ChipGroup
                            {...props}
                            onInput$={(ev: Event) => props.onInput$(ev, ev.target as HTMLTextAreaElement)}
                            onChange$={(ev: Event) => props.onChange$(ev, ev.target as HTMLTextAreaElement)}
                            label={_`Scope`}
                            value={field.value || 'GLOBAL'}
                            options={ScopeOptions}
                            required
                            error={field.error}
                        />
                    )}
                </Field>

                <Field name="community_ids" type="string[]">
                    {(field, props) => {
                        const scope = pollForm.internal.fields.scope?.value;
                        switch (scope) {
                            case CommunityType.GLOBAL:
                                return <input type="hidden" {...props} value="1" />;

                            case CommunityType.INTERNATIONAL:
                                return (
                                    <CountrySelectInput
                                        {...props}
                                        form={pollForm}
                                        label={_`Countries involved`}
                                        predefinedCountries={countriesOptions}
                                        error={field.error}
                                    />
                                );

                            case CommunityType.NATIONAL:
                                return (
                                    <Select
                                        {...props}
                                        options={countriesOptions}
                                        label={_`Select a country`}
                                        placeholder={_`Search country...`}
                                        error={field.error}
                                    />
                                );

                            case CommunityType.SUBNATIONAL:
                                return (
                                    <Select
                                        {...props}
                                        options={[]}
                                        label={_`Select a province`}
                                        value={field.value}
                                        error={field.error}
                                    />
                                );

                            default:
                                return null;
                        }
                    }}
                </Field>
            </div>

            {/* Sección de Poll Content */}
            <div class="space-y-4">
                <h2 class="font-medium text-foreground">{_`Poll Content`}</h2>
                
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
                            placeholder={_`Provide additional context or details about your poll`}
                            value={field.value}
                            error={field.error}
                            maxLength={500}
                        />
                    )}
                </Field>
            </div>

            {/* Sección de Poll Options */}
            <div class="space-y-4">
                <h2 class="font-medium text-foreground">{_`Poll Options`}</h2>

                <Field name="type">
                    {(field, props) => (
                        <ChipGroup
                            {...props}
                            onInput$={(ev: Event) => props.onInput$(ev, ev.target as HTMLTextAreaElement)}
                            onChange$={(ev: Event) => props.onChange$(ev, ev.target as HTMLTextAreaElement)}
                            label={_`Poll Type`}
                            value={field.value || PollType.SINGLE_CHOICE}
                            options={[
                                { value: PollType.BINARY, label: _`Binary`, description: _`Yes/No` },
                                { value: PollType.SINGLE_CHOICE, label: _`Single Choice`, description: _`One option` },
                                { value: PollType.MULTIPLE_CHOICE, label: _`Multiple Choice`, description: _`Multiple options` },
                            ]}
                            required
                            error={field.error}
                        />
                    )}
                </Field>

                <FieldArray name="options">
                    {(fieldArray) => (
                        <div class="space-y-3">
                            {fieldArray.items.map((option, index) => (
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
                                    {fieldArray.items.length > 2 && (
                                        <button 
                                            type="button" 
                                            class="mt-6 p-2 text-muted-foreground hover:text-destructive transition-colors"
                                            onClick$={() => remove(pollForm, 'options', { at: index })}
                                        >
                                            {_`Remove`}
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

            {/* Sección de Additional Settings */}
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

                    <div class="pt-4 border-t">
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

            {/* Form footer */}
            <div class="sticky bottom-0 bg-background py-4 border-t mt-4">
                <FormFooter of={pollForm} />
            </div>
        </Form>
    );
});
