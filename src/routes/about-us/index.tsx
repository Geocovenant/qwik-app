import { component$ } from '@builder.io/qwik';
import { _ } from 'compiled-i18n';
import {
    LuVote,
    LuMessageSquare,
    LuFolderGit,
    LuClipboardList,
    LuUsers,
    LuGlobe
} from '@qwikest/icons/lucide';
import { useSession } from '../plugin@auth';
import SocialLoginButtons from '~/components/SocialLoginButtons';

export default component$(() => {
    const session = useSession();
    return (
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-5xl mx-auto">
                {/* Introduction */}
                <div class="mb-16 text-center">
                    <h1 class="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                        {_`About Geounity`}
                    </h1>
                    <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        {_`A geopolitical platform designed to strengthen unity and growth of communities at global, national, and local levels.`}
                    </p>
                </div>

                {/* Introduction to Geounity */}
                <div class="mb-16">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-600 dark:after:bg-blue-500">
                        {_`What is Geounity?`}
                    </h2>
                    <p class="mb-4 text-gray-700 dark:text-gray-300">
                        {_`Geounity is an innovative participatory democracy platform that connects communities through a hierarchical structure, from the global to the local level. Our purpose is to foster collaboration, constructive debate, and collective problem-solving through digital tools accessible to all.`}
                    </p>
                    <p class="text-gray-700 dark:text-gray-300">
                        {_`At Geounity, we believe that citizen participation is fundamental to building fairer, more transparent, and democratic societies. That is why we have created a space where everyone can express their ideas, participate in important decisions, and actively contribute to improving their environment.`}
                    </p>
                </div>

                {/* Community Structure */}
                <div class="mb-16">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-600 dark:after:bg-blue-500">
                        {_`Community Structure`}
                    </h2>
                    <p class="mb-6 text-gray-700 dark:text-gray-300">
                        {_`Geounity organizes communities in a hierarchical structure that allows users to interact at different levels according to their interests or geographical location.`}
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                            <div class="text-blue-600 dark:text-blue-500 mb-4">
                                <LuGlobe class="w-10 h-10" />
                            </div>
                            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                {_`Global and International`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 flex-grow">
                                {_`The global level encompasses all users of the platform, while international communities involve two or more countries with shared interests.`}
                            </p>
                        </div>

                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                            <div class="text-blue-600 dark:text-blue-500 mb-4">
                                <LuGlobe class="w-10 h-10" />
                            </div>
                            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                {_`National and Regional`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 flex-grow">
                                {_`Each country constitutes a national community. Within these, there are regional divisions such as provinces, states, or departments.`}
                            </p>
                        </div>

                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                            <div class="text-blue-600 dark:text-blue-500 mb-4">
                                <LuGlobe class="w-10 h-10" />
                            </div>
                            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                {_`Subregional and Local`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 flex-grow">
                                {_`Subregions represent cities or municipalities, while the local level includes neighborhoods or districts, allowing for the addressing of specific issues in each area.`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Services and Features */}
                <div class="mb-16">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-600 dark:after:bg-blue-500">
                        {_`Services and Features`}
                    </h2>
                    <p class="mb-6 text-gray-700 dark:text-gray-300">
                        {_`Geounity offers specific tools for each community, designed to promote participation and civic engagement.`}
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                            <div class="text-blue-600 dark:text-blue-500 mb-4">
                                <LuVote class="w-10 h-10" />
                            </div>
                            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                {_`Surveys and Data`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 flex-grow">
                                {_`Create and participate in surveys to gather opinions and specific data from your community. The results are presented transparently and accessibly to all.`}
                            </p>
                        </div>

                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                            <div class="text-blue-600 dark:text-blue-500 mb-4">
                                <LuMessageSquare class="w-10 h-10" />
                            </div>
                            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                {_`Debates and Discussions`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 flex-grow">
                                {_`Organized spaces to discuss issues, propose solutions, and share viewpoints on relevant topics for your community.`}
                            </p>
                        </div>

                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                            <div class="text-blue-600 dark:text-blue-500 mb-4">
                                <LuFolderGit class="w-10 h-10" />
                            </div>
                            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                {_`Projects and Fundraising`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 flex-grow">
                                {_`Propose, support, and collaborate on community projects. Geounity facilitates organization and collective funding to turn ideas into realities.`}
                            </p>
                        </div>

                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                            <div class="text-blue-600 dark:text-blue-500 mb-4">
                                <LuClipboardList class="w-10 h-10" />
                            </div>
                            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                {_`Reports`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 flex-grow">
                                {_`A system to send reports about local issues to the responsible authorities and track their status until resolution.`}
                            </p>
                        </div>

                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                            <div class="text-blue-600 dark:text-blue-500 mb-4">
                                <LuUsers class="w-10 h-10" />
                            </div>
                            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                {_`Connection between Members`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 flex-grow">
                                {_`Connect with other community members, follow their activities, and collaborate on shared initiatives, always respecting privacy options.`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div class="mb-16">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-600 dark:after:bg-blue-500">
                        {_`How It Works`}
                    </h2>
                    <p class="mb-4 text-gray-700 dark:text-gray-300">
                        {_`Geounity has been designed with ease of use and effectiveness in community participation in mind:`}
                    </p>

                    <div class="ml-6 space-y-4">
                        <div class="flex items-start">
                            <span class="font-bold mr-2 text-gray-800 dark:text-gray-200">1.</span>
                            <p class="text-gray-700 dark:text-gray-300">
                                {_`Register and join communities based on your location or interests.`}
                            </p>
                        </div>
                        <div class="flex items-start">
                            <span class="font-bold mr-2 text-gray-800 dark:text-gray-200">2.</span>
                            <p class="text-gray-700 dark:text-gray-300">
                                {_`Participate in surveys, debates, propose projects, or send reports.`}
                            </p>
                        </div>
                        <div class="flex items-start">
                            <span class="font-bold mr-2 text-gray-800 dark:text-gray-200">3.</span>
                            <p class="text-gray-700 dark:text-gray-300">
                                {_`Navigate through our hierarchical structure to access different community levels.`}
                            </p>
                        </div>
                        <div class="flex items-start">
                            <span class="font-bold mr-2 text-gray-800 dark:text-gray-200">4.</span>
                            <p class="text-gray-700 dark:text-gray-300">
                                {_`Adjust your visibility and privacy according to your preferences in each community.`}
                            </p>
                        </div>
                        <div class="flex items-start">
                            <span class="font-bold mr-2 text-gray-800 dark:text-gray-200">5.</span>
                            <p class="text-gray-700 dark:text-gray-300">
                                {_`Collaborate with other members to generate positive changes.`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Benefits for Users */}
                <div class="mb-16">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-600 dark:after:bg-blue-500">
                        {_`Benefits for Users`}
                    </h2>
                    <p class="mb-6 text-gray-700 dark:text-gray-300">
                        {_`Geounity empowers communities through multiple benefits:`}
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        <div class="flex">
                            <div class="text-blue-600 dark:text-blue-500 mr-4">✓</div>
                            <div>
                                <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                    {_`Effective Civic Participation`}
                                </h3>
                                <p class="text-gray-600 dark:text-gray-400">
                                    {_`Facilitates participation in decisions that affect your community, with tools that allow your voice to be heard effectively.`}
                                </p>
                            </div>
                        </div>

                        <div class="flex">
                            <div class="text-blue-600 dark:text-blue-500 mr-4">✓</div>
                            <div>
                                <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                    {_`Transparency and Accountability`}
                                </h3>
                                <p class="text-gray-600 dark:text-gray-400">
                                    {_`Promotes transparency in community management through public reports and tracking of issues until resolution.`}
                                </p>
                            </div>
                        </div>

                        <div class="flex">
                            <div class="text-blue-600 dark:text-blue-500 mr-4">✓</div>
                            <div>
                                <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                    {_`Multilevel Collaboration`}
                                </h3>
                                <p class="text-gray-600 dark:text-gray-400">
                                    {_`Encourages collaboration among people from different communities, from local to global, broadening perspectives and solutions.`}
                                </p>
                            </div>
                        </div>

                        <div class="flex">
                            <div class="text-blue-600 dark:text-blue-500 mr-4">✓</div>
                            <div>
                                <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                    {_`Inclusive Platform`}
                                </h3>
                                <p class="text-gray-600 dark:text-gray-400">
                                    {_`Provides a space where everyone can participate regardless of their background, with tools designed to be accessible and intuitive.`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vision and Mission */}
                <div class="mb-16 bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">
                                {_`Our Vision`}
                            </h3>
                            <p class="text-gray-700 dark:text-gray-300">
                                {_`To build a more united and collaborative world, where communities are empowered to solve their own challenges through technology and collective participation.`}
                            </p>
                        </div>

                        <div>
                            <h3 class="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">
                                {_`Our Mission`}
                            </h3>
                            <p class="text-gray-700 dark:text-gray-300">
                                {_`To provide an accessible, secure, and innovative platform that allows communities at all levels to grow and strengthen together, fostering transparency, democratic participation, and the common good.`}
                            </p>
                        </div>
                    </div>
                </div>

                {!session.value && (
                    <div class="text-center mb-8 mt-16">
                        <h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                            {_`Be Part of the Change`}
                        </h2>
                        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                            {_`Join Geounity today and start building a better future for your community and the world.`}
                        </p>
                        <SocialLoginButtons />
                    </div>
                )}
            </div>
        </div>
    );
});
