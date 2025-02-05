import { component$ } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { Tabs } from "flowbite-qwik";
import Breadcrumbs from "~/components/Breadcrumbs";

export default component$(() => {
  const location = useLocation()
  const params = location.params
  const segments = Array.isArray(params.segments) ? params.segments : [params.segments]
  const communityName = segments[segments.length-1]?.replace(/-/g, " ")
  const formattedName = communityName?.charAt(0).toUpperCase() + communityName?.slice(1)
  return (
    <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <div class="bg-gray-50 border-b p-3">
        <Breadcrumbs />
      </div>

      <div class="flex flex-col min-h-0">
        <div class="p-6 border-b">
          <h1 class="text-2xl font-semibold">
            Comunidad: {formattedName}
          </h1>
        </div>

        <Tabs>
          <Tabs.Tab title="Encuestas">
            Encuestas
          </Tabs.Tab>
          <Tabs.Tab title="Debates">
            Debates
          </Tabs.Tab>
          <Tabs.Tab title="Proyectos">
            Proyectos
          </Tabs.Tab>
          <Tabs.Tab title="Reportes">
            Reportes
          </Tabs.Tab>
          <Tabs.Tab title="Miembros">
            Miembros
          </Tabs.Tab>
        </Tabs>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
