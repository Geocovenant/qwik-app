import { component$, useSignal, type QRL } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { setValue, useForm } from "@modular-forms/qwik";
import { Button } from "~/components/ui";
import { LuSend } from "@qwikest/icons/lucide";
import type { CommentForm } from "~/schemas/commentSchema";
import { useFormCommentAction, type CommentResponseData } from "~/shared/actions";

interface CommentFormProps {
    pollId: number;
    onSubmitCompleted: QRL<() => void>;
}

export default component$<CommentFormProps>(({ pollId, onSubmitCompleted }) => {
    const [commentForm, { Form, Field }] = useForm<CommentForm, CommentResponseData>({
        loader: {
            value: {
                pollId: pollId.toString(),
                text: '',
            }
        },
        action: useFormCommentAction()
    });
    
    const isSubmitting = useSignal(false);

    return (
        <Form 
            class="w-full"
            onSubmit$={async (values) => {
                isSubmitting.value = true;
                try {
                    // Here would go the logic to send the comment
                    console.log("Sending comment:", values);
                    // Simulating delay for demo
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Reset the form after successful submission
                    setValue(commentForm, 'pollId', pollId.toString());
                    setValue(commentForm, 'text', '');
                    
                    // Call the completion function to update the list
                    onSubmitCompleted();
                } finally {
                    isSubmitting.value = false;
                }
            }}
        >
            <Field name="pollId">
                {(field, props) => (
                    <input {...props} value={field.value} type="hidden" />
                )}
            </Field>
            
            <Field name="text">
                {(field, props) => (
                    <div class="relative">
                        <textarea
                            {...props}
                            value={field.value}
                            placeholder={_`Write a comment...`}
                            class="w-full p-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-cyan-500 focus:border-cyan-500"
                            rows={3}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting.value || !field.value.trim()}
                            class="absolute right-2 bottom-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full p-2 px-12 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={_`Send comment`}
                        >
                            <LuSend class="w-4 h-4" />
                            <span class="ml-2">{_`Send`}</span>
                        </Button>
                    </div>
                )}
            </Field>
        </Form>
    );
}); 