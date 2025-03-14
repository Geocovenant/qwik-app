import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { LuHome, LuUser, LuLogIn, LuArrowLeft, LuLock, LuSearch, LuUserCheck, LuUserPlus, LuLink } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import ImgLogo from '~/icons/logo.svg?jsx';

export default component$(() => {
    return (
        <div class="min-h-screen bg-gradient-to-b from-[#713fc2]/5 to-white dark:from-[#713fc2]/10 dark:to-gray-900 py-10 px-4">
            <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-[#713fc2]/15 dark:border-[#9333EA]/15 relative">
                {/* Decorative header line */}
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#713fc2] to-[#9333EA]"></div>
                
                <div class="p-6 md:p-8">
                    <nav class="flex items-center text-sm mb-6 text-gray-500 dark:text-gray-400">
                        <Link href="/" class="flex items-center hover:text-[#713fc2] dark:hover:text-[#9333EA] transition-colors">
                            <LuHome class="mr-1" /> {_`Help Center`}
                        </Link>
                        <span class="mx-2">›</span>
                        <Link href="/login" class="flex items-center hover:text-[#713fc2] dark:hover:text-[#9333EA] transition-colors">
                            <LuLogIn class="mr-1" /> {_`Account`}
                        </Link>
                        <span class="mx-2">›</span>
                        <span class="text-gray-700 dark:text-gray-300 flex items-center">
                            <LuUser class="mr-1" /> {_`Username Information`}
                        </span>
                    </nav>

                    <div class="mb-4">
                        <Link href="/onboarding/username" class="inline-flex items-center text-[#713fc2] dark:text-[#9333EA] hover:underline">
                            <LuArrowLeft class="mr-1" /> {_`Back to username selection`}
                        </Link>
                    </div>

                    <div class="flex items-center mb-8">
                        <div class="p-2 bg-[#713fc2]/10 dark:bg-[#9333EA]/20 rounded-full mr-4">
                            <ImgLogo class="w-10 h-10 text-[#713fc2] dark:text-[#9333EA]" />
                        </div>
                        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                            {_`Why do we ask for a username?`}
                        </h1>
                    </div>

                    <div class="space-y-6 text-gray-700 dark:text-gray-300">
                        <p class="text-lg leading-relaxed">
                            {_`Your username is an essential part of your identity on Geounity. It's how you'll be recognized across the platform and how other members will find and connect with you.`}
                        </p>

                        <div class="grid md:grid-cols-2 gap-6 my-8">
                            <div class="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-600">
                                <div class="flex items-start mb-3">
                                    <div class="p-2 bg-[#713fc2]/10 dark:bg-[#9333EA]/20 rounded-full mr-3">
                                        <LuUserCheck class="w-5 h-5 text-[#713fc2] dark:text-[#9333EA]" />
                                    </div>
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                        {_`Unique Identification`}
                                    </h3>
                                </div>
                                <p>
                                    {_`Your username provides a unique identifier that distinguishes you from other members, even if they share the same name.`}
                                </p>
                            </div>

                            <div class="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-600">
                                <div class="flex items-start mb-3">
                                    <div class="p-2 bg-[#713fc2]/10 dark:bg-[#9333EA]/20 rounded-full mr-3">
                                        <LuLink class="w-5 h-5 text-[#713fc2] dark:text-[#9333EA]" />
                                    </div>
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                        {_`Personal URL`}
                                    </h3>
                                </div>
                                <p>
                                    {_`Your username creates your personal profile URL (geounity.org/user/username), making it easy for others to find and share your profile.`}
                                </p>
                            </div>

                            <div class="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-600">
                                <div class="flex items-start mb-3">
                                    <div class="p-2 bg-[#713fc2]/10 dark:bg-[#9333EA]/20 rounded-full mr-3">
                                        <LuSearch class="w-5 h-5 text-[#713fc2] dark:text-[#9333EA]" />
                                    </div>
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                        {_`Discoverability`}
                                    </h3>
                                </div>
                                <p>
                                    {_`A username makes it easy for community members to search for and find you when they want to collaborate or connect.`}
                                </p>
                            </div>

                            <div class="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-600">
                                <div class="flex items-start mb-3">
                                    <div class="p-2 bg-[#713fc2]/10 dark:bg-[#9333EA]/20 rounded-full mr-3">
                                        <LuLock class="w-5 h-5 text-[#713fc2] dark:text-[#9333EA]" />
                                    </div>
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                        {_`Privacy Protection`}
                                    </h3>
                                </div>
                                <p>
                                    {_`Using a username allows you to participate in discussions while maintaining some privacy, as you can choose how much personal information to reveal.`}
                                </p>
                            </div>
                        </div>

                        <div class="p-5 bg-[#713fc2]/5 dark:bg-[#9333EA]/10 rounded-xl border border-[#713fc2]/15 dark:border-[#9333EA]/20 mb-6">
                            <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                                <LuUserPlus class="mr-2 text-[#713fc2] dark:text-[#9333EA]" /> 
                                {_`Choosing a good username`}
                            </h3>
                            <ul class="space-y-2 list-disc pl-6">
                                <li>{_`Use a name that's memorable and represents you well`}</li>
                                <li>{_`Keep it between 3-15 characters for best results`}</li>
                                <li>{_`Only use letters, numbers, and underscores`}</li>
                                <li>{_`Avoid impersonating others or using misleading names`}</li>
                                <li>{_`Consider your privacy — usernames can be difficult to change later`}</li>
                            </ul>
                        </div>

                        <p>
                            {_`If you have any questions or need assistance with choosing a username, please contact our support team at`}{" "}
                            <a href="mailto:contact@geounity.org" class="text-[#713fc2] dark:text-[#9333EA] font-medium hover:underline">
                                contact@geounity.org
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}); 