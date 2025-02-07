import { component$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { Button } from "flowbite-qwik";

interface PollCardProps {
    id: number
    title: string
    description: string
    options: { text: string, percentage: number }[]
}

export default component$<PollCardProps>(({ id, title, description, options }) => {
    return (
        <li key={id} class="p-4 border rounded-md shadow-sm hover:shadow-md">
            <h3 class="text-xl font-semibold">{_`${title}`}</h3>
            <p class="text-gray-700">{_`${description}`}</p>
            <div>
                {options.map((option, index) => (
                    <div key={index}>
                        <div class="flex justify-between mb-1">
                            <span>{option.text}</span>
                            <span>{option.percentage}%</span>
                        </div>
                        <div class="h-2 bg-blue-500 roundd">
                            <div
                                class="h-full bg-red-300 rounded transition-all duration-500 ease-in-out"
                                style={{ width: `${option.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <Button class="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white">
                {_`Vote`}
            </Button>
        </li>
    )
})