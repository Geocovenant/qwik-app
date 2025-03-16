import { $, component$, useSignal, useTask$, useComputed$ } from "@builder.io/qwik";
import { Form, useNavigate } from "@builder.io/qwik-city";
import { LuLoader2, LuCheckCircle, LuAlertCircle, LuInfo } from "@qwikest/icons/lucide";
import { Image } from "@unpic/qwik";
import { useSetUsername } from "~/shared/actions";
import { useGetUser } from "~/shared/loaders";
import { _ } from "compiled-i18n";

export { useSetUsername } from "~/shared/actions";

export default component$(() => {
    const user = useGetUser();
    const nav = useNavigate();
    
    const usernameSignal = useSignal("");
    const usernameAction = useSetUsername();
    const errorMessage = useSignal("");
    const isLoading = useSignal(false);
    const isFocused = useSignal(false);
    
    // Generar sugerencia de nombre de usuario basada en session.user.name
    useTask$(({ track }) => {
        track(() => user.value.name);
        
        if (user.value.name) {
            // Transformar el nombre a un formato válido para nombre de usuario
            const suggestedUsername = user.value.name
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
        } else if (usernameSignal.value && usernameSignal.value.length < 3) {
            errorMessage.value = "Username must be at least 3 characters long";
        } else {
            errorMessage.value = "";
        }
    });

    const onSubmitCompleted = $(() => {
        nav(`/global`)
    });

    const isValid = useComputed$(() => {
        return usernameSignal.value && 
               usernameSignal.value.length >= 3 && 
               /^[a-zA-Z0-9_]+$/.test(usernameSignal.value) &&
               !errorMessage.value;
    });

    return (
        <div class="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#713fc2]/10 via-[#713fc2]/5 to-white dark:from-[#713fc2]/20 dark:via-[#713fc2]/10 dark:to-gray-900">
            {/* Decorative circles */}
            <div class="fixed -bottom-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-[#713fc2]/10 to-[#9333EA]/10 blur-3xl dark:from-[#713fc2]/5 dark:to-[#9333EA]/5 -z-10"></div>
            <div class="fixed -top-32 -right-32 w-64 h-64 rounded-full bg-gradient-to-r from-[#9333EA]/10 to-[#713fc2]/10 blur-3xl dark:from-[#9333EA]/5 dark:to-[#713fc2]/5 -z-10"></div>
            
            <div class="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-[#713fc2]/15 dark:border-[#9333EA]/15 relative overflow-hidden animate-fadeIn">
                {/* Decorative header line */}
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#713fc2] to-[#9333EA]"></div>
                
                <div class="flex justify-center mb-6">
                    <div class="p-3 bg-white/30 dark:bg-gray-800/30 rounded-full shadow-md mb-2">
                        <Image 
                            src="/src/icons/logo.svg" 
                            width="48" 
                            height="48" 
                            alt="Geounity Logo"
                            class="text-[#6B48FF] dark:text-[#9333EA]" 
                        />
                    </div>
                </div>

                <div class="mb-8">
                    <h2 class="text-2xl font-bold mb-3 text-center text-gray-900 dark:text-white">
                        {_`Choose your username`}
                    </h2>
                    <p class="text-gray-600 dark:text-gray-300 text-center mb-6">
                        {_`Your username is how others will find you on the platform. Choose something memorable and unique.`}
                    </p>

                    <Form action={usernameAction} onSubmitCompleted$={onSubmitCompleted} class="space-y-6">
                        <div class="relative">
                            <div class={`flex items-center border-2 rounded-lg overflow-hidden transition-all duration-200 ${isFocused.value ? 'border-[#713fc2] dark:border-[#9333EA] shadow-md' : 'border-gray-200 dark:border-gray-600'} ${errorMessage.value ? 'border-red-500 dark:border-red-400' : ''}`}>
                                <span class="pl-4 text-gray-400">@</span>
                                <input
                                    type="text"
                                    name="username"
                                    value={usernameSignal.value}
                                    onInput$={(e, el) => usernameSignal.value = el.value}
                                    onFocus$={() => isFocused.value = true}
                                    onBlur$={() => isFocused.value = false}
                                    placeholder="username"
                                    maxLength={15}
                                    class="w-full p-4 bg-transparent focus:outline-none dark:text-white"
                                    required
                                />
                                {usernameSignal.value && !errorMessage.value && usernameSignal.value.length >= 3 && (
                                    <span class="pr-4 text-green-500 dark:text-green-400">
                                        <LuCheckCircle />
                                    </span>
                                )}
                                {errorMessage.value && (
                                    <span class="pr-4 text-red-500 dark:text-red-400">
                                        <LuAlertCircle />
                                    </span>
                                )}
                            </div>
                            
                            {errorMessage.value && (
                                <p class="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center">
                                    <LuAlertCircle class="inline mr-1" /> {errorMessage.value}
                                </p>
                            )}
                            
                            {usernameAction.value?.failed && (
                                <p class="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center">
                                    <LuAlertCircle class="inline mr-1" />
                                    {usernameAction.value.fieldErrors?.username || "Something went wrong. Please try again."}
                                </p>
                            )}
                            
                            <div class="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-start">
                                <LuInfo class="inline mr-1 mt-0.5 flex-shrink-0" />
                                <span>
                                    {_`This will be your unique identifier and your profile URL: geounity.org/user/`}<strong class="text-[#713fc2] dark:text-[#9333EA]">{usernameSignal.value || "username"}</strong>
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            class="w-full py-4 px-6 flex items-center justify-center rounded-xl font-medium transition-all duration-200 relative overflow-hidden group"
                            disabled={!isValid.value || isLoading.value}
                            onClick$={() => {
                                isLoading.value = true;
                            }}
                        >
                            <div class={`absolute inset-0 ${isValid.value ? 'bg-gradient-to-r from-[#713fc2] to-[#9333EA] group-hover:from-[#9333EA] group-hover:to-[#713fc2]' : 'bg-gray-300 dark:bg-gray-600'} transition-all duration-300`}></div>
                            <span class="relative text-white flex items-center">
                                {isLoading.value ? (
                                    <><LuLoader2 class="mr-2 h-5 w-5 animate-spin" /> {_`Processing...`}</>
                                ) : (
                                    _`Continue`
                                )}
                            </span>
                        </button>
                    </Form>

                    <div class="text-center mt-8">
                        <a href="/help" class="text-[#713fc2] dark:text-[#9333EA] hover:underline text-sm flex items-center justify-center">
                            <LuInfo class="inline mr-1" />
                            {_`Why am I being asked for this information?`}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
});
