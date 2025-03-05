import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import type { SubmitHandler } from "@modular-forms/qwik";
import { setValue, useForm, valiForm$ } from "@modular-forms/qwik";
import { LuSend } from "@qwikest/icons/lucide";
import { type ReportForm, ReportSchema } from "~/schemas/reportSchema";
import { Button } from "~/components/ui";
import { useFormReportLoader } from "~/shared/loaders";
import { type ReportResponseData, useFormReportAction } from "~/shared/actions";

interface FormReportProps {
  type: 'POLL' | 'DEBATE' | 'PROJECT' | 'ISSUE' | 'COMMENT' | 'USER';
  itemId: number;
}

export default component$<FormReportProps>(({ type, itemId }) => {
  const [reportForm, { Form, Field }] = useForm<ReportForm, ReportResponseData>({
    loader: useFormReportLoader(),
    action: useFormReportAction(),
    validate: valiForm$(ReportSchema),
  });

  // Flag to control success message display
  const showSuccessMessage = useSignal(false);

  // Update initial values when props change
  useTask$(({ track }) => {
    track(() => itemId);
    track(() => type);
    
    setValue(reportForm, "itemId", itemId);
    setValue(reportForm, "itemType", type);
    setValue(reportForm, "reason", "OTHER");
    setValue(reportForm, "details", "");
  });

  // Track form submission status
  useTask$(({ track }) => {
    const isSubmitted = track(() => reportForm.submitted);
    
    if (isSubmitted) {
      showSuccessMessage.value = true;
    }
  });

  const handleSubmit = $<SubmitHandler<ReportForm>>(() => {
    // Submit handler is triggered when form is submitted
    // The form submission is handled by the action from useForm
  });

  const getReportReasons = (reportType: string) => {
    const reasonMap = {
      'POLL': [
        { value: "INAPPROPRIATE", label: _`Inappropriate content` },
        { value: "SPAM", label: _`Spam or advertising` },
        { value: "HARMFUL", label: _`Harmful or dangerous content` },
        { value: "MISINFORMATION", label: _`False or misleading information` },
        { value: "OTHER", label: _`Other reason` }
      ],
      'DEBATE': [
        { value: "INAPPROPRIATE", label: _`Inappropriate content` },
        { value: "HATE_SPEECH", label: _`Hate speech` },
        { value: "MISINFORMATION", label: _`False information` },
        { value: "OTHER", label: _`Other reason` }
      ],
      'PROJECT': [
        { value: "SCAM", label: _`Possible scam` },
        { value: "INAPPROPRIATE", label: _`Inappropriate content` },
        { value: "FALSE_INFO", label: _`False information` },
        { value: "OTHER", label: _`Other reason` }
      ],
      'COMMENT': [
        { value: "INAPPROPRIATE", label: _`Inappropriate content` },
        { value: "HATE_SPEECH", label: _`Hate speech` },
        { value: "SPAM", label: _`Spam` },
        { value: "OTHER", label: _`Other reason` }
      ],
      'ISSUE': [
        { value: "INAPPROPRIATE", label: _`Inappropriate content` },
        { value: "MISINFORMATION", label: _`False information` },
        { value: "DUPLICATED", label: _`Duplicated issue` },
        { value: "OTHER", label: _`Other reason` }
      ],
      'USER': [
        { value: "FAKE", label: _`Fake profile` },
        { value: "INAPPROPRIATE", label: _`Inappropriate content` },
        { value: "SPAM", label: _`Spam/Advertising` },
        { value: "OTHER", label: _`Other reason` }
      ]
    };
    
    return reasonMap[reportType as keyof typeof reasonMap];
  };

  return (
    <div class="space-y-4">
      {/* Success message overlay */}
      {showSuccessMessage.value && (
        <div class="absolute inset-0 z-10 bg-white dark:bg-gray-800 flex flex-col items-center justify-center py-6 text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">{_`Thank you for your report!`}</h3>
          <p class="text-gray-600 dark:text-gray-300">{_`Your report has been submitted and will be reviewed by our team.`}</p>
        </div>
      )}

      {/* Form - always present in DOM but may be visually hidden */}
      <div class={showSuccessMessage.value ? 'hidden' : ''}>
        <Form onSubmit$={handleSubmit} class="space-y-6">
          <p class="text-gray-600 dark:text-gray-300">
            {_`Please let us know why you are reporting this content. Your report will be reviewed by our moderation team.`}
          </p>

          {/* Hidden fields for itemId and itemType */}
          <Field name="itemId" type="number">
            {(field, props) => (
              <input type="hidden" {...props} value={field.value} />
            )}
          </Field>
          
          <Field name="itemType" type="string">
            {(field, props) => (
              <input type="hidden" {...props} value={field.value} />
            )}
          </Field>

          {/* Report reason field */}
          <Field name="reason" type="string">
            {(field, props) => (
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {_`Report reason`} <span class="text-red-500">*</span>
                </label>
                <select
                  {...props}
                  class={`w-full rounded-md border ${field.error ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:text-white`}
                  value={field.value}
                >
                  <option value="">{_`Select a reason`}</option>
                  {getReportReasons(type).map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
                {field.error && (
                  <p class="text-sm text-red-600 dark:text-red-400">{field.error}</p>
                )}
              </div>
            )}
          </Field>

          {/* Additional details field */}
          <Field name="details" type="string">
            {(field, props) => (
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {_`Additional details`}
                </label>
                <textarea
                  {...props}
                  class={`w-full rounded-md border ${field.error ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:text-white resize-none h-32`}
                  placeholder={_`Provide more information about why you are reporting this content...`}
                  value={field.value || ""}
                ></textarea>
                {field.error && (
                  <p class="text-sm text-red-600 dark:text-red-400">{field.error}</p>
                )}
              </div>
            )}
          </Field>

          {/* Submit button */}
          <div class="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={reportForm.submitting}
              class="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {reportForm.submitting ? _`Submitting...` : _`Submit report`}
              {!reportForm.submitting && <LuSend class="ml-2 w-4 h-4" />}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
});
