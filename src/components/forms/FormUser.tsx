import { $, component$, type QRL } from "@builder.io/qwik";
import { useForm, valiForm$ } from '@modular-forms/qwik';
import { TextInput } from '~/components/input/TextInput';
import { TextArea } from '~/components/input/TextArea';
import { _ } from "compiled-i18n";
import { FormFooter } from '~/components/forms/FormFooter';
import type { UserForm } from "~/schemas/userSchema";
import { UserSchema } from "~/schemas/userSchema";
import { useFormUserLoader } from "~/shared/loaders";
import { useFormUserAction, type UserResponseData } from "~/shared/actions";

export interface FormUserProps {
  onSubmitCompleted$: QRL<() => void>;
}

export default component$<FormUserProps>(({ onSubmitCompleted$ }) => {
  const [userForm, { Form, Field }] = useForm<UserForm, UserResponseData>({
    loader: useFormUserLoader(),
    action: useFormUserAction(),
    validate: valiForm$(UserSchema)
  });

  const handleSubmit = $(() => {
    onSubmitCompleted$();
  });

  return (
    <Form onSubmit$={handleSubmit} class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field name="name">
          {(field, props) => (
            <TextInput
              {...props}
              label={_`Full Name`}
              placeholder={_`Enter your full name`}
              required
              value={field.value}
              error={field.error}
            />
          )}
        </Field>
      </div>

      <Field name="bio">
        {(field, props) => (
          <TextArea
            {...props}
            label={_`Bio`}
            placeholder={_`Tell us something about yourself`}
            value={field.value || ''}
            error={field.error}
            rows={3}
            maxLength={500}
          />
        )}
      </Field>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field name="website">
          {(field, props) => (
            <TextInput
              {...props}
              type="url"
              label={_`Website`}
              placeholder={_`Enter your website URL`}
              value={field.value || ''}
              error={field.error}
            />
          )}
        </Field>
      </div>

      <Field name="gender">
        {(field, props) => (
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {_`Gender`}
            </label>
            <select
              {...props}
              class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              value={field.value || 'prefer-not-to-say'}
            >
              <option value="male">{_`Male`}</option>
              <option value="female">{_`Female`}</option>
              <option value="non-binary">{_`Non-binary`}</option>
              <option value="prefer-not-to-say">{_`Prefer not to say`}</option>
            </select>
            {field.error && (
              <div class="text-sm text-destructive">{field.error}</div>
            )}
          </div>
        )}
      </Field>

      {/* Form footer */}
      <div class="sticky bottom-0 bg-background py-4 border-t mt-4">
        <FormFooter of={userForm} />
      </div>
    </Form>
  );
});
