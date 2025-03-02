import { $, component$, type QRL } from "@builder.io/qwik"
import { useForm, valiForm$ } from "@modular-forms/qwik"
import { _ } from "compiled-i18n"
import { Button } from "~/components/ui"
import { CommunityType } from "~/constants/communityType"
import { type IssueForm, IssueSchema } from "~/schemas/issueSchema"
import { useFormIssueAction, type IssueResponseData } from "~/shared/actions"
import { useFormIssueLoader } from "~/shared/loaders"

export interface FormIssueProps {
    onSubmitCompleted: QRL<() => void>
    defaultScope?: string
    tags?: { id: string; name: string }[]
}

export default component$<FormIssueProps>(({
    onSubmitCompleted,
    defaultScope = CommunityType.NATIONAL,
    tags = []
}) => {
    const [issueForm, { Form, Field }] = useForm<IssueForm, IssueResponseData>({
        loader: useFormIssueLoader(),
        action: useFormIssueAction(),
        validate: valiForm$(IssueSchema)
    })

    const handleSubmitCompleted = $(() => {
        onSubmitCompleted()
    })

    return (
        <Form class="space-y-6" onSubmit$={handleSubmitCompleted}>
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
                                placeholder={_`Enter issue title`}
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
                                placeholder={_`Describe the issue in detail`}
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

            <Field name="is_anonymous">
                {(field, props) => (
                    <div class="flex items-center mt-4">
                        <input
                            {...props}
                            id="is_anonymous"
                            type="checkbox"
                            class="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                            checked={field.value}
                        />
                        <label for="is_anonymous" class="ml-2 block text-sm text-gray-900">
                            {_`Submit anonymously`}
                        </label>
                    </div>
                )}
            </Field>

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

