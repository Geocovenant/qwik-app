import { component$, type QRL } from "@builder.io/qwik";
import { LuAlertCircle } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import { Button } from '~/components/ui';

interface EmptyIssuesProps {
    onCreateIssue: QRL<() => void>;
    communityName?: string;
}

export default component$<EmptyIssuesProps>(({ onCreateIssue, communityName }) => {
    return (
        <div class="flex items-center justify-center h-[calc(100vh-12rem)]">
            <div class="w-full max-w-md mx-auto bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
                <div class="flex flex-col items-center justify-center space-y-6 text-center">
                    <div class="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                        <LuAlertCircle class="w-8 h-8 text-cyan-600 dark:text-cyan-300" />
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            {_`No issues reported yet`}
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                            {communityName 
                                ? _`Be the first to report an issue in ${communityName} and help improve the community!`
                                : _`Be the first to report an issue in this community and help improve the community!`
                            }
                        </p>
                    </div>
                    <Button 
                        class="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600"
                        onClick$={onCreateIssue}
                    >
                        {_`Report First Issue`}
                    </Button>
                </div>
            </div>
        </div>
    );
});
