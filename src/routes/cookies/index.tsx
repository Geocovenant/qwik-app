import { component$ } from '@builder.io/qwik';
import { _ } from 'compiled-i18n';

export default component$(() => {
    return (
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
                <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{_`Cookie Policy`}</h1>

                <div class="mb-8 text-gray-600 dark:text-gray-300">
                    <p class="mb-4">
                        {_`Geounity uses cookies to enhance your experience while using our platform. You can review and manage cookie settings below.`}
                    </p>
                </div>

                <section class="mb-8">
                    <div class="flex items-center mb-2">
                        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`Essential Functionality`}</h2>
                        <span class="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">{_`Required`}</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 mb-6">
                        {_`These cookies are necessary for the proper functioning of our website. Without these cookies, the site would not work correctly.`}
                    </p>

                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {_`Cookie`}
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {_`Domain`}
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {_`Type`}
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {_`Duration`}
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        auth.session-token
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        geounity.org
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {_`Authentication`}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {_`Session`}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        auth.callback-url
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        geounity.org
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {_`Authentication`}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {_`Session`}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        theme
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        geounity.org
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {_`Local Storage`}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {_`Persistent`}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section class="mb-8">
                    <div class="flex items-center mb-2">
                        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`Analytics`}</h2>
                        <span class="ml-3 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">{_`Optional`}</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 mb-6">
                        {_`These cookies help us understand how visitors interact with our website. The information collected is used to improve our platform.`}
                    </p>

                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {_`Cookie`}
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {_`Domain`}
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {_`Type`}
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {_`Duration`}
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        _ga
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        geounity.org
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {_`Third-party`}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        60 {_`days`}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">{_`Managing Your Cookie Preferences`}</h2>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">
                        {_`You can manage cookie preferences through your browser settings. Please note that disabling essential cookies may affect the functionality of our website.`}
                    </p>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">
                        {_`Most web browsers allow some control of cookies through browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit `}
                        <a href="https://www.allaboutcookies.org" class="text-cyan-600 hover:text-cyan-500 dark:text-cyan-400" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
                    </p>
                </section>

                <section>
                    <h2 class="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">{_`Updates to This Policy`}</h2>
                    <p class="text-gray-600 dark:text-gray-300">
                        {_`We may update our Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.`}
                    </p>
                </section>
            </div>
        </div>
    );
});
