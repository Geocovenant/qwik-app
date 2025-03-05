import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { LuEye, LuEyeOff, LuSettings, LuUserCheck, LuUsers } from "@qwikest/icons/lucide";
import { useSession } from "~/routes/plugin@auth";
import { Image } from "@unpic/qwik";

// Importamos los loaders necesarios
import { useGetGlobalMembers } from "~/shared/loaders";
import { useUpdateCommunityVisibility } from "~/shared/actions";

// Exportamos los loaders para que Qwik City pueda encontrarlos
export { useGetGlobalMembers } from "~/shared/loaders";

export default component$(() => {
    const session = useSession();
    const members = useGetGlobalMembers();
    const updateCommunityVisibilityAction = useUpdateCommunityVisibility();
    const isPublic = useSignal(members.value.items.find((m: any) => m.is_current_user)?.is_public || false);
    const currentPage = useSignal(1);
    const nav = useNavigate();
    const isAuthenticated = useComputed$(() => !!session.value?.user);

    // Toggle para cambiar la visibilidad del usuario
    const togglePublicVisibility = $(async () => {
        if (!isAuthenticated.value) return;

        const newValue = !isPublic.value;
        isPublic.value = newValue;

        await updateCommunityVisibilityAction.submit({ 
            communityId: 1,
            isPublic: newValue 
        });
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="flex flex-col min-h-0">
                <div class="h-full overflow-y-auto p-4 bg-gray-50">
                    {/* Encabezado con título y estadísticas */}
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center">
                            <LuUsers class="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <h1 class="text-2xl font-bold">{_`Miembros de la comunidad global`}</h1>
                                <p class="text-gray-600">
                                    {_`Descubre y conecta con otros usuarios de la plataforma.`}
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 sm:mt-0 flex items-center gap-2 pl-3">
                            <span class="text-lg font-semibold text-blue-700">
                                {members.value.total} {_`miembros`}
                            </span>
                        </div>
                    </div>

                    {/* Configuración de privacidad */}
                    {isAuthenticated.value && (
                        <div class="mb-6 bg-white p-4 rounded-lg shadow">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <LuSettings class="w-5 h-5 text-gray-600" />
                                    <h2 class="text-lg font-semibold">{_`Configuración de privacidad`}</h2>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm text-gray-600">
                                        {isPublic.value ? _`Visible para todos` : _`Perfil oculto`}
                                    </span>
                                    <button
                                        onClick$={togglePublicVisibility}
                                        class={`w-14 h-7 rounded-full flex items-center px-1 transition-colors ${isPublic.value ? "bg-blue-600 justify-end" : "bg-gray-300 justify-start"
                                            }`}
                                        aria-label={
                                            isPublic.value
                                                ? _`Cambiar a perfil oculto`
                                                : _`Cambiar a perfil visible`
                                        }
                                    >
                                        <div class="w-5 h-5 bg-white rounded-full shadow-md"></div>
                                    </button>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 mt-2 ml-8">
                                {isPublic.value
                                    ? _`Tu perfil es visible para todos los miembros de la comunidad.`
                                    : _`Tu perfil está oculto. Solo tú puedes verlo en esta lista.`}
                            </p>
                        </div>
                    )}

                    {/* Lista de miembros */}
                    <div class="bg-white rounded-lg shadow">
                        <div class="border-b border-gray-200 p-4">
                            <div class="flex items-center gap-2">
                                <LuUserCheck class="w-5 h-5 text-blue-600" />
                                <h2 class="text-lg font-semibold">{_`Miembros visibles`}</h2>
                            </div>
                            <p class="text-sm text-gray-600 mt-1 ml-7">
                                {_`Estos miembros han elegido hacer su perfil visible en la comunidad.`}
                            </p>
                        </div>

                        {members.value.items.length > 0 ? (
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                                {members.value.items.map((member: any) => (
                                    <div key={member.id} class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div class="relative">
                                            <Image
                                                src={member.image || "/images/default-avatar.png"}
                                                alt={member.username || "User"}
                                                class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                            />
                                            {member.is_current_user && (
                                                <div class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div class="flex-1 overflow-hidden">
                                            <h3 class="font-medium truncate">{member.name || member.username || _`Usuario anónimo`}</h3>
                                            {member.username && (
                                                <p class="text-sm text-gray-600 truncate">@{member.username}</p>
                                            )}
                                        </div>
                                        {!member.is_current_user && isAuthenticated.value && (
                                            <button
                                                class="text-blue-600 hover:text-blue-800"
                                                aria-label={_`Ver perfil de ${member.username}`}
                                                onClick$={() => nav(`/user/${member.username}`)}
                                            >
                                                <LuEye class="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div class="flex flex-col items-center justify-center p-8 text-center">
                                <LuEyeOff class="w-12 h-12 text-gray-400 mb-2" />
                                <h3 class="text-lg font-medium text-gray-700">{_`No hay miembros visibles`}</h3>
                                <p class="text-gray-500 mt-1 max-w-md">
                                    {isAuthenticated.value
                                        ? _`Puedes ser el primero en hacer tu perfil visible activando el toggle de arriba.`
                                        : _`Los miembros han elegido mantener sus perfiles privados.`}
                                </p>
                            </div>
                        )}

                        {/* Paginación */}
                        {members.value.pages > 1 && (
                            <div class="flex justify-center items-center gap-2 p-4 border-t">
                                <button
                                    onClick$={async () => {
                                        if (currentPage.value > 1) {
                                            currentPage.value--;
                                            await nav(`/global/members?page=${currentPage.value}`);
                                        }
                                    }}
                                    disabled={currentPage.value === 1}
                                    class={`px-3 py-1 rounded ${currentPage.value === 1
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    {_`Anterior`}
                                </button>

                                <span class="text-sm text-gray-600">
                                    {_`Página ${currentPage.value} de ${members.value.pages}`}
                                </span>

                                <button
                                    onClick$={async () => {
                                        if (currentPage.value < members.value.pages) {
                                            currentPage.value++;
                                            await nav(`/global/members?page=${currentPage.value}`);
                                        }
                                    }}
                                    disabled={currentPage.value === members.value.pages}
                                    class={`px-3 py-1 rounded ${currentPage.value === members.value.pages
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    {_`Siguiente`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Miembros de la Comunidad Global",
    meta: [
        {
            name: "description",
            content: "Descubre y conecta con otros miembros de la comunidad global de Geounity",
        },
    ],
};

// Al final exportamos solo la acción local
// export { useUpdatePrivacySettings };

// Al final del archivo, exportar la nueva acción
export { useUpdateCommunityVisibility };
