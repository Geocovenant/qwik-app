import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import ImgLogo from '~/icons/logo.svg?jsx';

export default component$(() => {
  return (
    <div class="min-h-screen bg-gradient-to-b from-[#713fc2]/5 to-white dark:from-[#713fc2]/10 dark:to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex flex-col items-center mb-12">
          <ImgLogo class="w-20 h-20 text-[#713fc2] dark:text-[#9333EA] animate-pulse" aria-hidden="true" />
          <h1 class="mt-6 text-center text-4xl font-extrabold text-gray-900 dark:text-white">
            {_`Bienvenido a Geounity`}
          </h1>
          <p class="mt-2 text-center text-lg text-gray-600 dark:text-gray-300">
            {_`Tu voz en la democracia participativa`}
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl shadow-[#713fc2]/5 dark:shadow-[#9333EA]/5 sm:rounded-xl sm:px-10 border border-[#713fc2]/10 dark:border-[#9333EA]/10">
          <div class="space-y-6">
            <div class="text-center text-gray-600 dark:text-gray-300">
              <p class="text-lg mb-6">
                {_`Geounity es una plataforma de democracia participativa que permite a las comunidades:`}
              </p>
              <ul class="text-left list-disc list-inside space-y-3 mb-8">
                {[
                  _`Crear y participar en encuestas`,
                  _`Debatir temas importantes`,
                  _`Proponer y colaborar en proyectos`,
                  _`Reportar problemas en tu comunidad`,
                  _`Conectar con otros miembros`
                ].map((text) => (
                  <li key={text} class="flex items-center space-x-2">
                    <span class="text-emerald-500 dark:text-emerald-400">•</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <p class="text-lg font-medium text-gray-700 dark:text-gray-200 mb-8">
                {_`Únete a nosotros para construir una democracia más participativa y transparente.`}
              </p>
            </div>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200 dark:border-gray-600"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {_`Inicia sesión con`}
                </span>
              </div>
            </div>

            <SocialLoginButtons />

            <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                {_`Al continuar, aceptas nuestros `}
                <a href="/terms" class="font-medium text-[#713fc2] hover:text-[#8255c9] dark:text-[#9333EA] dark:hover:text-[#A855F7]">
                  {_`términos de servicio`}
                </a>
                {_` y `}
                <a href="/privacy" class="font-medium text-[#713fc2] hover:text-[#8255c9] dark:text-[#9333EA] dark:hover:text-[#A855F7]">
                  {_`política de privacidad`}
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
  title: "Geounity - Democracia Participativa",
  meta: [
    {
      name: "description",
      content: "Plataforma de democracia participativa para comunidades. Únete para crear encuestas, debatir temas importantes y colaborar en proyectos comunitarios.",
    },
  ],
};
