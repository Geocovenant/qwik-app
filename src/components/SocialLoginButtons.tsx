import { component$ } from '@builder.io/qwik';
import { useSignIn } from '~/routes/plugin@auth';
import ImgGoogleLogo from '~/icons/google-logo.svg?jsx';
import ImgGithub from '~/icons/github.svg?jsx';
import { _ } from 'compiled-i18n';

export default component$(() => {
    const signInSig = useSignIn()
    return (
        <div class="space-y-3">
            <button
                class="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
                       text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-[#713fc2] transition-colors duration-200"
                onClick$={() => signInSig.submit({ providerId: 'google', options: { redirectTo: "/" } })}
            >
                <ImgGoogleLogo aria-label="Google" class="w-5 h-5 mr-3" />
                <span>{_`Continue with Google`}</span>
            </button>
            <button
                class="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
                       text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-[#713fc2] transition-colors duration-200"
                onClick$={() => signInSig.submit({ providerId: 'github', options: { redirectTo: "/" } })}
            >
                <ImgGithub aria-label="Github" class="w-5 h-5 mr-3" />
                <span>{_`Continue with Github`}</span>
            </button>
        </div>
    );
});
