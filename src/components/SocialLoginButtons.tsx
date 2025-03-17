import { component$, useSignal } from '@builder.io/qwik';
import { useSignIn } from '~/routes/plugin@auth';
import ImgGoogleLogo from '~/icons/google-logo.svg?jsx';
import ImgGithub from '~/icons/github.svg?jsx';
import { LuLoader2 } from '@qwikest/icons/lucide';

export default component$(() => {
    const signInSig = useSignIn()
    const loading = useSignal<string | null>(null)
    return (
        <div class="flex flex-row gap-4 w-full">
            <button
                class="flex-1 w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
                    text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 focus:ring-[#713fc2] transition-colors duration-200 disabled:opacity-50"
                onClick$={() => {
                    loading.value = 'google'
                    signInSig.submit({ providerId: 'google', options: { redirectTo: "/" } })
                }}
            >
                <ImgGoogleLogo aria-label="Google" class="w-5 h-5 mr-3" />
                <span>Google</span>
                {loading.value === 'google' && <LuLoader2 class="ml-2 h-5 w-5 animate-spin" />}
            </button>
            <button
                class="flex-1 w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
                    text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 focus:ring-[#713fc2] transition-colors duration-200"
                onClick$={() => {
                    loading.value = 'github'
                    signInSig.submit({ providerId: 'github', options: { redirectTo: "/" } })
                }}
            >
                <ImgGithub aria-label="Github" class="w-5 h-5 mr-3" />
                <span>Github</span>
                {loading.value === 'github' && <LuLoader2 class="ml-2 h-5 w-5 animate-spin" />}
            </button>
        </div>
    );
});
