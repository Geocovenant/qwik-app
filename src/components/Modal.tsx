import { component$, type Signal, Slot, useSignal, useStyles$ } from '@builder.io/qwik';
import { cn } from '@qwik-ui/utils';
import { LuX } from '@qwikest/icons/lucide';
import { Modal, buttonVariants } from '~/components/ui';
import styles from './modal.css?inline';

interface ModalProps {
    title: string;
    description: string;
    show: Signal<boolean>;
    trigger?: string;
    position?: "center" | "top" | "bottom" | "left" | "right";
}

export default component$<ModalProps>(({ title, description, show, trigger, ...props }) => {
    useStyles$(styles);
    const isExpanded = useSignal<boolean>(false);
    return (
        <Modal.Root bind:show={show}>
            {trigger && <Modal.Trigger>
                {trigger}
            </Modal.Trigger>}
            <Modal.Panel
                class={cn(
                    "modal-panel",
                    "bg-white dark:bg-gray-900",
                    "border dark:border-gray-700",
                    "shadow-lg",
                    isExpanded.value ? 'modal-expanded' : ''
                )}
                position={props.position || 'center'}
            >
                <Modal.Title class="modal-title text-gray-900 dark:text-gray-100">{title}</Modal.Title>
                <Modal.Description class="text-gray-600 dark:text-gray-300">
                    {description}
                </Modal.Description>
                <Slot />
                <Modal.Close
                    class={cn(
                        buttonVariants({ size: 'icon', look: 'link' }),
                        'absolute right-3 top-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                    )}
                    type="submit"
                >
                    <LuX class="h-5 w-5" />
                </Modal.Close>
            </Modal.Panel>
        </Modal.Root>
    );
});
