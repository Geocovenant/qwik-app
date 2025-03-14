import { component$ } from '@builder.io/qwik';
import { _ } from 'compiled-i18n';

export default component$(() => {
    return (
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
                <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{_`Privacy Policy`}</h1>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`1. Introduction`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`At Geounity, we value your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our Service.`}
                    </p>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`2. Information We Collect`}</h2>
                    <ul class="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                        <li><strong>{_`Personal Information:`}</strong> {_`We may collect personally identifiable information, such as your name, email address, location, and community preferences.`}</li>
                        <li><strong>{_`Usage Information:`}</strong> {_`Data about how you interact with our Service, including surveys, debates, and projects.`}</li>
                        <li><strong>{_`Device Data:`}</strong> {_`Technical information about the device you use to access the Service, such as IP address, browser type, and operating system.`}</li>
                    </ul>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`3. Use of Information`}</h2>
                    <ul class="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                        <li>{_`To provide and improve our Service.`}</li>
                        <li>{_`To personalize your experience on the platform.`}</li>
                        <li>{_`To communicate with you about updates, promotions, and news.`}</li>
                        <li>{_`To analyze the use of the Service to develop new features.`}</li>
                    </ul>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`4. Sharing of Information`}</h2>
                    <ul class="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                        <li><strong>{_`With Third Parties:`}</strong> {_`We do not sell your personal information to third parties. We may share aggregated and anonymized data with partners for analysis and improvements.`}</li>
                        <li><strong>{_`Legal Requirements:`}</strong> {_`We may disclose your information if required by law or to protect our rights.`}</li>
                    </ul>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`5. Information Security`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.`}
                    </p>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`6. Data Retention`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`We retain your personal information while your account is active or as necessary to provide you with the Service. We may also retain and use your information to comply with legal obligations, resolve disputes, and enforce our agreements.`}
                    </p>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`7. User Rights`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`Depending on your location, you may have rights regarding your personal information, including:`}
                    </p>
                    <ul class="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                        <li>{_`Access to your data.`}</li>
                        <li>{_`Correction of inaccurate data.`}</li>
                        <li>{_`Deletion of your data.`}</li>
                        <li>{_`Restriction of processing your data.`}</li>
                    </ul>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`8. Cookies and Similar Technologies`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`We use cookies and similar technologies to enhance your experience on the Service. You can manage your cookie preferences through your browser settings.`}
                    </p>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`9. Changes to the Privacy Policy`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`We may update this Privacy Policy from time to time. We will post any changes on this page and, if they are significant, we will notify you through the Service or via email.`}
                    </p>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`10. Contact`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`If you have any questions or concerns about this Privacy Policy, contact us at `}
                        <a href="mailto:contact@geounity.org" class="text-blue-500 dark:text-blue-400 underline hover:text-blue-600 dark:hover:text-blue-300">contact@geounity.org</a>
                    </p>
                </section>
            </div>
        </div>
    );
});
