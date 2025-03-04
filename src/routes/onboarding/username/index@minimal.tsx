import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { LuLoader2 } from "@qwikest/icons/lucide";
import { Image } from "@unpic/qwik";
import { _ } from "compiled-i18n";
import { useSession } from "~/routes/plugin@auth";
import { useSetUsername } from "~/shared/actions";

export { useSetUsername } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const usernameSignal = useSignal("");
    const usernameAction = useSetUsername();
    const errorMessage = useSignal("");
    const isLoading = useSignal(false);
    // Generar sugerencia de nombre de usuario basada en session.user.name
    useTask$(({ track }) => {
        track(() => session.value?.user?.name);
        
        if (session.value?.user?.name) {
            // Transformar el nombre a un formato válido para nombre de usuario
            const suggestedUsername = session.value.user.name
                .toLowerCase()
                .replace(/\s+/g, '') // Quitar espacios
                .replace(/[^a-z0-9_]/g, '') // Quitar caracteres especiales
                .substring(0, 15); // Limitar longitud a 15 caracteres
            
            if (suggestedUsername.length >= 3) {
                usernameSignal.value = suggestedUsername;
            }
        }
    });

    useTask$(({ track }) => {
        track(() => usernameSignal.value);

        // Validación simple
        if (usernameSignal.value && !/^[a-zA-Z0-9_]+$/.test(usernameSignal.value)) {
            errorMessage.value = "Username must contain only letters, numbers, and underscores";
        } else {
            errorMessage.value = "";
        }
    });

    return (
        <div class="flex justify-center items-center min-h-screen bg-gray-100">
            <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-4">
                    <button class="text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div class="flex justify-center flex-grow">
                        <Image src="/src/icons/logo.svg" width="32" height="32" alt="Logo" />
                    </div>
                    <div class="w-6"></div> {/* Empty div for balance */}
                </div>

                <div class="mb-6">
                    <h2 class="text-2xl font-bold mb-2">{_`Choose your username`}</h2>
                    <p class="text-gray-600 mb-4">
                        {_`Your username is how others will find you on the platform. Choose something memorable and unique.`}
                    </p>

                    <Form action={usernameAction}>
                        <div class="mb-4">
                            <input
                                type="text"
                                name="username"
                                value={usernameSignal.value}
                                onInput$={(e, el) => usernameSignal.value = el.value}
                                placeholder="username"
                                class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                            {errorMessage.value && (
                                <p class="text-red-500 text-sm mt-1">{errorMessage.value}</p>
                            )}
                            {usernameAction.value?.failed && (
                                <p class="text-red-500 text-sm mt-1">
                                    {usernameAction.value.fieldErrors?.username || "Something went wrong. Please try again."}
                                </p>
                            )}
                        </div>

                        <div class="mb-4">
                            <button
                                type="submit"
                                class="flex justify-center items-center w-full py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-200 disabled:bg-gray-400"
                                disabled={!!errorMessage.value || !usernameSignal.value || usernameSignal.value.length < 3}
                                onClick$={() => {
                                    isLoading.value = true;
                                }}
                            >
                                {isLoading.value ? (
                                    <LuLoader2 class="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    _`Continue`
                                )}
                            </button>
                        </div>
                    </Form>

                    <div class="text-center">
                        <a href="/help" class="text-purple-500 hover:underline text-sm">
                            {_`Why am I being asked for this information?`}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
});
