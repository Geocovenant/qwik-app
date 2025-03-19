import { component$ } from "@builder.io/qwik"
import type { DocumentHead } from "@builder.io/qwik-city"
import { LuGlobe2, LuUsers, LuBarChart2, LuMessageSquare, LuBriefcase, LuFlag, LuInfo } from "@qwikest/icons/lucide"
import { Alert } from "~/components/ui/alert/alert"
import { _ } from "compiled-i18n"

const useGetInternationalPolls = () => ({ value: { total: 0 } });
const useGetInternationalDebates = () => ({ value: { total: 0 } });
const useGetInternationalProjects = () => ({ value: { total: 0 } });

export default component$(() => {

    const polls = useGetInternationalPolls();
    const debates = useGetInternationalDebates();
    const projects = useGetInternationalProjects();

    const pollsCount = polls.value.total || 0;
    const debatesCount = debates.value.total || 0;
    const projectsCount = projects.value.total || 0;

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] p-4 bg-gray-50 dark:bg-gray-800">
            <header class="mb-6">
                <div class="flex items-center gap-3">
                    <LuGlobe2 class="w-10 h-10 text-green-600 dark:text-green-400" />
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{_`International Community`}</h1>
                </div>
            </header>

            <Alert.Root look="primary" class="mb-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
                <div class="flex gap-2">
                    <LuInfo class="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                        <Alert.Title class="text-green-800 dark:text-green-300">{_`About the International Community`}</Alert.Title>
                        <Alert.Description class="text-green-700 dark:text-green-400">
                            {_`The international community connects people from different countries working on shared initiatives and regional collaboration. Here you can participate in international debates and projects that impact multiple nations.`}
                        </Alert.Description>
                    </div>
                </div>
            </Alert.Root>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuGlobe2 class="w-5 h-5 text-green-600 dark:text-green-400" />
                        {_`International Information`}
                    </h2>
                    <div class="space-y-4">
                        <div class="flex items-start gap-3">
                            <LuUsers class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Active International Communities`}:</span> {_`Coming soon`}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuFlag class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Registered Countries`}:</span> {_`Coming soon`}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuBarChart2 class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Active International Initiatives`}:</span> {_`Coming soon`}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBarChart2 class="w-5 h-5 text-green-600 dark:text-green-400" />
                        {_`International Statistics`}
                    </h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-green-600 dark:text-green-400">{pollsCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`International Polls`}</div>
                        </div>
                        <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{debatesCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`International Discussions`}</div>
                        </div>
                        <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{projectsCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`International Projects`}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700 col-span-1 lg:col-span-2">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuMessageSquare class="w-5 h-5 text-green-600 dark:text-green-400" />
                        {_`International Trending Topics`}
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 text-center py-8 italic">
                        {_`No trending topics available yet. Be the first to start an international conversation!`}
                    </p>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBriefcase class="w-5 h-5 text-green-600 dark:text-green-400" />
                        {_`Active International Projects`}
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 text-center py-8 italic">
                        {_`No active international projects available yet. Consider proposing a new initiative!`}
                    </p>
                </div>
            </div>
        </div>
    )
})

export const head: DocumentHead = {
    title: _`Geounity International Community`,
    meta: [
        {
            name: "description",
            content: _`International community overview for Geounity - connecting communities across countries`,
        },
    ],
}