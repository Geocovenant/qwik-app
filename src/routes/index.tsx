import { type Session } from "@auth/qwik";
import { component$ } from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import ImgLogo from '~/icons/logo.svg?jsx';

export const onRequest: RequestHandler = async (event) => {
  const session: Session | null = event.sharedMap.get('session');
  console.log('+++++ session +++++', session)
  if (session && new Date(session.expires) >= new Date()) {
    throw event.redirect(302, '/global')
  }
}

export default component$(() => {
  return (
    <div class="min-h-screen bg-gradient-to-b from-[#713fc2]/5 to-white dark:from-[#713fc2]/10 dark:to-gray-900 flex flex-col justify-center pt-5">
      <div class="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div class="flex flex-col items-center mb-10">
          <ImgLogo class="w-20 h-20 text-[#713fc2] dark:text-[#9333EA] mb-4" aria-hidden="true" />
          ``
          <h1 class="text-center text-5xl font-bold bg-gradient-to-r from-[#713fc2] to-[#8255c9] bg-clip-text text-transparent dark:from-[#9333EA] dark:to-[#A855F7]">
            {_`Welcome to Geounity`}
          </h1>
          
          <p class="mt-4 text-center text-2xl font-medium text-gray-700 dark:text-gray-300">
            {_`Transform your community with collective decisions`}
          </p>
          
          <p class="mt-3 text-center text-lg text-gray-600 dark:text-gray-400 max-w-2xl px-4">
            {_`Connect with neighbors, organizations, and governments to create real change in your locality and worldwide`}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 py-10 px-6 shadow-2xl shadow-[#713fc2]/10 dark:shadow-[#9333EA]/10 sm:rounded-2xl sm:px-12 border border-[#713fc2]/15 dark:border-[#9333EA]/15">
          <div class="space-y-8">
            <div class="text-center">
              <div class="space-y-6 mb-10">
                <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  {_`Together we can:`}
                </h3>
                
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {[
                    { icon: '📊', text: _`Create and participate in polls` },
                    { icon: '💬', text: _`Debate important topics` },
                    { icon: '🛠️', text: _`Propose and collaborate on projects` },
                    { icon: '🚨', text: _`Report community issues` },
                    { icon: '🌍', text: _`Connect across communities` },
                    { icon: '🔒', text: _`Secure and private participation` }
                  ].map((item) => (
                    <li key={item.text} class="flex items-start space-x-3 p-3 bg-gray-50/50 dark:bg-gray-900/20 rounded-lg">
                      <span class="text-2xl">{item.icon}</span>
                      <span class="text-gray-700 dark:text-gray-300">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div class="mb-8">
                <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                  {_`Join over 10,000 active community builders!`}
                </p>
                
                <div class="relative">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div class="relative flex justify-center text-sm">
                    <span class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                      {_`Get started in 1 click`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <SocialLoginButtons />
              
              <a 
                href="/email-signup" 
                class="block w-full px-4 py-3 border-2 border-[#713fc2]/20 dark:border-[#9333EA]/30 text-[#713fc2] dark:text-[#9333EA] hover:bg-[#713fc2]/5 dark:hover:bg-[#9333EA]/10 rounded-lg font-medium text-center transition-colors"
              >
                {_`Continue with Email`}
              </a>
            </div>

            <div class="mt-8 text-center space-y-3">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                🔒 {_`Your data is 100% secure and private`}
              </p>
              
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {_`By continuing, you agree to our `}
                <a href="/terms" class="font-medium underline underline-offset-4 decoration-[#713fc2]/30 hover:decoration-[#713fc2]/60 dark:decoration-[#9333EA]/50 dark:hover:decoration-[#9333EA]">
                  {_`Terms of Service`}
                </a>
                {_` and `}
                <a href="/privacy" class="font-medium underline underline-offset-4 decoration-[#713fc2]/30 hover:decoration-[#713fc2]/60 dark:decoration-[#9333EA]/50 dark:hover:decoration-[#9333EA]">
                  {_`Privacy Policy`}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Geounity - Collaborative Community Platform",
  meta: [
    {
      name: "description",
      content: "Empower your community through participatory democracy. Create polls, propose projects, and connect with members across all governance levels.",
    },
    {
      name: "og:image",
      content: "/images/geounity-social-preview.jpg"
    }
  ],
};