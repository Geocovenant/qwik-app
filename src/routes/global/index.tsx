import { component$ } from "@builder.io/qwik"
import type { DocumentHead } from "@builder.io/qwik-city"
import { LuGlobe, LuUsers, LuBarChart2, LuMessageSquare, LuBriefcase, LuFlag, LuInfo, LuBuilding2, LuBuilding } from "@qwikest/icons/lucide"
import { Alert } from "~/components/ui/alert/alert"
import { _ } from "compiled-i18n"

import { useGetGlobalPolls, useGetGlobalDebates, useGetGlobalProjects } from "~/shared/global/loaders"

export default component$(() => {

    const polls = useGetGlobalPolls();
    const debates = useGetGlobalDebates();
    const projects = useGetGlobalProjects();

    const pollsCount = polls.value.total || 0;
    const debatesCount = debates.value.total || 0;
    const projectsCount = projects.value.total || 0;

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] p-4 bg-gray-50 dark:bg-gray-800">
            <header class="mb-6">
                <div class="flex items-center gap-3">
                    <LuGlobe class="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{_`Global Community`}</h1>
                </div>
            </header>

            <Alert.Root look="primary" class="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
                <div class="flex gap-2">
                    <LuInfo class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                        <Alert.Title class="text-blue-800 dark:text-blue-300">{_`About the Global Community`}</Alert.Title>
                        <Alert.Description class="text-blue-700 dark:text-blue-400">
                            {_`The global community includes all countries and users around the world. Here you can participate in worldwide initiatives that affect the entire planet and connect with people from any country.`}
                        </Alert.Description>
                    </div>
                </div>
            </Alert.Root>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuGlobe class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Global Information`}
                    </h2>
                    <div class="space-y-4">
                        <div class="flex items-start gap-3">
                            <LuUsers class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`World Population`}:</span> 8.1 {_`billion`}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuFlag class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Countries`}:</span> 249 {_`registered in the platform`}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuBarChart2 class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Regions`}:</span> 1,381 {_`registered in the platform`}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuBuilding class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Sub Regions`}:</span> 145 {_`registered in the platform`}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuBuilding2 class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Localities`}:</span> 88 {_`registered in the platform`}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBarChart2 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Platform Statistics`}
                    </h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{pollsCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Global Polls`}</div>
                        </div>
                        <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-green-600 dark:text-green-400">{debatesCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Discussions`}</div>
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
                        {_`Global Trending Topics`}
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 text-center py-8 italic">
                        {_`No trending topics available yet. Be the first to start a global conversation!`}
                    </p>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBriefcase class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Active Global Projects`}
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 text-center py-8 italic">
                        {_`No active global projects available yet. Consider proposing a new initiative!`}
                    </p>
                </div>
            </div>
        </div>
    )
})

export const head: DocumentHead = {
    title: _`Geounity Global Community`,
    meta: [
        {
            name: "description",
            content: _`Global community overview for Geounity - connecting communities worldwide`,
        },
    ],
}

