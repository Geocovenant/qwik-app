import { $, component$, useSignal, useTask$ } from '@builder.io/qwik';
import { useForm, valiForm$, insert, remove, setValue } from '@modular-forms/qwik';
import { TextInput } from '~/components/input/TextInput';
import { TextArea } from '~/components/input/TextArea';
import { ChipGroup } from '~/components/input/ChipGroup';
import { Toggle } from 'flowbite-qwik';
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

    const countriesOptions = countries.map(c => ({ value: c.name, name: `${c.flag} ${c.name}` }))

    return (
        <Form onSubmit$={handleSubmit} class="space-y-6" >
            {/* SCOPE */}
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
            {/* COMMUNITY_IDS */}
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
                                    value={field.value}
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
            {/* TITLE */}
            <Field name="title">
                {(field, props) => (
                    <TextInput
                        {...props}
                        label={_`Title`}
                        placeholder={_`Enter poll title`}
                        required
                        value={field.value}
                        error={field.error}
                        maxLength={100}
                    />
                )}
            </Field>

            {/* DESCRIPTION */}
            <Field name="description">
                {(field, props) => (
                    <TextArea
                        {...props}
                        label={_`Description`}
                        placeholder={_`Describe poll details`}
                        value={field.value}
                        error={field.error}
                        maxLength={500}
                    />
                )}
            </Field>

            {/* POLL TYPE */}
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
                    <div class="space-y-4">
                        {fieldArray.items.map((option, index) => (
                            <div key={option} class="flex items-center space-x-2">
                                <Field name={`options.${index}`}>
                                    {(field, props) => (
                                        <TextInput
                                            {...props}
                                            label={_`Option ${index + 1}`}
                                            placeholder={_`Enter option ${index + 1}`}
                                            required
                                            value={field.value}
                                            error={field.error}
                                            maxLength={150}
                                        />
                                    )}
                                </Field>
                                {fieldArray.items.length > 2 && (
                                    <button type="button" onClick$={() => remove(pollForm, 'options', { at: index })}>
                                        {_`Remove`}
                                    </button>
                                )}
                            </div>
                        ))}
                        {fieldArray.items.length < 10 && pollForm.internal.fields.type?.value !== PollType.BINARY && (
                            <button type="button" onClick$={() => insert(pollForm, 'options', { value: '' })}>
                                {_`Add option`}
                            </button>
                        )}
                        {fieldArray.error && <div class="text-red-500">{fieldArray.error}</div>}
                    </div>
                )}
            </FieldArray>

            {/* END DATE */}
            <div>
                <Toggle label={_`Set end date`} bind:checked={showEndDate} />
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
                <p class="mt-2 text-sm text-gray-500">
                    {_`Specify the date when the poll will end. Participants won't be able to vote after this date.`}
                </p>
            </div>

            {/* ANONYMOUS POLL */}
            <div>
                <Toggle
                    label={_`Anonymous poll`}
                    bind:checked={isAnonymous}
                    onChange$={$((checked) => {
                        setValue(pollForm, 'is_anonymous', checked);
                    })}
                />
                <Field name="is_anonymous" type="boolean">
                    {(field, props) => (
                        <input type="hidden" {...props} value={field.value ? 'true' : 'false'} />
                    )}
                </Field>
                <p class="mt-2 text-sm text-gray-500">
                    {pollForm.internal.fields.is_anonymous?.value
                        ? _`Your identity will be hidden as poll creator.`
                        : _`Your username will be visible as poll creator.`}
                </p>
            </div>

            {/* Form footer */}
            <FormFooter of={pollForm} />
        </Form>
    );
});
