import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";

export default component$(() => {
    return (
        <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg my-8">
            <nav class="flex items-center text-sm mb-4 text-gray-500">
                <Link href="/" class="hover:underline">{_`Help Center`}</Link>
                <span class="mx-2">›</span>
                <Link href="/login" class="hover:underline">{_`Login and password`}</Link>
                <span class="mx-2">›</span>
                <span class="text-gray-700">{_`About additional sign up and log in details`}</span>
            </nav>

            <div class="border-b pb-4 mb-8">
                <h1 class="text-4xl font-bold mb-6">{_`About additional sign up and log in details`}</h1>
            </div>

            <div class="space-y-6">
                <p class="text-lg">
                    {_`In order to keep your account safe, we may ask certain users to provide additional information when signing up or logging in.`}
                </p>

                <p>
                    {_`For example, when signing up for a new account, you may be asked to provide a phone number and/or an email address.`}
                </p>

                <p>
                    {_`When logging in to an existing account, we may ask you to answer a question about your account that only you know. In some cases, we may also email you a code that you can use to verify your identity and log in to your account.`}
                </p>

                <h2 class="text-2xl font-bold mt-8 mb-4">{_`Need help?`}</h2>

                <p>
                    {_`If you are unable to provide the requested information and need assistance setting up your account, please contact us at`}{" "}
                    <a href="mailto:support@geounity.org" class="text-purple-600 hover:underline">
                        support@geounity.org
                    </a>
                </p>
            </div>
        </div>
    );
}); 