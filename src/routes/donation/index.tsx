import { $, component$, useSignal } from '@builder.io/qwik';
import { _ } from 'compiled-i18n';
import {
    LuCoffee,
    LuServer,
    LuCode,
    LuHeartHandshake,
    LuArrowUpRight,
    LuShield,
    LuCopy,
    LuCheckCircle,
} from '@qwikest/icons/lucide';
import { Accordion } from '~/components/ui/accordion/accordion';

import BitcoinIcon from '~/icons/bitcoin.svg?jsx';
import EthereumIcon from '~/icons/ethereum.svg?jsx';
import DogeIcon from '~/icons/dogecoin.svg?jsx';
import UsdtIcon from '~/icons/usdt.svg?jsx';
import UsdcIcon from '~/icons/usdc.svg?jsx';
import BnbIcon from '~/icons/bnb.svg?jsx';
import DaiIcon from '~/icons/dai.svg?jsx';
import SolanaIcon from '~/icons/solana.svg?jsx';
import RippleIcon from '~/icons/xrp.svg?jsx';

export default component$(() => {
    // Add signal to control the visibility of the copied message
    const showCopiedMessage = useSignal(false);

    const copyToClipboard = $((text: string) => {
        navigator.clipboard.writeText(text);
        showCopiedMessage.value = true;
        setTimeout(() => {
            showCopiedMessage.value = false;
        }, 2000);
    });

    const cryptoData = [
        {
            name: "Bitcoin (BTC)",
            address: "bc1qv2yjs9mrf3376uzrf0dnhsfy9tarf6s0mxk7w0",
            network: "BTC",
            color: "text-[#F7931A]",
            bgColor: "bg-[#F7931A]/10",
        },
        {
            name: "Ethereum (ETH)",
            address: "0x4A0c64171bba525b580e0d1fAb4ED83a314CB082",
            network: "ERC20",
            color: "text-[#627EEA]",
            bgColor: "bg-[#627EEA]/10",
        },
        {
            name: "Dogecoin (DOGE)",
            address: "DPkfwL6uR9uhm1P2NqD1TmA6LarNugrXyD",
            network: "DOGE",
            color: "text-[#C2A633]",
            bgColor: "bg-[#C2A633]/10",
        },
        {
            name: "Tether (USDT)",
            address: "0x4A0c64171bba525b580e0d1fAb4ED83a314CB082",
            network: "BEP20",
            color: "text-[#26A17B]",
            bgColor: "bg-[#26A17B]/10",
        },
        {
            name: "USD Coin (USDC)",
            address: "0x4A0c64171bba525b580e0d1fAb4ED83a314CB082",
            network: "BEP20",
            color: "text-[#2775CA]",
            bgColor: "bg-[#2775CA]/10",
        },
        {
            name: "Binance Coin (BNB)",
            address: "0x4A0c64171bba525b580e0d1fAb4ED83a314CB082",
            network: "BEP20",
            color: "text-[#F3BA2F]",
            bgColor: "bg-[#F3BA2F]/10",
        },
        {
            name: "Dai (DAI)",
            address: "0x4A0c64171bba525b580e0d1fAb4ED83a314CB082",
            network: "BEP20",
            color: "text-[#F5AC37]",
            bgColor: "bg-[#F5AC37]/10",
        },
        {
            name: "Solana (SOL)",
            address: "6upJMmLsgdMnuPEJiE9863uLEsd8KFVGaCVSneJ2u4uM",
            network: "SOL",
            color: "text-[#00FFA3]",
            bgColor: "bg-[#00FFA3]/10",
        },
        {
            name: "Ripple (XRP)",
            address: "radpYi88bTTf1QQVVjDaQGi9WEiLQ5ZUBY",
            network: "RIPPLE",
            memo: "2171582678",
            color: "text-[#23292F]",
            bgColor: "bg-[#23292F]/10 dark:bg-[#23292F]/30",
        },
    ]

    // Estado para las pestañas
    const activeTab = useSignal('kofi');

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

                    {/* Tabs Navigation */}
                    <div class="mb-8">
                        <div class="grid grid-cols-2 gap-2 rounded-lg p-1 text-center bg-gray-200 dark:bg-gray-800">
                            <button
                                onClick$={() => activeTab.value = 'kofi'}
                                class={{
                                    'py-3 font-medium rounded-md transition-all': true,
                                    'bg-white dark:bg-gray-700 shadow': activeTab.value === 'kofi',
                                    'text-gray-600 dark:text-gray-400': activeTab.value !== 'kofi'
                                }}
                            >
                                {_`Ko-fi Donation`}
                            </button>
                            <button
                                onClick$={() => activeTab.value = 'crypto'}
                                class={{
                                    'py-3 font-medium rounded-md transition-all': true,
                                    'bg-white dark:bg-gray-700 shadow': activeTab.value === 'crypto',
                                    'text-gray-600 dark:text-gray-400': activeTab.value !== 'crypto'
                                }}
                            >
                                {_`Cryptocurrency`}
                            </button>
                        </div>
                    </div>

                    {/* Ko-fi Tab Content */}
                    <div class={{ 'hidden': activeTab.value !== 'kofi' }}>
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

                    {/* Crypto Tab Content */}
                    <div class={{ 'hidden': activeTab.value !== 'crypto' }}>
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <div class="mb-6">
                                <h3 class="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
                                    {_`Cryptocurrency Donations`}
                                </h3>
                                <p class="text-gray-600 dark:text-gray-400">
                                    {_`Support our project with your preferred cryptocurrency. Please ensure you use the correct network when sending funds to avoid loss.`}
                                </p>
                            </div>

                            <Accordion.Root collapsible>
                                {cryptoData.map((crypto, index) => (
                                    <Accordion.Item key={index} value={`item-${index}`}>
                                        <Accordion.Trigger class="hover:no-underline w-full">
                                            <div class="flex items-center">
                                                <div class={`p-2 rounded-full mr-3 ${crypto.bgColor}`}>
                                                    {index === 0 && (
                                                        <BitcoinIcon
                                                            style={{ width: '24px', height: '24px' }}
                                                        />
                                                    )}
                                                    {index === 1 && (
                                                        <EthereumIcon
                                                            style={{ width: '24px', height: '24px' }}
                                                        />
                                                    )}
                                                    {index === 2 && (
                                                        <DogeIcon
                                                            style={{ width: '24px', height: '24px' }}
                                                        />
                                                    )}
                                                    {index === 3 && (
                                                        <UsdtIcon
                                                            style={{ width: '24px', height: '24px' }}
                                                        />
                                                    )}
                                                    {index === 4 && (
                                                        <UsdcIcon
                                                            style={{ width: '24px', height: '24px' }}
                                                        />
                                                    )}
                                                    {index === 5 && (
                                                        <BnbIcon
                                                            style={{ width: '24px', height: '24px' }}
                                                        />
                                                    )}
                                                    {index === 6 && (
                                                        <DaiIcon
                                                            style={{ width: '24px', height: '24px' }}
                                                        />
                                                    )}
                                                    {index === 7 && (
                                                        <SolanaIcon
                                                            style={{ width: '24px', height: '24px' }}
                                                        />
                                                    )}
                                                    {index === 8 && (
                                                        <RippleIcon
                                                            style={{ width: '24px', height: '24px' }}
                                                        />
                                                    )}
                                                </div>
                                                <span>{crypto.name}</span>
                                            </div>
                                        </Accordion.Trigger>
                                        <Accordion.Content>
                                            <div class="p-4 rounded-md bg-gray-50 dark:bg-gray-900 mb-2">
                                                <div class="flex flex-col space-y-2">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{_`Address:`}</span>
                                                        <div class="relative">
                                                            <button
                                                                onClick$={() => copyToClipboard(crypto.address)}
                                                                class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                title={_`Copy address`}
                                                            >
                                                                {showCopiedMessage.value ? (
                                                                    <LuCheckCircle class="h-4 w-4 text-green-500" />
                                                                ) : (
                                                                    <LuCopy class="h-4 w-4" />
                                                                )}
                                                            </button>
                                                            {showCopiedMessage.value && <div class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md text-sm shadow-lg z-50 transition-opacity">
                                                                <div class="flex items-center">
                                                                    <LuCheckCircle class="h-4 w-4 mr-2" />
                                                                    {_`Link copied!`}
                                                                </div>
                                                            </div>}
                                                        </div>
                                                    </div>
                                                    <div class="font-mono text-sm break-all bg-gray-100 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                        {crypto.address}
                                                    </div>

                                                    <div class="mt-2 flex items-center">
                                                        <div class="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-3 w-full">
                                                            <div class="flex">
                                                                <div class="flex-shrink-0">
                                                                    <LuShield class="h-5 w-5 text-yellow-500" aria-hidden="true" />
                                                                </div>
                                                                <div class="ml-3">
                                                                    <p class="text-sm text-yellow-700 dark:text-yellow-200">
                                                                        {_`Important: Use `}<strong>{crypto.network}</strong>{_` network only`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Accordion.Content>
                                    </Accordion.Item>
                                ))}
                            </Accordion.Root>
                        </div>
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
