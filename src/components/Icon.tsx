import { component$ } from "@builder.io/qwik";

export type IconName = 'poll' | 'chat' | 'sparkles' | 'exclamation-circle' | 'users';
export interface IconProps {
    name: IconName;
    class?: string;
}

export default component$<IconProps>((props) => {
    const icons = {
        poll: 'i-ph-poll-fill',
        chat: 'i-ph-chat-circle-fill',
        sparkles: 'i-ph-sparkles-fill',
        'exclamation-circle': 'i-ph-exclamation-circle-fill',
        users: 'i-ph-users-fill',
    };

    return (
        <i
            class={[icons[props.name], props.class]}
        />
    );
});