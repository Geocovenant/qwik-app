import { component$, useSignal } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { LuImageOff } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import { Avatar, Button, Modal } from "flowbite-qwik";
import FormUser from "~/components/forms/FormUser";
import { Tabs } from "~/components/ui";

// TODO: traer info del usuario desde el backend
const dataUser = {
    username: "sebacc92",
    email: "email@gmail.com",
    banner: "https://dircomfidencial.com/wp-content/uploads/2016/11/logo-1330779_960_720.png",
    image: "https://sebastiancardoso.com/profile.png",
    name: "Sebastian Cardoso",
    bio: "FullStack Developer, con varios años de experiencia en el desarrollo de aplicaciones web y móviles.",
    location: "Argentina",
    website: "https://sebastiancardoso.com",
    following_count: 100,
    followers_count: 99,
}

export default component$(() => {
    const location = useLocation();
    const { username } = location.params;

    const editProfileModalVisible = useSignal<boolean>(false)

    return (
        <main class="w-full">
            <div class="relative">
                {dataUser.banner
                    ? (
                        <img
                            src={dataUser.banner}
                            alt={_`Profile Banner`}
                            class="w-full h-48 object-cover"
                            width={50}
                            height={20}
                        />
                    )
                    : <div class="w-full h-48 object-cover flex justify-center items-center text-5xl bg-gray-200"><LuImageOff /></div>
                }
                <div class="absolute bottom-0" style="left: 1rem; transform: translateY(50%);">
                    {dataUser.image
                        ? (
                            <Avatar
                                img={dataUser.image}
                                alt={`Avatar of ${username}`}
                                size="lg"
                                rounded
                                class="border-4 border-white rounded-full"
                            />
                        )
                        : (
                            <Avatar rounded />
                        )
                    }
                </div>
            </div>
            <div class="max-w-3xl px-4 mx-auto mt-16">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold">{dataUser.name}</h1>
                    <p class="text-gray-500">@{username}</p>
                </div>
                {dataUser.username === username
                    ? (
                        <Button class="mt-4"
                            onClick$={() => {
                                editProfileModalVisible.value = true
                            }}
                        >
                            {_`Edit Profile`}
                        </Button>
                    )
                    : (
                        <Button class="mt-4" outline>
                            {_`Follow`}
                        </Button>
                    )
                }
                {dataUser.bio && (
                    <p class="mt-4">{dataUser.bio}</p>
                )}
                <div class="mt-4 flex space-x-4 text-gray-500">
                    <p>🌍 {dataUser.location}</p>
                    {dataUser.website && (
                        <span>
                            🔗 <a href={dataUser.website} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
                                {dataUser.website}
                            </a>
                        </span>
                    )}
                </div>
                <div class="mt-4 flex space-x-4">
                    <span><strong>{dataUser.following_count}</strong> {_`Follwing`}</span>
                    <span><strong>{dataUser.followers_count}</strong> {_`Followers`}</span>
                </div>
            </div>
            <section class="max-w-3xl mx-auto px-4 mt-16">
                <Tabs.Root defaultValue="communities">
                    <Tabs.List>
                        <Tabs.Tab value="communities">{_`Communities`}</Tabs.Tab>
                        <Tabs.Tab value="polls">{_`Polls`}</Tabs.Tab>
                        <Tabs.Tab value="debates">{_`Debates`}</Tabs.Tab>
                        <Tabs.Tab value="projects">{_`Proyects`}</Tabs.Tab>
                        <Tabs.Tab value="issues">{_`Issues`}</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="communities">
                        {_`Communities`}
                    </Tabs.Panel>
                    <Tabs.Panel value="polls">
                        {_`Polls`}
                    </Tabs.Panel>
                    <Tabs.Panel value="debates">
                        {_`Debates`}
                    </Tabs.Panel>
                    <Tabs.Panel value="projects">
                        {_`Proyects`}
                    </Tabs.Panel>
                    <Tabs.Panel value="issues">
                        {_`Issues`}
                    </Tabs.Panel>
                </Tabs.Root>
            </section>
            <Modal
                header={<div class="flex items-center text-lg">{_`Edit Profile`}</div>}
                footer={
                    <div class="flex justify-between">
                        <Button
                        onClick$={() => {
                            editProfileModalVisible.value = false
                        }}
                        color="alternative"
                        >
                            {_`Close`}
                        </Button>
                        <Button
                            onClick$={() => {
                                editProfileModalVisible.value = false
                            }}
                            color="green"
                        >
                            {_`Send`}
                        </Button>
                    </div>
                }
                bind:show={editProfileModalVisible}
            >
                <FormUser />
            </Modal>
        </main>
    );
});

export const head: DocumentHead = ({ params }) => {
    const username = params.username;
    return {
        title: `${username} - User Profile`,
        meta: [
            {
                name: "description",
                content: `User profile page for ${username}`,
            },
        ],
    };
};
