import { component$ } from "@builder.io/qwik"
import type { DocumentHead } from "@builder.io/qwik-city"
import { LuGlobe, LuUsers, LuBarChart2, LuMessageSquare, LuBriefcase, LuFlag } from "@qwikest/icons/lucide"
import { _ } from "compiled-i18n"

export { useGetInternationalDebates, useFormDebateLoader, useGetTags } from "~/shared/loaders"
export { useFormDebateAction } from "~/shared/actions"

export default component$(() => {
    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-auto p-4 bg-gray-50 dark:bg-gray-800">
            <header class="mb-6">
                <div class="flex items-center gap-3">
                    <LuGlobe class="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{_`Comunidad Internacional`}</h1>
                </div>
                <p class="text-gray-600 dark:text-gray-300 mt-2">
                    {_`Bienvenido a la comunidad internacional donde usuarios de diferentes países pueden conectar, compartir ideas y trabajar juntos en iniciativas transnacionales.`}
                </p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuGlobe class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Información Internacional`}
                    </h2>
                    <div class="space-y-4">
                        <div class="flex items-start gap-3">
                            <LuUsers class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Países Participantes`}:</span> 195 {_`naciones`}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuFlag class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Organizaciones Internacionales`}:</span> {_`ONU, UE, MERCOSUR, ASEAN`}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuBarChart2 class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Idiomas Principales`}:</span> {_`Inglés, Español, Francés, Árabe, Chino`}
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuGlobe class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                            <div class="dark:text-gray-300">
                                <span class="font-medium">{_`Continentes`}:</span> 7 ({_`África, Antártida, Asia, Europa, América del Norte, Oceanía, América del Sur`})
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBarChart2 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Estadísticas de la Plataforma`}
                    </h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">845</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Encuestas Internacionales`}</div>
                        </div>
                        <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-green-600 dark:text-green-400">1,723</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Debates`}</div>
                        </div>
                        <div class="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">516</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Problemas Reportados`}</div>
                        </div>
                        <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">329</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">{_`Proyectos`}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700 col-span-1 lg:col-span-2">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuMessageSquare class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Temas Tendencia Internacionales`}
                    </h2>
                    <div class="space-y-4">
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Acuerdos Climáticos Internacionales`}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {_`Discusiones sobre los esfuerzos multinacionales para combatir el cambio climático.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">{_`97 países participantes`}</span>
                                <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">{_`2.5k discusiones`}</span>
                            </div>
                        </div>
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Comercio Internacional Post-Pandemia`}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {_`Exploración de nuevos marcos para el comercio internacional y las cadenas de suministro.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">{_`84 países participantes`}</span>
                                <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">{_`1.9k discusiones`}</span>
                            </div>
                        </div>
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Seguridad Cibernética Global`}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {_`Debates sobre regulaciones y cooperación en temas de ciberseguridad entre naciones.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">{_`76 países participantes`}</span>
                                <span class="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">{_`1.3k discusiones`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:shadow-gray-700">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <LuBriefcase class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Proyectos Internacionales Activos`}
                    </h2>
                    <div class="space-y-4">
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Conectividad Digital Global`}</h3>
                            <div class="flex justify-between text-sm mt-1 text-gray-700 dark:text-gray-300">
                                <span>{_`Progreso`}:</span>
                                <span>52%</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style="width: 52%"></div>
                            </div>
                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">{_`38 países colaborando`}</div>
                        </div>
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Reducción de Plásticos en Océanos`}</h3>
                            <div class="flex justify-between text-sm mt-1 text-gray-700 dark:text-gray-300">
                                <span>{_`Progreso`}:</span>
                                <span>35%</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style="width: 35%"></div>
                            </div>
                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">{_`64 países colaborando`}</div>
                        </div>
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
                            <h3 class="font-medium text-gray-900 dark:text-white">{_`Vacunación Global`}</h3>
                            <div class="flex justify-between text-sm mt-1 text-gray-700 dark:text-gray-300">
                                <span>{_`Progreso`}:</span>
                                <span>78%</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style="width: 78%"></div>
                            </div>
                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">{_`129 países colaborando`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export const head: DocumentHead = {
    title: _`Geounity Comunidad Internacional`,
    meta: [
        {
            name: "description",
            content: _`Panorama de la comunidad internacional de Geounity - conectando comunidades de todo el mundo`,
        },
    ],
}