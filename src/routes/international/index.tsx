import { component$ } from "@builder.io/qwik"
import type { DocumentHead } from "@builder.io/qwik-city"
import { LuGlobe, LuUsers, LuBarChart2, LuMessageSquare, LuBriefcase, LuFlag } from "@qwikest/icons/lucide"
import { _ } from "compiled-i18n"

export { useGetInternationalDebates, useFormDebateLoader, useGetTags } from "~/shared/loaders"
export { useFormDebateAction } from "~/shared/actions"

export default component$(() => {
    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-auto p-4 bg-gray-50">
            <header class="mb-6">
                <div class="flex items-center gap-3">
                    <LuGlobe class="w-10 h-10 text-blue-600" />
                    <h1 class="text-3xl font-bold">{_`Comunidad Internacional`}</h1>
                </div>
                <p class="text-gray-600 mt-2">
                    {_`Bienvenido a la comunidad internacional donde usuarios de diferentes países pueden conectar, compartir ideas y trabajar juntos en iniciativas transnacionales.`}
                </p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuGlobe class="w-5 h-5 text-blue-600" />
                        {_`Información Internacional`}
                    </h2>
                    <div class="space-y-4">
                        <div class="flex items-start gap-3">
                            <LuUsers class="w-5 h-5 text-gray-600 mt-1" />
                            <div>
                                <span class="font-medium">{_`Países Participantes`}:</span> 195 naciones
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuFlag class="w-5 h-5 text-gray-600 mt-1" />
                            <div>
                                <span class="font-medium">{_`Organizaciones Internacionales`}:</span> ONU, UE, MERCOSUR, ASEAN
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuBarChart2 class="w-5 h-5 text-gray-600 mt-1" />
                            <div>
                                <span class="font-medium">{_`Idiomas Principales`}:</span> Inglés, Español, Francés, Árabe, Chino
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <LuGlobe class="w-5 h-5 text-gray-600 mt-1" />
                            <div>
                                <span class="font-medium">{_`Continentes`}:</span> 7 (África, Antártida, Asia, Europa, América del Norte, Oceanía, América del Sur)
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuBarChart2 class="w-5 h-5 text-blue-600" />
                        {_`Estadísticas de la Plataforma`}
                    </h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-blue-600">845</div>
                            <div class="text-sm text-gray-600">{_`Encuestas Internacionales`}</div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-green-600">1,723</div>
                            <div class="text-sm text-gray-600">{_`Debates`}</div>
                        </div>
                        <div class="bg-amber-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-amber-600">516</div>
                            <div class="text-sm text-gray-600">{_`Problemas Reportados`}</div>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <div class="text-3xl font-bold text-purple-600">329</div>
                            <div class="text-sm text-gray-600">{_`Proyectos`}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div class="bg-white p-6 rounded-lg shadow col-span-1 lg:col-span-2">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuMessageSquare class="w-5 h-5 text-blue-600" />
                        {_`Temas Tendencia Internacionales`}
                    </h2>
                    <div class="space-y-4">
                        <div class="border-b pb-3">
                            <h3 class="font-medium">{_`Acuerdos Climáticos Internacionales`}</h3>
                            <p class="text-sm text-gray-600">
                                {_`Discusiones sobre los esfuerzos multinacionales para combatir el cambio climático.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{_`97 países participantes`}</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{_`2.5k discusiones`}</span>
                            </div>
                        </div>
                        <div class="border-b pb-3">
                            <h3 class="font-medium">{_`Comercio Internacional Post-Pandemia`}</h3>
                            <p class="text-sm text-gray-600">
                                {_`Exploración de nuevos marcos para el comercio internacional y las cadenas de suministro.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{_`84 países participantes`}</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{_`1.9k discusiones`}</span>
                            </div>
                        </div>
                        <div class="border-b pb-3">
                            <h3 class="font-medium">{_`Seguridad Cibernética Global`}</h3>
                            <p class="text-sm text-gray-600">
                                {_`Debates sobre regulaciones y cooperación en temas de ciberseguridad entre naciones.`}
                            </p>
                            <div class="flex gap-2 mt-2">
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{_`76 países participantes`}</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{_`1.3k discusiones`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuBriefcase class="w-5 h-5 text-blue-600" />
                        {_`Proyectos Internacionales Activos`}
                    </h2>
                    <div class="space-y-4">
                        <div class="border-b pb-3">
                            <h3 class="font-medium">{_`Conectividad Digital Global`}</h3>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{_`Progreso`}:</span>
                                <span>52%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: 52%"></div>
                            </div>
                            <div class="text-xs text-gray-600 mt-2">{_`38 países colaborando`}</div>
                        </div>
                        <div class="border-b pb-3">
                            <h3 class="font-medium">{_`Reducción de Plásticos en Océanos`}</h3>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{_`Progreso`}:</span>
                                <span>35%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: 35%"></div>
                            </div>
                            <div class="text-xs text-gray-600 mt-2">{_`64 países colaborando`}</div>
                        </div>
                        <div class="border-b pb-3">
                            <h3 class="font-medium">{_`Vacunación Global`}</h3>
                            <div class="flex justify-between text-sm mt-1">
                                <span>{_`Progreso`}:</span>
                                <span>78%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: 78%"></div>
                            </div>
                            <div class="text-xs text-gray-600 mt-2">{_`129 países colaborando`}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuUsers class="w-5 h-5 text-blue-600" />
                        {_`Organizaciones Más Activas`}
                    </h2>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">1</div>
                                <span>{_`Naciones Unidas`}</span>
                            </div>
                            <span class="text-sm text-gray-600">{_`193 países`}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">2</div>
                                <span>{_`Unión Europea`}</span>
                            </div>
                            <span class="text-sm text-gray-600">{_`27 países`}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">3</div>
                                <span>{_`Unión Africana`}</span>
                            </div>
                            <span class="text-sm text-gray-600">{_`55 países`}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">4</div>
                                <span>{_`ASEAN`}</span>
                            </div>
                            <span class="text-sm text-gray-600">{_`10 países`}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">5</div>
                                <span>{_`MERCOSUR`}</span>
                            </div>
                            <span class="text-sm text-gray-600">{_`5 países`}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LuBarChart2 class="w-5 h-5 text-blue-600" />
                        {_`Retos Internacionales`}
                    </h2>
                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>{_`Cambio Climático`}</span>
                                <span class="text-sm text-gray-600">{_`94%`}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-red-500 h-2 rounded-full" style="width: 94%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>{_`Migración`}</span>
                                <span class="text-sm text-gray-600">{_`87%`}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-red-500 h-2 rounded-full" style="width: 87%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>{_`Seguridad Alimentaria`}</span>
                                <span class="text-sm text-gray-600">{_`82%`}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-orange-500 h-2 rounded-full" style="width: 82%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>{_`Pandemias`}</span>
                                <span class="text-sm text-gray-600">{_`75%`}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-orange-500 h-2 rounded-full" style="width: 75%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>{_`Ciberseguridad`}</span>
                                <span class="text-sm text-gray-600">{_`68%`}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-yellow-500 h-2 rounded-full" style="width: 68%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export const head: DocumentHead = {
    title: "Geounity Comunidad Internacional",
    meta: [
        {
            name: "description",
            content: "Panorama de la comunidad internacional de Geounity - conectando comunidades de todo el mundo",
        },
    ],
}