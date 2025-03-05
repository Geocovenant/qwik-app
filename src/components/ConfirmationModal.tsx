import { component$, type QRL } from '@builder.io/qwik';
import Modal from './Modal';
import { _ } from 'compiled-i18n';
import { LuAlertCircle } from '@qwikest/icons/lucide';

interface ConfirmationModalProps {
    title: string;
    description: string;
    show: { value: boolean };
    onConfirm$: QRL<() => void>;
    onCancel$?: QRL<() => void>;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export default component$<ConfirmationModalProps>(({
    title,
    description,
    show,
    onConfirm$,
    onCancel$,
    confirmText = _`Confirm`,
    cancelText = _`Cancel`,
    variant = 'danger'
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: <LuAlertCircle class="text-red-500 w-8 h-8 mr-3" />,
                    confirmButton: 'bg-red-500 hover:bg-red-600 text-white',
                    bgInfo: 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900/30'
                };
            case 'warning':
                return {
                    icon: <LuAlertCircle class="text-amber-500 w-8 h-8 mr-3" />,
                    confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white',
                    bgInfo: 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30'
                };
            case 'info':
                return {
                    icon: <LuAlertCircle class="text-blue-500 w-8 h-8 mr-3" />,
                    confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white',
                    bgInfo: 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <Modal title={title} show={show}>
            <div class="p-4">
                <div class="flex items-center mb-4">
                    {styles.icon}
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
                </div>
                
                <p class="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
                
                <div class={`p-3 rounded-md mb-5 text-sm ${styles.bgInfo}`}>
                    <p>{_`This action cannot be undone.`}</p>
                </div>
                
                <div class="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick$={() => {
                            show.value = false;
                            onCancel$?.();
                        }}
                        class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick$={onConfirm$}
                        class={`px-4 py-2 rounded transition-colors ${styles.confirmButton}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}); 