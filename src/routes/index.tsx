import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Tabs } from "flowbite-qwik";
import Breadcrumbs from "~/components/Breadcrumbs";
import PollList from "~/components/list/PollList";
import { useGetUser, useGetPolls } from "~/shared/loaders";

export { useGetUser, useGetPolls } from "~/shared/loaders"

export default component$(() => {
  const user = useGetUser()
  console.log('user.value ', user.value)
  return (
    <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <div class="bg-gray-50 border-b p-3">
        <Breadcrumbs />
      </div>
      <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div class="flex flex-col min-h-0">
          <Tabs>
            <Tabs.Tab title={_`Polls`}>
              <PollList />
            </Tabs.Tab>
            <Tabs.Tab title={_`Debates`}>
              {/* <DebateList /> */}
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
