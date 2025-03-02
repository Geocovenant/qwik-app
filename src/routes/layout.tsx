import { component$, Slot, useVisibleTask$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { guessLocale } from 'compiled-i18n'
import Header from "~/components/Header";
import Sidebar from "~/components/Sidebar";
import { useLocation } from "@builder.io/qwik-city";
import { useSession } from "./plugin@auth";
import { usePatchUsername } from "~/shared/actions";

export { usePatchUsername } from "~/shared/actions";

export const onRequest: RequestHandler = async ({ query, headers, locale }) => {
  // Allow overriding locale with query param `locale`
  const maybeLocale = query.get('locale') || headers.get('accept-language')
  locale(guessLocale(maybeLocale))
}

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  const session = useSession();
  const location = useLocation();
  const isHome = location.url.pathname === '/';

  const patchUsername = usePatchUsername();
  
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => session.value);
    console.log('session task', session.value)
    if (!session?.value?.user?.username) {
      console.log('no username')
      patchUsername.submit({ name: session.value?.user?.name || '' })
    }
  });

  return (
    <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-800">
      {!isHome && <Header />}
      <div class="flex flex-1 overflow-hidden">
        <Sidebar />
        <main class="flex-1 overflow-y-auto">
          <Slot />
        </main>
      </div>
    </div>
  );
});
