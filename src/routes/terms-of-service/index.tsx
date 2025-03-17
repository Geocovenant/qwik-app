import { component$ } from '@builder.io/qwik';
import { _ } from 'compiled-i18n';

export default component$(() => {
    return (
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
                <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{_`Terms of Service`}</h1>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`1. Introduction`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`Welcome to Geounity. These Terms of Service (Terms) govern your access to and use of our platform available at `}
                        <a href="http://geounity.org/" class="text-blue-500 dark:text-blue-400 underline hover:text-blue-600 dark:hover:text-blue-300">geounity.org</a>
                        {_` (Service). By using our Service, you agree to comply with these Terms. If you do not agree, do not use the Service.`}
                    </p>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`2. Use of the Service`}</h2>
                    <ul class="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                        <li><strong>{_`Eligibility:`}</strong> {_`You must be at least 13 years old to use our Service.`}</li>
                        <li><strong>{_`User Accounts:`}</strong> {_`You are responsible for maintaining the confidentiality of your account and password. Notify us immediately if you detect any unauthorized use of your account.`}</li>
                        <li><strong>{_`User Conduct:`}</strong> {_`You must not use the Service for illegal, defamatory, offensive activities or those that infringe on the rights of others.`}</li>
                    </ul>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`3. User Content`}</h2>
                    <ul class="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                        <li><strong>{_`Content Responsibility:`}</strong> {_`You are responsible for the content you post on Geounity. You must not post content that violates laws, third-party rights, or is inappropriate.`}</li>
                        <li><strong>{_`License:`}</strong> {_`By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content on the platform.`}</li>
                    </ul>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`4. Intellectual Property`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`All intellectual property rights in the Service and its content belong to Geounity or its licensors. No rights are granted to you over any trademarks, logos, or other copyright-protected material.`}
                    </p>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`5. Service Modifications`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`We reserve the right to modify or discontinue, temporarily or permanently, the Service with or without notice. We will not be liable to you or any third party for such modifications or interruptions.`}
                    </p>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`6. Termination`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`We may terminate or suspend your access to the Service if you violate these Terms. Upon termination, you will cease all use of the Service.`}
                    </p>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`7. Limitation of Liability`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`Geounity shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use the Service.`}
                    </p>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`8. Indemnification`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`You agree to indemnify and hold Geounity harmless from any claims, damages, obligations, losses, liabilities, costs, or debts arising from your use of the Service or your violation of these Terms.`}
                    </p>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`9. Governing Law`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`These Terms shall be governed and construed in accordance with the laws of the country where Geounity is registered, without regard to its conflict of law provisions.`}
                    </p>
                </section>

                <section class="mb-6">
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{_`10. Contact`}</h2>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">
                        {_`If you have any questions about these Terms, contact us at `}
                        <a href="mailto:sebastiancardoso92@gmail.com" class="text-blue-500 dark:text-blue-400 underline hover:text-blue-600 dark:hover:text-blue-300">sebastiancardoso92@gmail.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
});
