import { component$ } from '@builder.io/qwik';
import { _ } from 'compiled-i18n';

export default component$(() => {
    return (
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
                <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{_`Roadmap`}</h1>
                
                <p class="mb-8 text-gray-600 dark:text-gray-300">
                    {_`Welcome to the Geounity roadmap. Here you can explore the current features and learn about our future plans to improve the platform.`}
                </p>

                {/* Current Features */}
                <section class="mb-12">
                    <h2 class="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                        {_`Current Features`}
                    </h2>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Interactive Surveys`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Creation and participation in binary (yes/no), single choice (multiple options, one answer), and multiple choice surveys to facilitate community decision-making.`}
                            </p>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Community Debates`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Debate system that organizes opinions based on the internal divisions of the associated community, enabling structured and meaningful discussions.`}
                            </p>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Collaborative Projects`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Platform to propose and collaborate on community projects with tracking of resources and donations.`}
                            </p>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Local Reports`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`System to directly report community issues to government agencies, state organizations, or current public officials for faster resolution.`}
                            </p>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Social Authentication`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Simplified login via Google and GitHub to facilitate access.`}
                            </p>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Basic Roles`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Role system (user, administrator) to manage permissions and responsibilities.`}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Upcoming Features */}
                <section>
                    <h2 class="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                        {_`Upcoming Features`}
                    </h2>
                    
                    <div class="space-y-6">
                        {/* In Development & Coming Soon */}
                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Advanced Surveys`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`New types of surveys: ranking, numerical scale, and open-ended questions to obtain more detailed feedback.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                                {_`Coming Soon`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Image Gallery in Debates`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Support for multiple images in debates to enrich discussions with visual content.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                                {_`In Development`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Multilevel Debates`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Advanced nested response system to facilitate detailed and organized discussions.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                                {_`Coming Soon`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Notification System`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Email alerts and push notifications to keep users informed about relevant activities.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                                {_`In Development`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Integration with Social Media`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Ability to share content directly on social media to increase visibility.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                                {_`Coming Soon`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Integrated Content Relationships`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Association of surveys to debates, requiring respondents to answer the survey in order to express their opinion, and direct linkage between projects and debates to enrich participation and obtain structured feedback.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                                {_`Coming Soon`}
                            </span>
                        </div>

                        {/* Research */}
                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`AI Assistance`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`AI tools to assist in content creation and analysis of debates and projects.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full">
                                {_`Research`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Gamification`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Badge and points system to encourage active and constructive participation.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full">
                                {_`Research`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`AI Moderation`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Automatic filtering of inappropriate content using artificial intelligence.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full">
                                {_`Research`}
                            </span>
                        </div>

                        {/* Planning Phase */}
                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Geographic Visualizations`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Integration of D3.js with maps for interactive visualizations of geographic data and local statistics.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full">
                                {_`Planning Phase`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Sustainability Model`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Implementation of a subscription model for premium users to sustainably maintain the platform.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full">
                                {_`Planning Phase`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Advanced Roles`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`New roles such as mediators and public officials to facilitate interaction between citizens and government.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full">
                                {_`Planning Phase`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Multilingual Support`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Full support for Spanish and English, with the possibility of adding more languages in the future.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full">
                                {_`Planning Phase`}
                            </span>
                        </div>

                        {/* Future */}
                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Commission-Free Projects`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Implementation of a community payment system for projects where 100% of funds go directly to the cause. Geounity will never charge commission on donations.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full">
                                {_`Future`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Real-Time Communication`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Direct messaging and chat rooms to facilitate instant collaboration among users.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full">
                                {_`Future`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Integration with Government APIs`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Connection with government data to enrich discussions with official information.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full">
                                {_`Future`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Mobile Application`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Version for mobile devices as a native app or PWA to improve accessibility.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full">
                                {_`Future`}
                            </span>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <h3 class="font-medium text-lg text-gray-800 dark:text-white mb-2">
                                {_`Sentiment Analysis`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300">
                                {_`Use of AI to analyze opinions and trends in debates and comments.`}
                            </p>
                            <span class="inline-block mt-2 text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full">
                                {_`Future`}
                            </span>
                        </div>
                    </div>
                </section>

                <div class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-gray-600 dark:text-gray-300 text-sm">
                        {_`This roadmap is dynamic and may change according to the needs of the community. We value your feedback and suggestions to improve our platform.`}
                    </p>
                </div>
            </div>
        </div>
    );
});
