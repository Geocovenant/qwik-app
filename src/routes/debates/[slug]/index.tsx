import { component$, useSignal, useComputed$, $, type PropFunction } from "@builder.io/qwik"
import { Link, type DocumentHead } from "@builder.io/qwik-city"
import {
    LuEye,
    LuMessageSquare,
    LuSearch,
    LuGlobe,
    LuInfo,
    LuFlag,
    LuCalendar,
    LuUsers,
    LuChevronLeft,
    LuChevronRight,
    LuShare2,
    LuBookmark,
} from "@qwikest/icons/lucide"
import { Image } from "@unpic/qwik"
import { Alert, Avatar, Badge, Button, Input } from "~/components/ui"
import { useSession } from "~/routes/plugin@auth"
import { formatDateISO } from "~/utils/formatDateISO"
import { dataArray as countriesList } from "~/data/countries"
import { useStylesScoped$ } from "@builder.io/qwik"
import { FormOpinionGlobalDebate } from "~/components/forms/FormOpinionGlobalDebate"
import { useGetDebateBySlug } from "~/shared/loaders"
import styles from "./debate-page.css?inline"
import { FormOpinionInternationalDebate } from "~/components/forms/FormOpinionInternationalDebate"
import { FormOpinionNationalDebate } from "~/components/forms/FormOpinionNationalDebate"
import Modal from "~/components/Modal"
import SocialLoginButtons from "~/components/SocialLoginButtons"
import ViewPointCard from "~/components/debates/ViewPointCard"
import { _ } from "compiled-i18n"

export { useGetDebateBySlug, useFormOpinionLoader, useGetCountryDivisions, useFormReportLoader } from "~/shared/loaders"
export { useFormOpinionAction, useReactOpinion, useFormReportAction, useDeleteOpinion } from "~/shared/actions"

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

export default component$(() => {
    useStylesScoped$(styles)
    const session = useSession()
    const debate = useGetDebateBySlug()
    const searchTerm = useSignal("")
    const isDescriptionExpanded = useSignal(false)
    const showLoginModal = useSignal(false)

    // Referencias para scroll horizontal
    const scrollContainer = useSignal<Element>()
    const showLeftArrow = useSignal(false)
    const showRightArrow = useSignal(true)

    const hasCommented = useComputed$(() => {
        if (!session.value?.user) return false
        return debate.value?.points_of_view?.some((view) =>
            view.opinions.some((opinion: any) => opinion.user.username === session.value?.user?.username),
        )
    })

    const defaultCountryCca2 = useComputed$(() => {
        if (!session.value?.user) return null
        const countryName = session.value?.user?.name
        if (!countryName) return null
        
        const foundCountry = countriesList.find(
            (country) => country.cca2.toLowerCase() === countryName.toLowerCase(),
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

    // Para desplazamiento horizontal
    const handleScroll = $((direction: "left" | "right") => {
        if (!scrollContainer.value) return

        const container = scrollContainer.value
        const scrollAmount = container.clientWidth * 0.75

        if (direction === "left") {
            container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
        } else {
            container.scrollBy({ left: scrollAmount, behavior: "smooth" })
        }
    })

    const updateArrows = $((container: Element) => {
        if (!container) return

        // Show left arrow if not at the beginning
        showLeftArrow.value = container.scrollLeft > 0

        // Show right arrow if not at the end
        const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10
        showRightArrow.value = !isAtEnd
    })
    
    const onSubmitCompleted$ = $(() => {
        // Reload the debate data after submitting an opinion
        window.location.reload()
    })
    
    const onShowLoginModal$ = $(() => {
        showLoginModal.value = true
    })
    
    // Obtener el texto explicativo según el tipo de debate
    const getDebateTypeExplanation = () => {
        switch (debate.value?.type) {
            case "GLOBAL":
                return _`En este debate global, cada país puede compartir su punto de vista. Al opinar, deberás seleccionar tu país de origen.`
            case "INTERNATIONAL":
                return _`En este debate internacional, solo pueden participar los países seleccionados. Selecciona tu país de la lista para compartir tu opinión.`
            case "NATIONAL":
                return _`En este debate nacional, cada región del país puede compartir su punto de vista. Selecciona tu región para opinar.`
            case "REGIONAL":
                return _`En este debate regional, cada subregión puede compartir su punto de vista. Selecciona tu subregión para opinar.`
            case "SUBREGIONAL":
                return _`En este debate subregional, cada localidad puede compartir su punto de vista. Selecciona tu localidad para opinar.`
            default:
                return _`Participa en este debate compartiendo tu opinión.`
        }
    }
    
    // Obtener el título de la sección de puntos de vista
    const getViewPointsTitle = () => {
        switch(debate.value?.type) {
            case "NATIONAL":
                return _`Puntos de Vista por Región`
            case "REGIONAL":
                return _`Puntos de Vista por Subregión`
            case "SUBREGIONAL":
                return _`Puntos de Vista por Localidad`
            default:
                return _`Puntos de Vista por País`
        }
    }
    
    // Obtener el placeholder para la búsqueda
    const getSearchPlaceholder = () => {
        switch(debate.value?.type) {
            case "NATIONAL":
                return _`Buscar regiones...`
            case "REGIONAL":
                return _`Buscar subregiones...`
            case "SUBREGIONAL":
                return _`Buscar localidades...`
            default:
                return _`Buscar países...`
        }
    }
    
    // Obtener el texto de "no hay resultados" para la búsqueda
    const getNoResultsText = () => {
        switch(debate.value?.type) {
            case "NATIONAL":
                return _`No se encontraron regiones que coincidan con "${searchTerm.value}"`
            case "REGIONAL":
                return _`No se encontraron subregiones que coincidan con "${searchTerm.value}"`
            case "SUBREGIONAL":
                return _`No se encontraron localidades que coincidan con "${searchTerm.value}"`
            default:
                return _`No se encontraron países que coincidan con "${searchTerm.value}"`
        }
    }
    
    // Obtener el texto de "no hay participantes"
    const getNoParticipantsText = () => {
        switch(debate.value?.type) {
            case "NATIONAL":
                return _`No hay regiones participando todavía`
            case "REGIONAL":
                return _`No hay subregiones participando todavía`
            case "SUBREGIONAL":
                return _`No hay localidades participando todavía`
            default:
                return _`No hay países participando todavía`
        }
    }
    
    // Obtener el texto de "sé el primero..."
    const getBeFirstText = () => {
        switch(debate.value?.type) {
            case "NATIONAL":
                return _`Sé el primero en compartir una perspectiva desde tu región`
            case "REGIONAL":
                return _`Sé el primero en compartir una perspectiva desde tu subregión`
            case "SUBREGIONAL":
                return _`Sé el primero en compartir una perspectiva desde tu localidad`
            default:
                return _`Sé el primero en compartir una perspectiva desde tu país`
        }
    }

    return (
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
            {/* Modal de login */}
            <Modal
                title={_`Iniciar sesión`}
                show={showLoginModal}
            >
                <div class="p-6 flex flex-col items-center">
                    <p class="text-center text-gray-600 dark:text-gray-300 mb-6">
                        {_`Inicia sesión para participar en los debates y compartir tu opinión.`}
                    </p>
                    <SocialLoginButtons />
                </div>
            </Modal>

            {/* Hero Header */}
            <div class="relative h-[450px] overflow-hidden rounded-b-[2.5rem] shadow-xl">
                {debate.value?.images && debate.value.images.length > 0 ? (
                    <Image
                        alt={_`Debate Cover Image`}
                        class="w-full h-full object-cover"
                        src={debate.value.images[0] || "/placeholder.svg"}
                        layout="fill"
                    />
                ) : (
                    <div class="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800"></div>
                )}
                <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

                {/* Título y estadísticas */}
                <div class="absolute inset-0 flex items-center">
                    <div class="container mx-auto px-6">
                        <div class="max-w-4xl">
                            <div class="flex flex-wrap gap-3 mb-4">
                                <Badge
                                    look="secondary"
                                    class="bg-blue-600/90 backdrop-blur-sm text-white border border-blue-500/30 px-3 py-1.5 rounded-full shadow-md"
                                >
                                    {debate.value?.type === "GLOBAL" ? (
                                        <LuGlobe class="w-4 h-4 mr-1.5" />
                                    ) : debate.value?.type === "INTERNATIONAL" ? (
                                        <LuGlobe class="w-4 h-4 mr-1.5" />
                                    ) : (
                                        <LuFlag class="w-4 h-4 mr-1.5" />
                                    )}
                                    {debate.value?.type === "GLOBAL"
                                        ? _`Debate Global`
                                        : debate.value?.type === "INTERNATIONAL"
                                        ? _`Debate Internacional`
                                        : debate.value?.type === "NATIONAL"
                                        ? _`Debate Nacional`
                                        : debate.value?.type === "REGIONAL"
                                        ? _`Debate Regional`
                                        : debate.value?.type === "SUBREGIONAL"
                                        ? _`Debate Subregional`
                                        : _`Debate Local`}
                                </Badge>
                                
                                {/* Badge for national debates */}
                                {debate.value?.type === "NATIONAL" && debate.value.communities && debate.value.communities.length > 0 && (
                                    <Badge
                                        look="secondary"
                                        class="bg-purple-600/90 backdrop-blur-sm text-white border border-purple-500/30 px-3 py-1.5 rounded-full shadow-md"
                                    >
                                        {countriesList.find(
                                            country => country.cca2 === debate.value?.communities?.[0].cca2
                                        )?.flag || "🏳️"}{" "}
                                        {debate.value?.communities?.[0].name}
                                    </Badge>
                                )}

                                <Badge
                                    look="secondary"
                                    class="bg-emerald-600/90 backdrop-blur-sm text-white border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-md"
                                >
                                    <LuMessageSquare class="w-4 h-4 mr-1.5" />
                                    {_`${totalComments.value} opiniones`}
                                </Badge>

                                <Badge
                                    look="secondary"
                                    class="bg-amber-600/90 backdrop-blur-sm text-white border border-amber-500/30 px-3 py-1.5 rounded-full shadow-md"
                                >
                                    <LuEye class="w-4 h-4 mr-1.5" />
                                    {_`${debate.value?.views_count || 0} vistas`}
                                </Badge>
                            </div>

                            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md tracking-tight">
                                {debate.value?.title || ""}
                            </h1>

                            {/* <div class="flex flex-wrap gap-3 mt-6">
                                <Button class="bg-white/90 hover:bg-white text-blue-700 hover:text-blue-800 backdrop-blur-sm font-medium shadow-lg">
                                    <LuShare2 class="w-5 h-5 mr-2" />
                                    {_`Compartir`}
                                </Button>

                                <Button class="bg-white/90 hover:bg-white text-blue-700 hover:text-blue-800 backdrop-blur-sm font-medium shadow-lg">
                                    <LuBookmark class="w-5 h-5 mr-2" />
                                    {_`Guardar`}
                                </Button>
                            </div> */}
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
                                {debate.value?.creator?.image && (
                                    <Avatar.Image src={debate.value.creator.image} alt={`@${debate.value.creator.username || ""}`} />
                                )}
                                <Avatar.Fallback class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg">
                                    {debate.value?.creator?.username?.charAt(0).toUpperCase() || "?"}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">{_`Creado por`}</p>
                                <Link
                                    href={`/user/${debate.value?.creator?.username || ""}`}
                                    class="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    @{debate.value?.creator?.username || ""}
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
                            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{debate.value?.description || ""}</p>
                        </div>
                        <button
                            onClick$={toggleDescription}
                            class="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-1"
                        >
                            {isDescriptionExpanded.value ? _`Mostrar menos` : _`Leer más`}
                        </button>

                        <div class="flex flex-wrap gap-2 mt-6">
                            {debate.value?.tags && debate.value.tags.map((tag) => (
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
                            {_`Comparte tu perspectiva`}
                        </h2>
                        <Badge
                            look="secondary"
                            class="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1.5 rounded-full shadow-sm"
                        >
                            <LuUsers class="w-4 h-4 mr-1.5" />
                            {debate.value?.type === "NATIONAL" 
                                ? _`${debate.value?.points_of_view?.length || 0} regiones participando`
                                : _`${debate.value?.points_of_view?.length || 0} países participando`
                            }
                        </Badge>
                    </div>

                    {/* Explicación del tipo de debate */}
                    <Alert.Root class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 text-blue-800 dark:text-blue-200 rounded-xl p-5 shadow-md mb-4">
                        <LuInfo class="h-5 w-5" />
                        <Alert.Description class="font-medium">
                            {getDebateTypeExplanation()}
                        </Alert.Description>
                    </Alert.Root>

                    {session.value?.user ? (
                        hasCommented.value ? (
                            <Alert.Root class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 text-yellow-800 dark:text-yellow-200 rounded-xl p-5 shadow-md">
                                <LuInfo class="h-5 w-5" />
                                <Alert.Description class="font-medium">
                                    {_`Solo puedes comentar una vez en este debate.`}
                                </Alert.Description>
                            </Alert.Root>
                        ) : (
                            <div class="bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700/50 p-8">
                                {debate.value?.type === "GLOBAL" ? (
                                    <FormOpinionGlobalDebate
                                        onSubmitCompleted$={onSubmitCompleted$}
                                        defaultCountryCca2={defaultCountryCca2.value || ""}
                                    />
                                ) : debate.value?.type === "INTERNATIONAL" ? (
                                    <FormOpinionInternationalDebate
                                        onSubmitCompleted$={onSubmitCompleted$}
                                        defaultCountryCca2={defaultCountryCca2.value || ""}
                                        pointsOfView={debate.value?.points_of_view || []}
                                    />
                                ) : (
                                    <FormOpinionNationalDebate
                                        onSubmitCompleted$={onSubmitCompleted$}
                                    />
                                )}
                            </div>
                        )
                    ) : (
                        <Alert.Root class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 text-blue-800 dark:text-blue-200 rounded-xl p-5 shadow-md">
                            <LuInfo class="h-5 w-5" />
                            <Alert.Description class="font-medium">
                                {_`Por favor `}
                                <Button 
                                    onClick$={onShowLoginModal$}
                                    class="inline font-semibold underline hover:text-blue-700 dark:hover:text-blue-300 px-0 py-0 bg-transparent"
                                >
                                    {_`inicia sesión`}
                                </Button>
                                {_` para compartir tu perspectiva.`}
                            </Alert.Description>
                        </Alert.Root>
                    )}
                </div>

                {/* Country/Region Views Section with Horizontal Scroll */}
                <div class="mt-16 mb-16">
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span class="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                                {debate.value?.type === "NATIONAL" ? (
                                    <LuFlag class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                ) : (
                                    <LuGlobe class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                )}
                            </span>
                            {getViewPointsTitle()}
                        </h2>
                    </div>

                    <div class="relative mb-8">
                        <div class="max-w-xl bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md border border-gray-200/80 dark:border-gray-700/50 overflow-hidden">
                            <LuSearch class="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder={getSearchPlaceholder()}
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
                                    <div key={view.community.id || view.community.cca2 || view.id} class="snap-start snap-always card-hover-effect">
                                        <ViewPointCard 
                                            view={view} 
                                            isAuthenticated={!!session.value?.user}
                                            onShowLoginModal$={onShowLoginModal$}
                                            currentUsername={session.value?.user?.username || ""}
                                        />
                                    </div>
                                ))}

                            {/* Mensaje cuando no hay resultados en la búsqueda */}
                            {searchTerm.value && sortedViews.value.filter((view) => 
                                view.community.name.toLowerCase().includes(searchTerm.value.toLowerCase())
                            ).length === 0 && (
                                <div class="min-w-[600px] flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/50 shadow-md">
                                    <div class="bg-gray-50 dark:bg-gray-800/30 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                                        <LuSearch class="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {debate.value?.type === "NATIONAL" ? _`No se encontraron regiones` : _`No se encontraron países`}
                                    </h3>
                                    <p class="text-gray-500 dark:text-gray-400 text-center">
                                        {getNoResultsText()}
                                    </p>
                                </div>
                            )}

                            {/* Mensaje cuando no hay países/regiones participando */}
                            {sortedViews.value.length === 0 && !searchTerm.value && (
                                <div class="min-w-[600px] flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/50 shadow-md">
                                    <div class="bg-gray-50 dark:bg-gray-800/30 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                                        {debate.value?.type === "NATIONAL" ? (
                                            <LuFlag class="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                        ) : (
                                            <LuGlobe class="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                        )}
                                    </div>
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {getNoParticipantsText()}
                                    </h3>
                                    <p class="text-gray-500 dark:text-gray-400 text-center">
                                        {getBeFirstText()}
                                    </p>
                                </div>
                            )}
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
        title: debate?.title ?? "Debate no encontrado",
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

