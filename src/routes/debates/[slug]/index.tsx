import { component$, useSignal, useComputed$, $ } from "@builder.io/qwik"
import type { CountryView } from "~/shared/types"
import { Link, type DocumentHead } from "@builder.io/qwik-city"
import {
    LuEye,
    LuMessageSquare,
    LuSearch,
    LuGlobe,
    LuInfo,
    LuFlag,
    LuArrowBigUp,
    LuArrowBigDown,
    LuCalendar,
    LuUsers,
    LuChevronLeft,
    LuChevronRight,
    LuShare2,
    LuBookmark,
} from "@qwikest/icons/lucide"
import { Image } from "@unpic/qwik"
import { _ } from "compiled-i18n"
import { Alert, Avatar, Badge, Input } from "~/components/ui"
import { useSession } from "~/routes/plugin@auth"
import { formatDateISO } from "~/utils/formatDateISO"
import { dataArray as countriesList } from "~/data/countries"
import { useStylesScoped$ } from "@builder.io/qwik"
import { FormOpinionGlobalDebate } from "~/components/forms/FormOpinionGlobalDebate"
import { useGetDebateBySlug } from "~/shared/loaders"
import type { PropFunction } from "@builder.io/qwik"

export { useGetDebateBySlug, useFormOpinionLoader } from "~/shared/loaders"
export { useFormOpinionAction } from "~/shared/actions"

// Navigation arrow component
const ScrollArrow = component$(
    ({
        direction,
        onClick$,
        disabled,
        class: className,
    }: {
        direction: "left" | "right"
        onClick$: PropFunction<() => void>
        disabled: boolean
        class?: string
    }) => (
        <button
            onClick$={onClick$}
            disabled={disabled}
            class={`
            absolute top-1/2 -translate-y-1/2 z-10
            ${className}
            ${disabled ? "opacity-0" : "opacity-100 hover:bg-white/90 dark:hover:bg-gray-800/90"}
            bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-3
            shadow-lg transition-all duration-200 ease-in-out
            disabled:cursor-not-allowed
        `}
        >
            {direction === "left" ? (
                <LuChevronLeft class="w-6 h-6 text-gray-700 dark:text-gray-200" />
            ) : (
                <LuChevronRight class="w-6 h-6 text-gray-700 dark:text-gray-200" />
            )}
        </button>
    ),
)

// Country view card component
const CountryViewCard = component$(
    ({
        view,
    }: {
        view: CountryView
        userCountry: string
    }) => {
        const countryFlag = useComputed$(() => {
            const countryData = countriesList.find(
                (country) => country.cca2.toLowerCase() === view.community.cca2.toLowerCase(),
            )
            return countryData?.flag || "🏳️"
        })

        return (
            <div class="min-w-[600px] max-w-[600px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div class="flex items-center gap-3 p-5 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/80 dark:from-gray-800/30 to-transparent backdrop-blur-sm">
                    <div class="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full border border-blue-100 dark:border-blue-800/50 shadow-inner">
                        <span class="text-3xl">{countryFlag.value}</span>
                    </div>
                    <div class="flex-grow">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{_`${view.community.name}`}</h3>
                        <div class="flex items-center gap-2 mt-1">
                            <Badge
                                look="secondary"
                                class="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2.5 py-0.5 rounded-full"
                            >
                                <LuMessageSquare class="w-3.5 h-3.5 mr-1" />
                                {_`${view.opinions.length}`}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div class="divide-y divide-gray-100 dark:divide-gray-700/50 max-h-[600px] overflow-y-auto">
                    {view.opinions.map((opinion) => (
                        <div key={opinion.id} class="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                            <div class="flex items-center gap-3 mb-4">
                                <Avatar.Root class="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900/30">
                                    <Avatar.Image src={opinion.user.image} alt={opinion.user.username} />
                                    <Avatar.Fallback class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                        {opinion.user.username.charAt(0).toUpperCase()}
                                    </Avatar.Fallback>
                                </Avatar.Root>
                                <div>
                                    <span class="font-medium text-gray-900 dark:text-white text-sm">{opinion.user.username}</span>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                        <LuCalendar class="w-3 h-3" />
                                        {formatDateISO(opinion.created_at)}
                                    </p>
                                </div>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-700/50">
                                {opinion.content}
                            </div>
                            <div class="flex items-center gap-6 mt-4">
                                <button class="flex items-center gap-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors duration-200">
                                    <LuArrowBigUp class="w-5 h-5" />
                                    <span class="text-sm font-medium">{opinion.upvotes}</span>
                                </button>
                                <button class="flex items-center gap-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200">
                                    <LuArrowBigDown class="w-5 h-5" />
                                    <span class="text-sm font-medium">{opinion.downvotes}</span>
                                </button>
                                <button class="ml-auto text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200">
                                    <LuFlag class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {view.opinions.length === 0 && (
                        <div class="p-10 text-center">
                            <div class="bg-gray-50 dark:bg-gray-800/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                <LuMessageSquare class="w-10 h-10 text-gray-300 dark:text-gray-600" />
                            </div>
                            <p class="text-base text-gray-500 dark:text-gray-400">{_`No comments yet`}</p>
                            <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">{_`Be the first to share a perspective`}</p>
                        </div>
                    )}
                </div>
            </div>
        )
    },
)

export default component$(() => {
    const session = useSession()
    const debate = useGetDebateBySlug()
    console.log('debate', debate.value)
    const searchTerm = useSignal("")
    const isDescriptionExpanded = useSignal(false)

    const hasCommented = useComputed$(() => {
        if (!session.value?.user) return false
        return debate.value?.points_of_view?.some((view) =>
            view.opinions.some((opinion: any) => opinion.user === session.value.user?.name),
        )
    })

    const canComment = useComputed$(() => {
        if (!session.value?.user?.country) return false
        const userCountryView = debate.value?.points_of_view.find(
            (view) => view.community.cca2 === session.value.user?.country,
        )
        return !hasCommented.value && userCountryView
    })

    const defaultCountryCca2 = useComputed$(() => {
        if (!session.value?.user?.country) return null
        const foundCountry = countriesList.find(
            (country) => country.cca2.toLowerCase() === session.value?.user?.country.toLowerCase(),
        )
        return foundCountry ? foundCountry.cca2 : null
    })

    const sortedViews = useComputed$(() => {
        if (!debate.value?.points_of_view) return []
        return [...debate.value.points_of_view].sort((a, b) => b.opinions.length - a.opinions.length)
    })

    const totalComments = useComputed$(() => {
        if (!debate.value?.points_of_view) return 0
        return debate.value.points_of_view.reduce((acc, pov) => acc + pov.opinions.length, 0)
    })

    const toggleDescription = $(() => {
        isDescriptionExpanded.value = !isDescriptionExpanded.value
    })

    // Add scroll container ref and scroll state
    const scrollContainer = useSignal<Element>()
    const showLeftArrow = useSignal(false)
    const showRightArrow = useSignal(true)

    // Handle scroll
    const handleScroll = $((direction: "left" | "right") => {
        if (!scrollContainer.value) return

        const container = scrollContainer.value
        const scrollAmount = container.clientWidth
        const targetScroll = container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)

        container.scrollTo({
            left: targetScroll,
            behavior: "smooth",
        })
    })

    // Update arrow visibility
    const updateArrows = $((element: Element) => {
        const hasScrollLeft = Math.round(element.scrollLeft) > 0
        const hasScrollRight = Math.round(element.scrollLeft) < Math.round(element.scrollWidth - element.clientWidth)

        showLeftArrow.value = hasScrollLeft
        showRightArrow.value = hasScrollRight
    })

    useStylesScoped$(`
        .hero-gradient {
            background: linear-gradient(180deg, 
                rgba(0, 0, 0, 0.7) 0%, 
                rgba(0, 0, 0, 0.5) 50%,
                rgba(0, 0, 0, 0.3) 100%
            );
        }
        
        .debate-description {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            transition: all 0.3s ease;
        }
        
        .debate-description.expanded {
            -webkit-line-clamp: unset;
        }
        
        .header-content {
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.5);
            border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.8);
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(75, 85, 99, 0.5);
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: rgba(75, 85, 99, 0.8);
        }
        
        .card-hover-effect {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card-hover-effect:hover {
            transform: translateY(-4px);
        }
        
        .perspective-input {
            transition: all 0.3s ease;
            border: 1px solid transparent;
        }
        
        .perspective-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
    `)

    return (
        <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            {/* Hero Header */}
            <div class="relative h-[450px] overflow-hidden rounded-b-[2.5rem] shadow-xl">
                {debate.value?.images?.length > 0 && (
                    <Image
                        alt={_`Debate Cover Image`}
                        class="w-full h-full object-cover"
                        src={debate.value.images[0] || "/placeholder.svg"}
                        layout="fill"
                    />
                )}
                <div class="absolute inset-0 hero-gradient backdrop-blur-sm">
                    <div class="container mx-auto px-6 h-full flex flex-col justify-between pt-6 pb-12">
                        <div class="flex items-center gap-3 flex-wrap">
                            <Badge
                                look="secondary"
                                class="bg-blue-600/90 backdrop-blur-sm text-white border border-blue-500/30 px-3 py-1.5 rounded-full shadow-md"
                            >
                                <LuGlobe class="w-4 h-4 mr-1.5" />
                                {_`${debate.value?.type}`}
                            </Badge>
                            <Badge
                                look="secondary"
                                class={`
                                    px-3 py-1.5 backdrop-blur-sm border rounded-full shadow-md
                                    ${debate.value?.status === "OPEN"
                                        ? "bg-green-600/90 text-white border-green-500/30"
                                        : "bg-yellow-600/90 text-white border-yellow-500/30"
                                    }
                                `}
                            >
                                {_`${debate.value?.status}`}
                            </Badge>
                            
                            {/* Badge for national debates */}
                            {debate.value?.type === "NATIONAL" && (
                                <Badge
                                    look="secondary"
                                    class="bg-purple-600/90 backdrop-blur-sm text-white border border-purple-500/30 px-3 py-1.5 rounded-full shadow-md"
                                >
                                    {countriesList.find(
                                        country => country.cca2 === debate.value?.communities?.[0]?.cca2
                                    )?.flag || "🏳️"}{" "}
                                    {debate.value?.communities?.[0]?.name}
                                </Badge>
                            )}
                            
                            {/* Badge for international debates */}
                            {debate.value?.type === "INTERNATIONAL" && debate.value?.points_of_view && (
                                <div class="relative group">
                                    <Badge
                                        look="secondary"
                                        class="bg-indigo-600/90 backdrop-blur-sm text-white border border-indigo-500/30 px-3 py-1.5 rounded-full shadow-md cursor-pointer"
                                    >
                                        <LuGlobe class="w-4 h-4 mr-1.5 inline" />
                                        {debate.value.points_of_view.length} {_`countries`}
                                    </Badge>
                                    
                                    {/* Tooltip with country list */}
                                    <div class="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div class="p-2 max-h-48 overflow-y-auto scrollbar-thin">
                                            {debate.value.points_of_view.map((pov) => {
                                                const country = countriesList.find(
                                                    country => country.cca2 === pov.community.cca2
                                                )
                                                return (
                                                    <div 
                                                        key={pov.community.cca2}
                                                        class="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg"
                                                    >
                                                        <span class="text-xl">{country?.flag || "🏳️"}</span>
                                                        <span class="text-sm text-gray-700 dark:text-gray-300">
                                                            {pov.community.name}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div class="ml-auto flex gap-2">
                                <button class="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-colors duration-200">
                                    <LuShare2 class="w-5 h-5" />
                                    <span class="sr-only">{_`Share`}</span>
                                </button>
                                <button class="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-colors duration-200">
                                    <LuBookmark class="w-5 h-5" />
                                    <span class="sr-only">{_`Bookmark`}</span>
                                </button>
                            </div>
                        </div>

                        <div class="header-content space-y-5 max-w-4xl">
                            <h1 class="text-4xl md:text-5xl font-bold text-white max-w-4xl leading-tight drop-shadow-md">
                                {debate.value?.title}
                            </h1>
                            <div class="flex items-center gap-6 text-white/90 flex-wrap">
                                <span class="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                                    <LuEye class="w-4 h-4" />
                                    <span class="text-sm font-medium">{debate.value?.views_count}</span>
                                </span>
                                <span class="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                                    <LuMessageSquare class="w-4 h-4" />
                                    <span class="text-sm font-medium">{totalComments.value}</span>
                                </span>
                                <span class="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                                    <LuUsers class="w-4 h-4" />
                                    <span class="text-sm font-medium">{debate.value?.points_of_view.length} {_`countries`}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div class="container mx-auto px-6 -mt-6 relative z-10">
                <div class="bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/80 dark:border-gray-700/50 overflow-hidden mb-10 relative z-20 transform transition-all duration-500">
                    <div class="p-8">
                        <div class="flex items-center gap-5 mb-6">
                            <Avatar.Root class="h-14 w-14 ring-4 ring-blue-100 dark:ring-blue-900/30 shadow-md">
                                <Avatar.Image src={debate.value?.creator.image} alt={`@${debate.value?.creator.username}`} />
                                <Avatar.Fallback class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg">
                                    {debate.value?.creator.username.charAt(0).toUpperCase()}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">{_`Created by`}</p>
                                <Link
                                    href={`/user/${debate.value?.creator.username}`}
                                    class="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    @{debate.value?.creator.username}
                                </Link>
                                <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                                    <LuCalendar class="w-4 h-4" />
                                    {formatDateISO(debate.value?.created_at || "")}
                                </p>
                            </div>
                        </div>

                        <div
                            class={`debate-description ${isDescriptionExpanded.value ? "expanded" : ""} bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50`}
                        >
                            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{debate.value?.description}</p>
                        </div>
                        <button
                            onClick$={toggleDescription}
                            class="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-1"
                        >
                            {isDescriptionExpanded.value ? _`Show less` : _`Read more`}
                        </button>

                        <div class="flex flex-wrap gap-2 mt-6">
                            {debate.value?.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    look="secondary"
                                    class="bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors px-3 py-1.5 rounded-full text-sm"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Share Perspective Section */}
                <div class="mt-12">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span class="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                <LuMessageSquare class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </span>
                            {_`Share your perspective`}
                        </h2>
                        <Badge
                            look="secondary"
                            class="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1.5 rounded-full shadow-sm"
                        >
                            <LuUsers class="w-4 h-4 mr-1.5" />
                            {_`${debate.value?.points_of_view.length} countries participating`}
                        </Badge>
                    </div>

                    {session.value?.user && !hasCommented.value ? (
                        canComment.value ? (
                            <div class="bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700/50 p-8">
                                <FormOpinionGlobalDebate
                                    onSubmitCompleted$={() => { }}
                                    defaultCountryCca2={defaultCountryCca2.value || ""}
                                />
                            </div>
                        ) : (
                            <Alert.Root class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 text-yellow-800 dark:text-yellow-200 rounded-xl p-5 shadow-md">
                                <LuInfo class="h-5 w-5" />
                                <Alert.Description class="font-medium">
                                    {_`You can only comment once and in your country's perspective.`}
                                </Alert.Description>
                            </Alert.Root>
                        )
                    ) : (
                        <Alert.Root class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 text-blue-800 dark:text-blue-200 rounded-xl p-5 shadow-md">
                            <LuInfo class="h-5 w-5" />
                            <Alert.Description class="font-medium">{_`Please log in to share your perspective.`}</Alert.Description>
                        </Alert.Root>
                    )}
                </div>

                {/* Country Views Section with Horizontal Scroll */}
                <div class="mt-16 mb-16">
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span class="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                                <LuGlobe class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </span>
                            {_`Points of View by Country`}
                        </h2>
                    </div>

                    <div class="relative mb-8">
                        <div class="max-w-xl bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md border border-gray-200/80 dark:border-gray-700/50 overflow-hidden">
                            <LuSearch class="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder={_`Search countries...`}
                                value={searchTerm.value}
                                onInput$={(e) => (searchTerm.value = (e.target as HTMLInputElement).value)}
                                class="pl-14 h-14 w-full border-0 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-transparent"
                            />
                        </div>
                    </div>

                    <div class="relative">
                        {/* Scroll Arrows */}
                        {showLeftArrow.value && (
                            <ScrollArrow
                                direction="left"
                                onClick$={() => handleScroll("left")}
                                disabled={!showLeftArrow.value}
                                class="left-2 -ml-12"
                            />
                        )}
                        {showRightArrow.value && (
                            <ScrollArrow
                                direction="right"
                                onClick$={() => handleScroll("right")}
                                disabled={!showRightArrow.value}
                                class="right-2 -mr-12"
                            />
                        )}

                        {/* Horizontal Scrolling Container */}
                        <div
                            ref={scrollContainer}
                            onScroll$={(e) => updateArrows(e.target as Element)}
                            class="flex overflow-x-auto gap-8 pb-10 pt-4 px-10 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                        >
                            {sortedViews.value
                                .filter((view) => view.community.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
                                .map((view) => (
                                    <div key={view.community.cca2} class="snap-start snap-always card-hover-effect">
                                        <CountryViewCard view={view} userCountry={session.value?.user?.country || ""} />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export const head: DocumentHead = ({ resolveValue, params }) => {
    const debate = resolveValue(useGetDebateBySlug)
    return {
        title: debate?.title ?? "Debate Not Found",
        meta: [
            {
                name: "description",
                content: debate?.description ?? "",
            },
            {
                name: "slug",
                content: params.slug,
            },
        ],
    }
}

