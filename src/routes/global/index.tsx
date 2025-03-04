import { component$ } from "@builder.io/qwik"
import type { DocumentHead } from "@builder.io/qwik-city"
import { LuGlobe, LuUsers, LuBarChart2, LuMessageSquare, LuBriefcase, LuFlag } from "@qwikest/icons/lucide"
import { _ } from "compiled-i18n"

export { useGetGlobalDebates, useFormDebateLoader, useGetTags } from "~/shared/loaders"
export { useFormDebateAction } from "~/shared/actions"

export default component$(() => {
    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-auto p-4 bg-gray-50">
            <header class="mb-6">
                <div class="flex items-center gap-3">
                    <LuGlobe class="w-10 h-10 text-blue-600" />
                    <h1 class="text-3xl font-bold">{_`Global Community`}</h1>
                </div>
                <p class="text-gray-600 mt-2">
                    {_`Welcome to the global community where all users connect, share ideas, and work together on worldwide
                    initiatives.`}
                </p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuGlobe class="w-5 h-5 text-blue-600" />
                        {_`Global Information`}
                    </h2>
                    <div class="space-y-4">
                        <div class="flex items-start gap-3">
                            <LuUsers class="w-5 h-5 text-gray-600 mt-1" />
                            <div>
                                <span class="font-medium">{_`World Population`}:</span> 8.1 billion
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuFlag class="w-5 h-5 text-gray-600 mt-1" />
                            <div>
                                <span class="font-medium">{_`Countries`}:</span> 195 recognized sovereign states
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuBarChart2 class="w-5 h-5 text-gray-600 mt-1" />
                            <div>
                                <span class="font-medium">{_`Languages`}:</span> Over 7,100 languages spoken worldwide
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuGlobe class="w-5 h-5 text-gray-600 mt-1" />
                            <div>
                                <span class="font-medium">{_`Land Area`}:</span> 148.9 million km²
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuGlobe class="w-5 h-5 text-gray-600 mt-1" />
                            <div>
                                <span class="font-medium">{_`Continents`}:</span> 7 (Africa, Antarctica, Asia, Europe, North America,
                                Oceania, South America)
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuBarChart2 class="w-5 h-5 text-blue-600" />
                        {_`Platform Statistics`}
                    </h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-blue-600">1,245</div>
                            <div class="text-sm text-gray-600">{_`Global Polls`}</div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-green-600">3,782</div>
                            <div class="text-sm text-gray-600">{_`Discussions`}</div>
                        </div>
                        <div class="bg-amber-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-amber-600">892</div>
                            <div class="text-sm text-gray-600">{_`Issues`}</div>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-purple-600">421</div>
                            <div class="text-sm text-gray-600">{_`Projects`}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="bg-white p-6 rounded-lg shadow col-span-1 lg:col-span-2">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuMessageSquare class="w-5 h-5 text-blue-600" />
                        {_`Global Trending Topics`}
                    </h2>
                    <div class="space-y-4">
                        <div class="border-b pb-3">
                            <h3 class="font-medium">{_`Climate Change Initiatives`}</h3>
                            <p class="text-sm text-gray-600">
                                {_`Discussions about global efforts to combat climate change and reduce carbon emissions.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{_`128 countries participating`}</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{_`3.2k discussions`}</span>
                            </div>
                        </div>
                        <div class="border-b pb-3">
                            <h3 class="font-medium">Global Economic Cooperation</h3>
                            <p class="text-sm text-gray-600">
                                {_`Exploring new frameworks for international trade and economic partnerships.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{_`94 countries participating`}</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{_`2.7k discussions`}</span>
                            </div>
                        </div>
                        <div class="border-b pb-3">
                            <h3 class="font-medium">Sustainable Development Goals</h3>
                            <p class="text-sm text-gray-600">
                                {_`Tracking progress on the UN's 17 Sustainable Development Goals worldwide.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{_`193 countries participating`}</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{_`4.5k discussions`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuBriefcase class="w-5 h-5 text-blue-600" />
                        {_`Active Global Projects`}
                    </h2>
                    <div class="space-y-4">
                        <div class="border-b pb-3">
                            <h3 class="font-medium">{_`Ocean Cleanup Initiative`}</h3>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{_`Progress`}:</span>
                                <span>68%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: 68%"></div>
                            </div>
                            <div class="text-xs text-gray-600 mt-2">{_`42 countries collaborating`}</div>
                        </div>
                        <div class="border-b pb-3">
                            <h3 class="font-medium">{_`Global Education Access`}</h3>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{_`Progress`}:</span>
                                <span>45%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: 45%"></div>
                            </div>
                            <div class="text-xs text-gray-600 mt-2">{_`78 countries collaborating`}</div>
                        </div>
                        <div class="border-b pb-3">
                            <h3 class="font-medium">{_`Renewable Energy Network`}</h3>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{_`Progress`}:</span>
                                <span>32%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: 32%"></div>
                            </div>
                            <div class="text-xs text-gray-600 mt-2">{_`56 countries collaborating`}</div>
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

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuUsers class="w-5 h-5 text-blue-600" />
                        {_`Most Active Communities`}
                    </h2>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">1</div>
                                <span>{_`European Union`}</span>
                            </div>
                            <span class="text-sm text-gray-600">{_`27 countries`}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">2</div>
                                <span>{_`ASEAN`}</span>
                            </div>
                            <span class="text-sm text-gray-600">{_`10 countries`}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">3</div>
                                <span>{_`African Union`}</span>
                            </div>
                            <span class="text-sm text-gray-600">{_`55 countries`}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">4</div>
                                <span>{_`G20`}</span>
                            </div>
                            <span class="text-sm text-gray-600">{_`20 countries`}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">5</div>
                                <span>{_`BRICS`}</span>
                            </div>
                            <span class="text-sm text-gray-600">{_`5 countries`}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuBarChart2 class="w-5 h-5 text-blue-600" />
                        {_`Global Challenges`}
                    </h2>
                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>{_`Climate Change`}</span>
                                <span class="text-sm text-gray-600">{_`92%`}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-red-500 h-2 rounded-full" style="width: 92%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>{_`Poverty & Inequality`}</span>
                                <span class="text-sm text-gray-600">{_`85%`}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-red-500 h-2 rounded-full" style="width: 85%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>{_`Food Security`}</span>
                                <span class="text-sm text-gray-600">{_`78%`}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-orange-500 h-2 rounded-full" style="width: 78%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>{_`Healthcare Access`}</span>
                                <span class="text-sm text-gray-600">{_`72%`}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-orange-500 h-2 rounded-full" style="width: 72%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>{_`Education`}</span>
                                <span class="text-sm text-gray-600">{_`65%`}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-yellow-500 h-2 rounded-full" style="width: 65%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export const head: DocumentHead = {
    title: "Geounity Global Community",
    meta: [
        {
            name: "description",
            content: "Global community overview for Geounity - connecting communities worldwide",
        },
    ],
}

