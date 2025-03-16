import { $, component$, useSignal } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import { LuImageOff, LuCalendar, LuGlobe, LuUser, LuLineChart, LuUsers } from "@qwikest/icons/lucide";
import { Image } from "@unpic/qwik";
import { Button } from "~/components/ui";
import Modal from "~/components/Modal";
import FormUser from "~/components/forms/FormUser";
import ImgVenus from '~/icons/venus.svg?jsx';
import ImgMars from '~/icons/male.svg?jsx';
import { _ } from "compiled-i18n";

import { useGetUser, useGetUserByUsername } from "~/shared/loaders";
import { useFollowUser, useUnfollowUser, useUpdateCommunityVisibility } from "~/shared/actions";

export { useGetUserByUsername, useFormUserLoader } from "~/shared/loaders";
export { useFormUserAction, useFollowUser, useUnfollowUser, useUpdateCommunityVisibility } from "~/shared/actions";

// Add this interface at the top of the file, after the imports
interface Community {
    id: number;
    name: string;
    level: string;
    description: string;
    is_public: boolean;
}

export default component$(() => {
    const _user = useGetUser();
    const actionFollow = useFollowUser();
    const actionUnfollow = useUnfollowUser();
    const updateCommunityVisibility = useUpdateCommunityVisibility();
    
    const currentUsername = _user.value.username;

    const location = useLocation();
    const { username } = location.params;
    const user = useGetUserByUsername();

    const editProfileModalVisible = useSignal<boolean>(false);

    const onSubmitCompleted = $(() => {
        editProfileModalVisible.value = false;
    });

    const isOwnProfile = currentUsername === username;

    return (
        <main class="w-full bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
            {/* Banner and profile picture */}
            <div class="relative">
                {user.value.banner
                    ? (
                        <Image
                            src={user.value.banner}
                            alt={_`Profile Banner`}
                            class="w-full h-64 object-cover"
                            width={50}
                            height={20}
                        />
                    )
                    : <div class="w-full h-64 object-cover flex justify-center items-center text-5xl bg-gradient-to-r from-blue-500 to-cyan-500"><LuImageOff /></div>
                }
                <div class="absolute bottom-0" style="left: 2rem; transform: translateY(50%);">
                    {user.value.image
                        ? (
                            <Image
                                src={user.value.image}
                                alt={`Avatar of ${username}`}
                                class="w-36 h-36 border-4 border-white dark:border-gray-800 rounded-full shadow-lg"
                            />
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
            <div class="max-w-5xl px-6 mx-auto mt-24 md:mt-20">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">{user.value.name}</h1>
                        <p class="text-gray-500 dark:text-gray-400 text-lg">@{username}</p>

                        {/* Followers and following counters */}
                        <div class="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <div class="mr-4">
                                <span class="font-semibold text-gray-800 dark:text-white">{user.value.followers_count || 0}</span> {_`Followers`}
                            </div>
                            <div>
                                <span class="font-semibold text-gray-800 dark:text-white">{user.value.following_count || 0}</span> {_`Following`}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        {isOwnProfile
                            ? (
                                <>
                                    <Button
                                        onClick$={() => {
                                            editProfileModalVisible.value = true;
                                        }}
                                    >
                                        <span>{_`Edit Profile`}</span>
                                    </Button>
                                </>
                            )
                            : user.value.is_following
                                ? (
                                    <Button
                                        onClick$={() => actionUnfollow.submit({ username })}
                                        class={`flex items-center gap-2 ${user.value.is_following
                                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'}`}
                                    >
                                        {_`Unfollow`}
                                    </Button>
                                )
                                : (
                                    <Button
                                        onClick$={() => actionFollow.submit({ username })}
                                        class={`flex items-center gap-2 ${user.value.is_following
                                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'}`}
                                    >
                                        {_`Follow`}
                                    </Button>
                                )
                        }
                    </div>
                </div>

                {/* Bio and details */}
                {(user.value.bio || user.value.website || user.value.gender || user.value.last_login) && (
                    <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        {user.value.bio && (
                            <p class="mt-4 text-gray-700 dark:text-gray-300">{user.value.bio}</p>
                        )}

                        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                            {user.value.website && (
                                <div class="flex items-center gap-2">
                                    <LuGlobe class="text-blue-500" />
                                    <a
                                        href={user.value.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-blue-500 hover:underline"
                                    >
                                        {user.value.website}
                                    </a>
                                </div>
                            )}

                            {user.value.gender && (
                                <div class="flex items-center gap-2">
                                    {user.value.gender === 'M' && <ImgMars class="text-blue-500" />}
                                    {user.value.gender === 'F' && <ImgVenus class="text-pink-500" />}
                                    {user.value.gender === 'X' && <LuUser class="text-purple-500" />}
                                    <span>
                                        {user.value.gender === 'M' && _`Male`}
                                        {user.value.gender === 'F' && _`Female`}
                                        {user.value.gender === 'X' && _`Non-binary`}
                                    </span>
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
                )}

                <section class="mt-8">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <span class="text-blue-500"><LuLineChart /></span>
                        {_`Activity Statistics`}
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Polls Card */}
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105">
                            <h3 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">{_`Polls`}</h3>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Created`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{user.value.activity_stats?.polls.created || 0}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Voted`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{user.value.activity_stats?.polls.voted || 0}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Total Participation`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{user.value.activity_stats?.polls.total_participation || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Debates Card */}
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105">
                            <h3 class="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">{_`Debates`}</h3>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Created`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{user.value.activity_stats?.debates.created || 0}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Opinions`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{user.value.activity_stats?.debates.opinions || 0}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Total Participation`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{user.value.activity_stats?.debates.total_participation || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Projects Card */}
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105">
                            <h3 class="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3">{_`Projects`}</h3>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Created`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{user.value.activity_stats?.projects.created || 0}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Commitments`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{user.value.activity_stats?.projects.commitments || 0}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Donations`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{user.value.activity_stats?.projects.donations || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Issues Card */}
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105">
                            <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">{_`Issues`}</h3>
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Created`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{user.value.activity_stats?.issues.created || 0}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Supports`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{user.value.activity_stats?.issues.supports || 0}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">{_`Comments`}</span>
                                    <span class="font-bold text-gray-800 dark:text-white">{user.value.activity_stats?.issues.comments || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Communities */}
                <section class="mt-12">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <span class="text-green-500"><LuUsers /></span>
                        {_`Communities`}
                    </h2>

                    {isOwnProfile && (
                        <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p class="text-sm">
                                <span class="font-medium">{_`Information: `}</span> {_`By enabling "Show membership", other users will be able to see that you belong to this community.`}
                            </p>
                        </div>
                    )}

                    {user.value.communities && user.value.communities.length > 0 ? (
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {user.value.communities.map((community: Community) =>
                                (!isOwnProfile && !community.is_public) ? null : (
                                    <div key={community.id} class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{community.name}</h3>

                                        {isOwnProfile && (
                                            <div class="mt-4 flex items-center justify-between">
                                                <span class="text-sm text-gray-600 dark:text-gray-400">{_`Show membership`}</span>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        class="sr-only peer"
                                                        checked={community.is_public}
                                                        onClick$={async () => {
                                                            const index = user.value.communities.findIndex((c: Community) => c.id === community.id);
                                                            if (index !== -1) {
                                                                const newPublicValue = !user.value.communities[index].is_public;
                                                                user.value.communities[index].is_public = newPublicValue;
                                                                
                                                                await updateCommunityVisibility.submit({
                                                                    communityId: community.id,
                                                                    isPublic: newPublicValue
                                                                });
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
                        <p class="text-gray-500 dark:text-gray-400">
                            {_`This user does not belong to any community.`}
                        </p>
                    )}
                </section>
            </div>

            {/* Edit profile modal */}
            <Modal
                title={_`Edit Profile`}
                show={editProfileModalVisible}
            >
                <FormUser
                    onSubmitCompleted$={onSubmitCompleted}
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
