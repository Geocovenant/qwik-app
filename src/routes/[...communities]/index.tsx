import { component$ } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Tabs } from "flowbite-qwik";
import Breadcrumbs from "~/components/Breadcrumbs";

export default component$(() => {
  const location = useLocation();
  const params = location.params;
  const communities = typeof params.communities === "string"
    ? params.communities.split("/").filter(Boolean)
    : Array.isArray(params.communities)
      ? params.communities
      : [];
  
  const communityName = communities[communities.length - 1]?.replace(/-/g, " ");
  const formattedName = communityName?.charAt(0).toUpperCase() + communityName?.slice(1);

  return (
    <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <div class="bg-gray-50 border-b p-3">
        <Breadcrumbs />
      </div>

      <div class="flex flex-col min-h-0">
        <div class="p-6 border-b">
          <h1 class="text-2xl font-semibold">
            {_`Comunidad`}: {formattedName}
          </h1>
        </div>

        <Tabs>
          <Tabs.Tab title={_`Polls`}>
            {_`Polls`}
          </Tabs.Tab>
          <Tabs.Tab title={_`Debates`}>
            {_`Debates`}
          </Tabs.Tab>
          <Tabs.Tab title={_`Proyects`}>
            {_`Proyects`}
          </Tabs.Tab>
          <Tabs.Tab title={_`Issues`}>
            {_`Issues`}
          </Tabs.Tab>
          <Tabs.Tab title={_`Members`}>
            {_`Members`}
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
