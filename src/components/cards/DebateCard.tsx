import { component$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { Button } from "flowbite-qwik";

interface DebateCardProps {
    id: number;
    title: string;
    description: string;
}

export default component$<DebateCardProps>(({ id, title, description }) => {
    return (
        <li key={id} class="p-4 border rounded-md shadow-sm hover:shadow-md">
            <h3 class="text-xl font-semibold">{_`${title}`}</h3>
            <p class="text-gray-700">{_`${description}`}</p>
            <Button class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                {_`Join Debate`}
            </Button>
        </li>
    );
}); 