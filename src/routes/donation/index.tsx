import { component$ } from '@builder.io/qwik';
import { _ } from 'compiled-i18n';
import { 
    LuCoffee, 
    LuServer, 
    LuCode, 
    LuHeartHandshake, 
    LuArrowUpRight, 
    LuShield
} from '@qwikest/icons/lucide';

export default component$(() => {
    return (
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-5xl mx-auto">
                {/* Header */}
                <div class="mb-16 text-center">
                    <h1 class="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                        {_`Support Geounity`}
                    </h1>
                    <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        {_`Help us build a more connected democratic future for communities worldwide.`}
                    </p>
                </div>

                {/* Why Donate */}
                <div class="mb-16">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-600 dark:after:bg-blue-500">
                        {_`Why Your Support Matters`}
                    </h2>
                    <p class="mb-4 text-gray-700 dark:text-gray-300">
                        {_`Geounity is a community-driven platform dedicated to strengthening democratic participation across local, national, and global communities. As we grow and evolve, we face ongoing costs to maintain our infrastructure and continue developing new features.`}
                    </p>
                    <p class="text-gray-700 dark:text-gray-300">
                        {_`Your donations directly contribute to keeping Geounity accessible to all, regardless of their economic situation. We believe that democratic tools should be available to everyone, and your support helps make this vision possible.`}
                    </p>
                </div>

                {/* Where Your Money Goes */}
                <div class="mb-16">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-600 dark:after:bg-blue-500">
                        {_`Where Your Money Goes`}
                    </h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div class="text-blue-600 dark:text-blue-500 mb-4">
                                <LuServer class="w-10 h-10" />
                            </div>
                            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                {_`Server Infrastructure`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400">
                                {_`Hosting, database management, and ensuring our platform remains fast, reliable, and secure for all users.`}
                            </p>
                        </div>
                        
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div class="text-blue-600 dark:text-blue-500 mb-4">
                                <LuCode class="w-10 h-10" />
                            </div>
                            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                {_`Development`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400">
                                {_`Supporting our dedicated team of developers who work to improve existing features and build new ones based on community feedback.`}
                            </p>
                        </div>
                        
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div class="text-blue-600 dark:text-blue-500 mb-4">
                                <LuHeartHandshake class="w-10 h-10" />
                            </div>
                            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                                {_`Community Growth`}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400">
                                {_`Expanding our reach to bring Geounity's democratic tools to more communities across the globe.`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Our Commitment */}
                <div class="mb-16 bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg">
                    <div class="flex items-start">
                        <div class="text-blue-600 dark:text-blue-400 mr-5 pt-1">
                            <LuShield class="w-10 h-10" />
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                                {_`Our Commitment to Transparency`}
                            </h3>
                            <p class="text-gray-700 dark:text-gray-300 mb-4">
                                {_`We believe in complete transparency with our community. We're committed to using all donations responsibly and will share regular updates on how your contributions are helping Geounity grow.`}
                            </p>
                            <p class="text-gray-700 dark:text-gray-300">
                                {_`Every donation, no matter how small, makes a significant difference in our ability to maintain and improve the platform.`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Donation Options */}
                <div class="mb-16">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-600 dark:after:bg-blue-500">
                        {_`How to Support Us`}
                    </h2>
                    
                    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                        <div class="text-amber-500 mx-auto mb-6">
                            <LuCoffee class="w-16 h-16 mx-auto" />
                        </div>
                        <h3 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                            {_`Buy Us a Coffee`}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                            {_`Support our team with a donation through Ko-fi. Whether it's a one-time contribution or a recurring support, every bit helps fuel our mission.`}
                        </p>
                        <a 
                            href="https://ko-fi.com/geounity" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-colors duration-300"
                        >
                            {_`Support on Ko-fi`}
                            <LuArrowUpRight class="ml-2 w-5 h-5" />
                        </a>
                    </div>
                </div>
                
                {/* Thank You */}
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                        {_`Thank You!`}
                    </h2>
                    <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        {_`Your generosity is what keeps Geounity growing. Together, we're building a more connected, participatory future for communities worldwide.`}
                    </p>
                </div>
            </div>
        </div>
    );
});
