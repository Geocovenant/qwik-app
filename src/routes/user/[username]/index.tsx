import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { LuImageOff, LuCalendar, LuGlobe, LuStar, LuUser } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import { Avatar, Button } from "~/components/ui";
import Modal from "~/components/Modal";
import FormUser from "~/components/forms/FormUser";
import ImgVenus from '~/icons/venus.svg?jsx';
import ImgMars from '~/icons/male.svg?jsx';
import { useSession } from "~/routes/plugin@auth";
import { useGetUserByUsername } from "~/shared/loaders";
import { Image } from "@unpic/qwik";

export { useGetUserByUsername, useFormUserLoader } from "~/shared/loaders";
export { useFormUserAction } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const currentUsername = session.value?.user?.username || '';
    
    const location = useLocation();
    const { username } = location.params;
    const user = useGetUserByUsername();
    console.log('user', user)

    const editProfileModalVisible = useSignal<boolean>(false);

    const onSubmitCompleted = $(() => {
        editProfileModalVisible.value = false;
    });

    const isOwnProfile = currentUsername === username;

    const stats = useStore({
        polls: { created: 12, available: 5, answered: 32 },
        debates: { created: 8, available: 10, participated: 24 },
        projects: { created: 3, available: 2, contributed: 7 },
        issues: { created: 15, available: 10, solved: 22 }
    });

    const communities = useStore({
        list: [
            { id: 1, name: "Urban Politics", members: 1245, showMembership: true },
            { id: 2, name: "Climate Change", members: 3782, showMembership: true },
            { id: 3, name: "Social Economy", members: 876, showMembership: false }
        ]
    });

    return (
        <main class="w-full bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
            {/* Banner and profile picture */}
            <div class="relative">
                {user.value.banner
                    ? (
                        <Image
                            src={user.value.banner}
                            alt={_`Profile Banner`}
                            class="w-full h-60 object-cover"
                            width={50}
                            height={20}
                        />
                    )
                    : <div class="w-full h-60 object-cover flex justify-center items-center text-5xl bg-gradient-to-r from-blue-500 to-cyan-500"><LuImageOff /></div>
                }
                <div class="absolute bottom-0" style="left: 2rem; transform: translateY(50%);">
                    {user.value.image
                        ? (
                            <Avatar.Root>
                                <Avatar.Image
                                    src={user.value.image}
                                    alt={`Avatar of ${username}`}
                                    class="w-10 h-10 border-4 border-white dark:border-gray-800 rounded-full shadow-lg"
                                />
                            </Avatar.Root>
                        )
                        : (
                            <div class="w-[150px] h-[150px] flex items-center justify-center text-4xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-4 border-white dark:border-gray-800 rounded-full shadow-lg">
                                <LuUser />
                            </div>
                        )
                    }
                </div>
            </div>

            {/* Main profile information */}
            <div class="max-w-5xl px-6 mx-auto mt-20 md:mt-16">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">{user.value.name}</h1>
                        <p class="text-gray-500 dark:text-gray-400 text-lg">@{username}</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        {isOwnProfile
                            ? (
                                <>
                                    <Button
                                        onClick$={() => {
                                            editProfileModalVisible.value = true;
                                        }}
                                        class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                    >
                                        <span>{_`Edit Profile`}</span>
                                    </Button>
                                </>
                            )
                            : (
                                <Button class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                                    <LuStar />
                                    <span>{_`Follow`}</span>
                                </Button>
                            )
                        }
                    </div>
                </div>

                {/* Bio and details */}
                <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    {user.value.bio && (
                        <p class="mt-4 text-gray-700 dark:text-gray-300">{user.value.bio}</p>
                    )}

                    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                        {user.value.location && (
                            <div class="flex items-center gap-2">
                                <LuGlobe class="text-blue-500" />
                                <span>{user.value.location}</span>
                            </div>
                        )}

                        {user.value.website && (
                            <div class="flex items-center gap-2">
                                <LuGlobe class="text-blue-500" />
                                <a href={user.value.website} target="_blank" rel="noopener noreferrer"
                                    class="text-blue-500 hover:underline">
                                    {user.value.website}
                                </a>
                            </div>
                        )}

                        {user.value.gender && (
                            <div class="flex items-center gap-2">
                                {user.value.gender === 'M' 
                                    ? <ImgMars class="text-blue-500" /> 
                                    : <ImgVenus class="text-pink-500" />}
                                <span>{user.value.gender === 'M' ? _`Male` : _`Female`}</span>
                            </div>
                        )}

                        {user.value.last_login && (
                            <div class="flex items-center gap-2">
                                <LuCalendar class="text-blue-500" />
                                <span>{_`Last login`}: {new Date(user.value.last_login).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                <section class="mt-8">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">{_`Activity Statistics`}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Polls Card */}
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">{_`Polls`}</h3>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Created`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{stats.polls.created}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Available`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{stats.polls.available}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Answered`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{stats.polls.answered}</span>
                                </div>
                            </div>
                        </div>

                        {/* Debates Card */}
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 class="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">{_`Debates`}</h3>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Created`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{stats.debates.created}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Available`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{stats.debates.available}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Participated`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{stats.debates.participated}</span>
                                </div>
                            </div>
                        </div>

                        {/* Projects Card */}
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 class="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3">{_`Projects`}</h3>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Created`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{stats.projects.created}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Available`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{stats.projects.available}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Contributed`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{stats.projects.contributed}</span>
                                </div>
                            </div>
                        </div>

                        {/* Issues Card */}
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">{_`Issues`}</h3>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Created`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{stats.issues.created}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Available`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{stats.issues.available}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Solved`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{stats.issues.solved}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Communities */}
                <section class="mt-8">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">{_`Communities`}</h2>

                    {communities.list.length > 0 ? (
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {communities.list.map((community) =>
                                (!isOwnProfile && !community.showMembership) ? null : (
                                    <div key={community.id} class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{community.name}</h3>
                                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {community.members} {_`members`}
                                        </p>
                                        
                                        {isOwnProfile && (
                                            <div class="mt-4 flex items-center justify-between">
                                                <span class="text-sm text-gray-600 dark:text-gray-400">{_`Show membership`}</span>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        class="sr-only peer" 
                                                        checked={community.showMembership}
                                                        onClick$={() => {
                                                            const index = communities.list.findIndex(c => c.id === community.id);
                                                            if (index !== -1) {
                                                                communities.list[index].showMembership = !communities.list[index].showMembership;
                                                            }
                                                        }}
                                                    />
                                                    <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <p class="text-gray-500 dark:text-gray-400">{_`This user does not belong to any community.`}</p>
                    )}
                </section>
            </div>

            {/* Edit profile modal */}
            <Modal
                title={_`Edit Profile`}
                bind:show={editProfileModalVisible}
            >
                <FormUser
                    onSubmitCompleted={onSubmitCompleted}
                />
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
