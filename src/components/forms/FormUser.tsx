import { component$, useStore, $ } from "@builder.io/qwik";

export default component$(() => {
    const formData = useStore({
        nombre: "",
        correo: "",
        bio: "",
        ubicacion: "",
        sitioWeb: ""
    });

    const handleSubmit = $((event: Event) => {
        event.preventDefault();
        // Aquí se puede enviar el formulario a la API para actualizar el perfil del usuario
        console.log("Datos del formulario:", formData);
    });

    return (
        <form onSubmit$={handleSubmit} class="space-y-4 p-4">
            <div>
                <label for="nombre" class="block text-sm font-medium text-gray-700">
                    Nombre Completo
                </label>
                <input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    placeholder="Ingresa tu nombre completo"
                    class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label for="correo" class="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                </label>
                <input
                    id="correo"
                    type="email"
                    value={formData.correo}
                    placeholder="Ingresa tu correo electrónico"
                    class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label for="bio" class="block text-sm font-medium text-gray-700">
                    Biografía
                </label>
                <textarea
                    id="bio"
                    value={formData.bio}
                    placeholder="Cuéntanos algo sobre ti"
                    rows={3}
                    class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
            </div>
            <div>
                <label for="ubicacion" class="block text-sm font-medium text-gray-700">
                    Ubicación
                </label>
                <input
                    id="ubicacion"
                    type="text"
                    value={formData.ubicacion}
                    placeholder="Ingresa tu ubicación"
                    class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label for="sitioWeb" class="block text-sm font-medium text-gray-700">
                    Sitio Web
                </label>
                <input
                    id="sitioWeb"
                    type="url"
                    value={formData.sitioWeb}
                    placeholder="Ingresa tu sitio web"
                    class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div class="flex justify-end">
                <button
                    type="submit"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Guardar cambios
                </button>
            </div>
        </form>
    );
});
