import { component$ } from "@builder.io/qwik"
import type { DocumentHead } from "@builder.io/qwik-city"
import { LuGlobe, LuBarChart2, LuMessageSquare, LuBriefcase, LuInfo } from "@qwikest/icons/lucide"
import { useGetInternationalPolls, useGetInternationalDebates, useGetInternationalProjects } from "~/shared/loaders"
import { _ } from "compiled-i18n"
import { Alert } from "~/components/ui/alert/alert"

export { useGetInternationalPolls, useGetInternationalDebates, useGetInternationalProjects, useFormDebateLoader, useGetTags } from "~/shared/loaders"
export { useFormDebateAction } from "~/shared/forms/actions"

export default component$(() => {
    // Get real data from the API
    const polls = useGetInternationalPolls();
    const debates = useGetInternationalDebates();
    const projects = useGetInternationalProjects();

    // Calculate counts from the API responses
    const pollsCount = polls.value.total || 0;
    const debatesCount = debates.value.total || 0;
    const projectsCount = projects.value.total || 0;

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-auto p-4 bg-gray-50 dark:bg-gray-800">
            <header class="mb-6">
                <div class="flex items-center gap-3">
                    <LuGlobe class="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{_`International Community`}</h1>
                </div>
            </header>

            <Alert.Root look="primary" class="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
                <div class="flex gap-2">
                    <LuInfo class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                        <Alert.Title class="text-blue-800 dark:text-blue-300">{_`About the International Community`}</Alert.Title>
                        <Alert.Description class="text-blue-700 dark:text-blue-400">
                            {_`While the global community includes all countries in the world, the international community groups a select set of countries that share common interests or specific agreements. Here you can participate in initiatives between specific countries.`}
                        </Alert.Description>
                    </div>
                </div>
            </Alert.Root>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBarChart2 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Platform Statistics`}
                    </h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{pollsCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Polls`}</div>
                        </div>
                        <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-green-600 dark:text-green-400">{debatesCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Debates`}</div>
                        </div>
                        <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{projectsCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Projects`}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700 col-span-1 lg:col-span-2">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuMessageSquare class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`International Trending Topics`}
                    </h2>
                    <div class="space-y-4">
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`International Climate Agreements`}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {_`Discussions on multinational efforts to combat climate change.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">{_`97 participating countries`}</span>
                                <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">{_`2.5k discussions`}</span>
                            </div>
                        </div>
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Post-Pandemic International Trade`}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {_`Exploration of new frameworks for international trade and supply chains.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">{_`84 participating countries`}</span>
                                <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">{_`1.9k discussions`}</span>
                            </div>
                        </div>
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Global Cybersecurity`}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {_`Debates on regulations and cooperation on cybersecurity issues among nations.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">{_`76 participating countries`}</span>
                                <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">{_`1.3k discussions`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBriefcase class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Active International Projects`}
                    </h2>
                    <div class="space-y-4">
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Global Digital Connectivity`}</h3>
                            <div class="flex justify-between text-sm mt-1 text-gray-700 dark:text-gray-300">
                                <span>{_`Progress`}:</span>
                                <span>52%</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style="width: 52%"></div>
                            </div>
                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">{_`38 countries collaborating`}</div>
                        </div>
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Reduction of Plastics in Oceans`}</h3>
                            <div class="flex justify-between text-sm mt-1 text-gray-700 dark:text-gray-300">
                                <span>{_`Progress`}:</span>
                                <span>35%</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style="width: 35%"></div>
                            </div>
                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">{_`64 countries collaborating`}</div>
                        </div>
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Global Vaccination`}</h3>
                            <div class="flex justify-between text-sm mt-1 text-gray-700 dark:text-gray-300">
                                <span>{_`Progress`}:</span>
                                <span>78%</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style="width: 78%"></div>
                            </div>
                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">{_`129 countries collaborating`}</div>
                        </div>
                    </div>
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
            content: _`Overview of the Geounity international community - connecting communities around the world`,
        },
    ],
}