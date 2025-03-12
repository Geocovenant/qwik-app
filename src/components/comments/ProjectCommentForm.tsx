import { $, component$ } from "@builder.io/qwik"
import { useForm, valiForm$ } from "@modular-forms/qwik"
import { _ } from "compiled-i18n"
import { TextArea } from "~/components/input/TextArea"
import { CommentSchema } from "~/schemas/commentSchema"
import type { CommentForm } from "~/schemas/commentSchema"
import { useFormCommentAction } from "~/shared/actions"

export interface ProjectCommentFormProps {
    projectId: number
    onSubmitCompleted: () => void
}

export default component$<ProjectCommentFormProps>(({ projectId, onSubmitCompleted }) => {
    const [commentForm, { Form, Field }] = useForm<CommentForm>({
        loader: {
            value: {
                text: "",
                projectId: projectId
            }
        },
        validate: valiForm$(CommentSchema),
        action: useFormCommentAction(),
    })

    const handleSubmit = $((values: CommentForm, event: any) => {
        console.log("Comment submitted:", values)
        // eslint-disable-next-line qwik/valid-lexical-scope
        onSubmitCompleted()
    })

    return (
        <Form onSubmit$={handleSubmit} class="mb-6">
            <Field name="text">
                {(field, props) => (
                    <TextArea
                        {...props}
                        label={_`Write a comment`}
                        placeholder={_`Share your thoughts...`}
                        value={field.value}
                        error={field.error}
                        rows={3}
                    />
                )}
            </Field>

            {/* Hidden field for projectId */}
            <Field name="projectId">
                {(field, props) => (
                    <input
                        type="hidden"
                        {...props}
                        value={projectId}
                    />
                )}
            </Field>

            <div class="mt-4 flex justify-end">
                <button
                    type="submit"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={commentForm.submitting}
                >
                    {commentForm.submitting ? _`Posting...` : _`Post comment`}
                </button>
            </div>
        </Form>
    )
}) 