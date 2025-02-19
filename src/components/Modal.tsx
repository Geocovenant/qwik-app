import { component$, type Signal, Slot, useSignal, useStyles$ } from '@builder.io/qwik';
import { cn } from '@qwik-ui/utils';
import { LuX } from '@qwikest/icons/lucide';
import { Modal, buttonVariants } from '~/components/ui';
import styles from './modal.css?inline';

export default component$<{ title: string, description: string, show: Signal<boolean>, trigger?: string }>(({ title, description, show, trigger }) => {
    useStyles$(styles);
    const isExpanded = useSignal<boolean>(false);
    return (
        <Modal.Root bind:show={show}>
            {trigger && <Modal.Trigger>
                {trigger}
            </Modal.Trigger>}
            <Modal.Panel class={`modal-panel ${isExpanded.value ? 'modal-expanded' : ''}`}>
                <Modal.Title class="modal-title">{title}</Modal.Title>
                <Modal.Description>
                    {description}
                </Modal.Description>
                <Slot />
                <Modal.Close
                    class={cn(
                        buttonVariants({ size: 'icon', look: 'link' }),
                        'absolute right-3 top-2',
                    )}
                    type="submit"
                >
                    <LuX class="h-5 w-5" />
                </Modal.Close>
            </Modal.Panel>
        </Modal.Root>
    );
});
