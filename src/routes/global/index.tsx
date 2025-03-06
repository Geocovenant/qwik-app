import { component$ } from "@builder.io/qwik"
import type { DocumentHead } from "@builder.io/qwik-city"
import { LuGlobe, LuUsers, LuBarChart2, LuMessageSquare, LuBriefcase, LuFlag } from "@qwikest/icons/lucide"
import { useGetGlobalDebates, useGetGlobalPolls, useGetGlobalProjects } from "~/shared/loaders"
import { _ } from "compiled-i18n"

export { useFormDebateLoader, useGetTags } from "~/shared/loaders"
export { useFormDebateAction } from "~/shared/actions"

export default component$(() => {

    const polls = useGetGlobalPolls();
    const debates = useGetGlobalDebates();
    const projects = useGetGlobalProjects();

    const pollsCount = polls.value.total || 0;
    const debatesCount = debates.value.total || 0;
    const projectsCount = projects.value.total || 0;
    const issuesCount = 0;

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-auto p-4 bg-gray-50 dark:bg-gray-800">
            <header class="mb-6">
                <div class="flex items-center gap-3">
                    <LuGlobe class="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{_`Global Community`}</h1>
                </div>
                <p class="text-gray-600 dark:text-gray-300 mt-2">
                    {_`Welcome to the global community where all users connect, share ideas, and work together on worldwide
                    initiatives.`}
                </p>
            </header>

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
                            <LuGlobe class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Land Area`}:</span> 148.9 {_`million km²`}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuGlobe class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Continents`}:</span> 7 ({_`Africa, Antarctica, Asia, Europe, North America,
                                Oceania, South America`})
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
                        <div class="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">{issuesCount}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Issues`}</div>
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
                    <div class="space-y-4">
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Climate Change Initiatives`}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {_`Discussions about global efforts to combat climate change and reduce carbon emissions.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">{_`128 countries participating`}</span>
                                <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">{_`3.2k discussions`}</span>
                            </div>
                        </div>
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Global Economic Cooperation`}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {_`Exploring new frameworks for international trade and economic partnerships.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">{_`94 countries participating`}</span>
                                <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">{_`2.7k discussions`}</span>
                            </div>
                        </div>
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Sustainable Development Goals`}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {_`Tracking progress on the UN's 17 Sustainable Development Goals worldwide.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">{_`193 countries participating`}</span>
                                <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">{_`4.5k discussions`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBriefcase class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Active Global Projects`}
                    </h2>
                    <div class="space-y-4">
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Ocean Cleanup Initiative`}</h3>
                            <div class="flex justify-between text-sm mt-1 text-gray-700 dark:text-gray-300">
                                <span>{_`Progress`}:</span>
                                <span>68%</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style="width: 68%"></div>
                            </div>
                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">{_`42 countries collaborating`}</div>
                        </div>
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Global Education Access`}</h3>
                            <div class="flex justify-between text-sm mt-1 text-gray-700 dark:text-gray-300">
                                <span>{_`Progress`}:</span>
                                <span>45%</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style="width: 45%"></div>
                            </div>
                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">{_`78 countries collaborating`}</div>
                        </div>
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Renewable Energy Network`}</h3>
                            <div class="flex justify-between text-sm mt-1 text-gray-700 dark:text-gray-300">
                                <span>{_`Progress`}:</span>
                                <span>32%</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style="width: 32%"></div>
                            </div>
                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">{_`56 countries collaborating`}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div class="bg-white p-6 rounded-lg shadow mb-6">
                <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                    <LuFileText class="w-5 h-5 text-blue-600" />
                    {_`Global Community Map`}
                </h2>
                <div class="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                        <LuGlobe class="w-16 h-16 text-gray-400 mx-auto" />
                        <p class="text-gray-500 mt-2">{_`Interactive world map showing community activity`}</p>
                    </div>
                </div>
            </div> */}
            
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

