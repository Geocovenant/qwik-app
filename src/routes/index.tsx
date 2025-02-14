import { component$ } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Breadcrumb } from "flowbite-qwik";

export default component$(() => {
  const location = useLocation()
  const pathname = location.url.pathname
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index+1).join("/")}`
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
    return { path, label }
  })

  //TODO: Esto es solo un ejemplo, despues lo traere del backend
  const username = 'Sebastian'

  return (
    <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <div class="bg-gray-50 border-b p-3">
        <Breadcrumb>
          <Breadcrumb.Item home href="/">
            Home
          </Breadcrumb.Item>
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.path} class="flex items-center">
              <Breadcrumb.Item
                href={breadcrumb.path}
              >
                <span class={index === breadcrumbs.length - 1 ? "text-gray-900" : ""}>
                  {breadcrumb.label}
                </span>
              </Breadcrumb.Item>
            </div>
          ))}
        </Breadcrumb>
      </div>
      <div>{_`Welcome ${username}`}</div>
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
