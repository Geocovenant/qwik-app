import { component$, useSignal } from "@builder.io/qwik";
import { _ } from "compiled-i18n";

interface CommentFormProps {
    pollId: number;
    onCommentAdded$: () => void;
}

export default component$<CommentFormProps>(({ pollId, onCommentAdded$ }) => {
    const commentText = useSignal("");
    const isSubmitting = useSignal(false);

    return (
        <form
            preventdefault:submit
            onSubmit$={async () => {
                if (!commentText.value.trim() || isSubmitting.value) return;
                
                isSubmitting.value = true;
                try {
                    // Aquí implementaremos la lógica para enviar el comentario
                    await onCommentAdded$();
                    commentText.value = "";
                } finally {
                    isSubmitting.value = false;
                }
            }}
            class="mt-4 border-t border-border pt-4"
        >
            <div class="flex flex-col space-y-2">
                <textarea
                    value={commentText.value}
                    onInput$={(e) => commentText.value = (e.target as HTMLTextAreaElement).value}
                    placeholder={_`Write your comment...`}
                    class="w-full p-3 rounded-lg bg-poll-option-bg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                    rows={3}
                />
                <button
                    type="submit"
                    disabled={isSubmitting.value || !commentText.value.trim()}
                    class="self-end px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting.value ? _`Sending...` : _`Submit`}
                </button>
            </div>
        </form>
    );
}); 