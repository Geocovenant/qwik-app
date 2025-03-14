import { type Session } from "@auth/qwik";
import { component$ } from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import ImgLogo from '~/icons/logo.svg?jsx';
import { _ } from "compiled-i18n";

export const onRequest: RequestHandler = async (event) => {
  const session: Session | null = event.sharedMap.get('session');
  if (session && new Date(session.expires) >= new Date()) {
    throw event.redirect(302, '/global')
  }
}

export default component$(() => {
  return (
    <div class="min-h-screen bg-gradient-to-b from-[#713fc2]/10 via-[#713fc2]/5 to-white dark:from-[#713fc2]/20 dark:via-[#713fc2]/10 dark:to-gray-900 flex flex-col items-center justify-center py-8 px-4">
      <div class="max-w-3xl w-full">
        <div class="flex flex-col items-center mb-8">
          <div class="p-4 bg-white/30 dark:bg-gray-800/30 rounded-full shadow-xl mb-6">
            <ImgLogo class="w-24 h-24 text-[#6B48FF] dark:text-[#9333EA]" aria-hidden="true" />
          </div>
          
          <h1 class="text-center text-5xl font-bold mb-4 leading-tight">
            <span class="text-[#6B48FF] dark:text-[#9333EA] text-6xl block mb-2">Geounity</span>
            <span class="text-gray-800 dark:text-gray-200 block">{_`Unite Communities, Shape the Future Together`}</span>
          </h1>

          <p class="mt-4 text-center text-2xl font-medium text-gray-700 dark:text-gray-300 max-w-2xl">
            {_`Participate in surveys, debates, and projects to strengthen your local and global community.`}
          </p>

          <p class="mt-3 text-center text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {_`Connect with neighbors, organizations, and governments to create real change in your locality and worldwide`}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 py-10 px-8 shadow-2xl shadow-[#713fc2]/20 dark:shadow-[#9333EA]/20 rounded-3xl border border-[#713fc2]/15 dark:border-[#9333EA]/15 relative overflow-hidden">
          {/* Decorative element */}
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#713fc2] to-[#9333EA]"></div>
          
          <div class="space-y-8">
            <div class="text-center">
              <div class="space-y-8 mb-10">
                <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  {_`Together we can:`}
                </h3>

                <ul class="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                  {[
                    { icon: '📊', text: _`Conduct surveys and analyze community data`, color: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30' },
                    { icon: '💬', text: _`Participate in debates with diverse viewpoints`, color: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30' },
                    { icon: '🛠️', text: _`Launch projects and fund solutions`, color: 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30' },
                    { icon: '🚨', text: _`Report to responsible institutions`, color: 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' },
                    { icon: '🌍', text: _`Connect with members of your community`, color: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30' },
                    { icon: '🔒', text: _`Participate privately and securely`, color: 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30' }
                  ].map((item) => (
                    <li key={item.text} class={`flex items-start p-4 ${item.color} rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1`}>
                      <span class="text-3xl mr-3">{item.icon}</span>
                      <span class="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div class="mb-8">
                <p class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 animate-fadeIn">
                  {_`Be one of the first to strengthen communities!`}
                </p>

                <div class="relative">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div class="relative flex justify-center text-sm">
                    <span class="px-6 py-1 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium rounded-full border border-gray-200 dark:border-gray-700">
                      {_`Get started in 1 click`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-[#F5F5F5] to-[#F9F9F9] dark:from-gray-700 dark:to-gray-750 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/30 text-center mb-6 shadow-inner">
              <p class="text-sm flex items-center justify-center text-gray-800 dark:text-gray-200 font-medium">
                <span class="text-[#FFD700] mr-3 text-xl">🔒</span>
                {_`Your privacy matters: profiles are private by default and you control your visibility`}
              </p>
            </div>

            <div class="space-y-5">
              <SocialLoginButtons />
            </div>

            <div class="mt-8 text-center space-y-3">
              <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                <span class="text-[#713fc2] dark:text-[#9333EA] mr-1">🔒</span> 
                {_`Your data is 100% secure and private`}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {_`By continuing, you agree to our `}
                <a href="/terms-of-service" class="font-medium underline underline-offset-4 decoration-[#713fc2]/30 hover:decoration-[#713fc2]/60 dark:decoration-[#9333EA]/50 dark:hover:decoration-[#9333EA] hover:text-[#713fc2] dark:hover:text-[#9333EA] transition-colors">
                  {_`Terms of Service`}
                </a>
                {_` and `}
                <a href="/privacy-policy" class="font-medium underline underline-offset-4 decoration-[#713fc2]/30 hover:decoration-[#713fc2]/60 dark:decoration-[#9333EA]/50 dark:hover:decoration-[#9333EA] hover:text-[#713fc2] dark:hover:text-[#9333EA] transition-colors">
                  {_`Privacy Policy`}
                </a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative circles */}
        <div class="fixed -bottom-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-[#713fc2]/10 to-[#9333EA]/10 blur-3xl dark:from-[#713fc2]/5 dark:to-[#9333EA]/5 -z-10"></div>
        <div class="fixed -top-32 -right-32 w-64 h-64 rounded-full bg-gradient-to-r from-[#9333EA]/10 to-[#713fc2]/10 blur-3xl dark:from-[#9333EA]/5 dark:to-[#713fc2]/5 -z-10"></div>
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