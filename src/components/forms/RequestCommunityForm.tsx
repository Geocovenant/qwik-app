import { $, component$, type QRL, useSignal, useTask$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { dataArray as countries } from "~/data/countries";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { useFormCommunityRequestLoader } from "~/shared/loaders";
import { useFormCommunityRequestAction, type CommunityRequestResponseData } from "~/shared/actions";
import { CommunityRequestSchema } from "~/schemas/communityRequestSchema";
import type { CommunityRequestForm } from "~/schemas/communityRequestSchema";
import { LuSend } from "@qwikest/icons/lucide";
import { Button } from "../ui";

export interface RequestCommunityFormProps {
  onClose$?: QRL<() => void>;
}

export default component$<RequestCommunityFormProps>(({ onClose$ }) => {
  const [requestCommunityForm, { Form, Field }] = useForm<CommunityRequestForm, CommunityRequestResponseData>({
    loader: useFormCommunityRequestLoader(),
    action: useFormCommunityRequestAction(),
    validate: valiForm$(CommunityRequestSchema),
  });

  // Flag to control success message display
  const showSuccessMessage = useSignal(false);

  // Track form submission status
  useTask$(({ track }) => {
    const isSubmitted = track(() => requestCommunityForm.submitted);
    
    if (isSubmitted) {
      showSuccessMessage.value = true;
    }
  });

  const handleSubmit = $((values: CommunityRequestForm) => {
    console.log('values', values);
  });

  const handleClose = $(() => {
    showSuccessMessage.value = false;
    onClose$?.();
  });

  return (
    <div class="space-y-4">
      {showSuccessMessage.value ? (
        <div class="text-center py-4">
          <div class="text-green-500 mb-3 text-xl">✓</div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {_`Thank you for your request!`}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {_`We have received your interest in this community. We will notify you when it becomes available.`}
          </p>
          <button
            onClick$={handleClose}
            class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            {_`Close`}
          </button>
        </div>
      ) : (
        <Form onSubmit$={handleSubmit} class="space-y-4">
          <div class="mb-4">
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {_`We are gradually incorporating communities. If you want to prioritize a specific community, please provide the details below.`}
            </p>
          </div>
          <div class="space-y-3">
            <Field name="country">
              {(field, props) => (
                <div>
                  <label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {_`Country`}<span class="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    {...props}
                    value={field.value}
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="" disabled selected>{_`Select a country...`}</option>
                    {countries.map((countryOption) => (
                      <option key={countryOption.cca2} value={countryOption.cca2}>
                        {`${countryOption.flag} ${countryOption.name}`}
                      </option>
                    ))}
                  </select>
                  {field.error && (
                    <div class="text-sm text-red-500">{field.error}</div>
                  )}
                </div>
              )}
            </Field>

            <Field name="region">
              {(field, props) => (
                <div>
                  <label for="region" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {_`Region / Province / State`}
                  </label>
                  <input
                    id="region"
                    type="text"
                    {...props}
                    value={field.value}
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  {field.error && (
                    <div class="text-sm text-red-500">{field.error}</div>
                  )}
                </div>
              )}
            </Field>

            <Field name="city">
              {(field, props) => (
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {_`City / Locality`}
                  </label>
                  <input
                    id="city"
                    type="text"
                    {...props}
                    value={field.value}
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  {field.error && (
                    <div class="text-sm text-red-500">{field.error}</div>
                  )}
                </div>
              )}
            </Field>

            <Field name="email">
              {(field, props) => (
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {_`Contact Email`}<span class="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...props}
                    value={field.value}
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    required
                  />
                  {field.error && (
                    <div class="text-sm text-red-500">{field.error}</div>
                  )}
                </div>
              )}
            </Field>
          </div>

          {/* Submit button */}
          <div class="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={requestCommunityForm.submitting}
              class="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {requestCommunityForm.submitting ? _`Submitting...` : _`Submit request`}
              {!requestCommunityForm.submitting && <LuSend class="ml-2 w-4 h-4" />}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}); 