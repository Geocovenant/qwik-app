
import { component$ } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { LuImageOff } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import { Avatar, Button, Tabs } from "flowbite-qwik";

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
                        <Button class="mt-4">
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
                <Tabs>
                    <Tabs.Tab title={_`Communities`}>
                        {_`Communities`}
                    </Tabs.Tab>
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
                </Tabs>
            </section>
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
