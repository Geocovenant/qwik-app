import { component$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { Button } from "flowbite-qwik";

interface PollCardProps {
    id: number
    title: string
    description: string
    options: { text: string, votes: number }[]
}

export default component$<PollCardProps>(({ id, title, description, options }) => {
    console.log('options', options);
    const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
    return (
        <li key={id} class="p-4 border rounded-md shadow-sm hover:shadow-md">
            <h3 class="text-xl font-semibold">{_`${title}`}</h3>
            <p class="text-gray-700">{_`${description}`}</p>
            <div>
                {options.map((option, index) => {
                    const percentage = ((option.votes / totalVotes) * 100).toFixed(2);
                    return (
                        <div key={index}>
                            <div class="flex justify-between mb-1">
                                <span>{option.text}</span>
                                <span>{`${percentage}% (${option.votes} votes)`}</span>
                            </div>
                            <div class="h-2 bg-blue-500 roundd">
                                <div
                                    class="h-full bg-red-300 rounded transition-all duration-500 ease-in-out"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            <Button class="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white">
                {_`Vote`}
            </Button>
        </li>
    );
})