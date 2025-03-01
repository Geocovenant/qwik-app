import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik"
import { type DocumentHead } from "@builder.io/qwik-city"
import { _ } from "compiled-i18n"
import { LuArrowLeft, LuMessageSquare, LuEye, LuCalendar, LuShield } from "@qwikest/icons/lucide"
import { Avatar, Badge, Button } from "~/components/ui"
import { useSession } from "~/routes/plugin@auth"
import { timeAgo } from "~/utils/dateUtils"
import { useGetPollBySlug } from "~/shared/loaders"
import { useVotePoll } from "~/shared/actions"

// Exportamos los loaders y actions necesarios
export { useGetPollBySlug } from "~/shared/loaders"
export { useVotePoll, useReactPoll } from "~/shared/actions"

export default component$(() => {
    const session = useSession()
    const poll = useGetPollBySlug()
    console.log('pollbbbbbbbbbbbbbbbb', poll.value)
    const actionVote = useVotePoll()
    
    // Estado para manejar las opciones y votos
    const pollState = useSignal({
        options: poll.value?.options || [],
        userVotedOptions: poll.value?.user_voted_options || [],
    })
    
    const totalVotes = useComputed$(() => 
        pollState.value.options.reduce((sum: number, option: any) => sum + option.votes, 0)
    )
    
    const isClosed = useComputed$(() => 
        (poll.value?.ends_at && new Date(poll.value.ends_at) < new Date()) || false
    )
    
    // Función para manejar el voto
    const handleVote = $(async (optionId: number) => {
        if (!session.value?.user) return
        
        let newVotedOptions: number[] = []
        const isVoted = pollState.value.userVotedOptions.includes(optionId)
        
        // Actualización optimista según el tipo de encuesta
        if (poll.value?.type === "BINARY" || poll.value?.type === "SINGLE_CHOICE") {
            newVotedOptions = isVoted ? [] : [optionId]
            
            // Actualizar contadores de votos
            pollState.value = {
                ...pollState.value,
                options: pollState.value.options.map((opt: any) => ({
                    ...opt,
                    votes: opt.id === optionId 
                        ? opt.votes + (isVoted ? -1 : 1)
                        : isVoted 
                            ? opt.votes 
                            : opt.votes - (pollState.value.userVotedOptions.includes(opt.id) ? 1 : 0),
                    voted: opt.id === optionId ? !isVoted : false,
                })),
                userVotedOptions: newVotedOptions
            }
        } else if (poll.value?.type === "MULTIPLE_CHOICE") {
            newVotedOptions = isVoted
                ? pollState.value.userVotedOptions.filter((id: number) => id !== optionId)
                : [...pollState.value.userVotedOptions, optionId]
            
            // Actualizar contador de votos
            pollState.value = {
                ...pollState.value,
                options: pollState.value.options.map((opt: any) => ({
                    ...opt,
                    votes: opt.id === optionId ? opt.votes + (isVoted ? -1 : 1) : opt.votes,
                    voted: opt.id === optionId ? !isVoted : opt.voted,
                })),
                userVotedOptions: newVotedOptions
            }
        }
        
        // Llamada a la API
        const result = await actionVote.submit({
            pollId: poll.value?.id || 0,
            optionIds: newVotedOptions,
        })
        
        // Si hay error, revertimos los cambios
        if (result.status !== 200) {
            pollState.value = {
                options: poll.value?.options || [],
                userVotedOptions: poll.value?.user_voted_options || [],
            }
        }
    })
    
    // Función para obtener el color de fondo para la barra de progreso según el tipo
    const getProgressBarColor = (isSelected: boolean) => {
        if (isSelected) {
            switch (poll.value?.type) {
                case "BINARY":
                    return "bg-cyan-500"
                case "SINGLE_CHOICE":
                    return "bg-purple-500"
                case "MULTIPLE_CHOICE":
                    return "bg-emerald-500"
                default:
                    return "bg-blue-500"
            }
        } else {
            switch (poll.value?.type) {
                case "BINARY":
                    return "bg-cyan-300"
                case "SINGLE_CHOICE":
                    return "bg-purple-300"
                case "MULTIPLE_CHOICE":
                    return "bg-emerald-300"
                default:
                    return "bg-blue-300"
            }
        }
    }
    
    // Función para obtener el color del borde según el tipo de encuesta
    const getBorderColorClass = () => {
        switch (poll.value?.type) {
            case "BINARY":
                return "border-cyan-400 dark:border-cyan-600"
            case "SINGLE_CHOICE":
                return "border-purple-400 dark:border-purple-600"
            case "MULTIPLE_CHOICE":
                return "border-emerald-400 dark:border-emerald-600"
            default:
                return "border-blue-400 dark:border-blue-600"
        }
    }
    
    // Función para obtener el color del badge según el tipo de encuesta
    const getBadgeColorClass = () => {
        switch (poll.value?.type) {
            case "BINARY":
                return "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300"
            case "SINGLE_CHOICE":
                return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            case "MULTIPLE_CHOICE":
                return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
            default:
                return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
        }
    }
    
    // Determinar el tipo de encuesta para mostrar un icono
    const getPollTypeIcon = () => {
        switch (poll.value?.type) {
            case "BINARY":
                return "⚖️"
            case "SINGLE_CHOICE":
                return "🔘"
            case "MULTIPLE_CHOICE":
                return "✅"
            default:
                return "📊"
        }
    }

    return (
        <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-10">
            <div class="container mx-auto px-4 max-w-4xl">
                {/* Botón de regreso */}
                <Button 
                    class="mb-6 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick$={() => history.back()}
                >
                    <LuArrowLeft class="w-4 h-4 mr-2" />
                    {_`Back`}
                </Button>
                
                {/* Tarjeta principal de la encuesta */}
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-10">
                    {/* Ribbon para encuestas cerradas */}
                    {isClosed.value && (
                        <div class="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 transform rotate-45 translate-x-8 translate-y-4 shadow-md">
                            {_`Closed`}
                        </div>
                    )}
                    
                    {/* Cabecera */}
                    <div class="p-8">
                        <div class="flex items-center gap-3 mb-6">
                            <span class="text-3xl" title={poll.value?.type}>
                                {getPollTypeIcon()}
                            </span>
                            <div>
                                <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                    {poll.value?.title}
                                </h1>
                                <div class="flex items-center gap-3 mt-2">
                                    <Badge
                                        look="secondary"
                                        class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full"
                                    >
                                        {_`${poll.value?.type}`}
                                    </Badge>
                                    <Badge
                                        look="secondary"
                                        class={`px-3 py-1 rounded-full
                                            ${poll.value?.status === "OPEN"
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                            }
                                        `}
                                    >
                                        {_`${poll.value?.status}`}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        
                        {/* Descripción */}
                        {poll.value?.description && (
                            <div class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50 mb-6">
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {poll.value.description}
                                </p>
                            </div>
                        )}
                        
                        {/* Información del creador */}
                        <div class="flex items-center gap-4 mb-6">
                            <Avatar.Root class="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900/30">
                                <Avatar.Fallback class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                    {poll.value?.creator_username?.charAt(0).toUpperCase() || "U"}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            <div>
                                <div class="flex items-center gap-2">
                                    {poll.value?.is_anonymous ? (
                                        <div class="flex items-center gap-1">
                                            <LuShield class="w-4 h-4 text-yellow-500" />
                                            <span class="font-semibold text-yellow-600 dark:text-yellow-400">
                                                {_`Anonymous`}
                                            </span>
                                        </div>
                                    ) : (
                                        <span class="font-medium text-gray-700 dark:text-gray-300">
                                            {poll.value?.creator_username}
                                        </span>
                                    )}
                                </div>
                                <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <span class="flex items-center gap-1">
                                        <LuCalendar class="w-3.5 h-3.5" />
                                        {poll.value?.created_at ? timeAgo(new Date(poll.value.created_at)) : ""}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <LuEye class="w-3.5 h-3.5" />
                                        {poll.value?.views_count || 0} {_`views`}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <LuMessageSquare class="w-3.5 h-3.5" />
                                        {poll.value?.comments_count || 0} {_`comments`}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Estadísticas */}
                        <div class="flex items-center gap-2 text-sm mb-6">
                            <span class="text-gray-500 dark:text-gray-400">{_`Total votes:`}</span>
                            <span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-medium text-gray-700 dark:text-gray-300">
                                {totalVotes.value}
                            </span>
                            
                            {poll.value?.ends_at && (
                                <div
                                    class={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full ${isClosed.value
                                            ? "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                                            : "bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 animate-pulse"
                                        }`}
                                >
                                    <span class="text-xs uppercase font-bold text-red-600 dark:text-red-400">
                                        {isClosed.value ? _`Ended` : _`Ends`}:
                                    </span>
                                    <span class="font-medium text-red-700 dark:text-red-300">
                                        {new Date(poll.value.ends_at).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Opciones de votación */}
                    <div class="bg-gray-50 dark:bg-gray-800/30 p-8 border-t border-gray-100 dark:border-gray-700/50">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6">{_`Vote options`}</h2>
                        
                        <div class="space-y-4">
                            {pollState.value.options.map((option: any) => {
                                const isSelected = pollState.value.userVotedOptions.includes(option.id)
                                const percentage = totalVotes.value > 0 ? (option.votes / totalVotes.value) * 100 : 0
                                
                                return (
                                    <div
                                        key={option.id}
                                        class={`poll-option p-5 rounded-lg cursor-pointer transition-all duration-300 transform ${isSelected
                                                ? "bg-gray-50 dark:bg-gray-700 border-2 shadow-md scale-[1.01]"
                                                : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border hover:scale-[1.01] border-gray-200 dark:border-gray-700"
                                            } ${isSelected ? getBorderColorClass() : ""}`}
                                        onClick$={() => !isClosed.value && handleVote(option.id)}
                                    >
                                        <div class="flex justify-between items-center mb-2">
                                            <span class={`${isSelected ? "text-lg font-bold" : "text-gray-700 dark:text-gray-300 font-medium"}`}>
                                                {option.text}
                                            </span>
                                            <span
                                                class={`text-sm font-medium ${isSelected ? "px-2 py-1 rounded-full" : "text-gray-500 dark:text-gray-400"
                                                    } ${isSelected ? getBadgeColorClass() : ""}`}
                                            >
                                                {option.votes} {_`votes`} ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                        <div class="poll-progress h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                class={`poll-progress-bar h-full transition-all duration-500 ease-out ${getProgressBarColor(isSelected)}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        
                        {!session.value?.user && (
                            <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg text-center">
                                <p class="text-blue-700 dark:text-blue-300 font-medium">
                                    {_`Sign in to vote on this poll`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Sección de comentarios (simplificada) */}
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-10">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <LuMessageSquare class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {_`Comments`} ({poll.value?.comments_count || 0})
                    </h2>
                    
                    {/* Aquí iría la lista de comentarios */}
                    <div class="text-center py-10">
                        <p class="text-gray-500 dark:text-gray-400">
                            {_`Comments section will be implemented soon`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
})

export const head: DocumentHead = ({ resolveValue, params }) => {
    const poll = resolveValue(useGetPollBySlug)
    return {
        title: poll?.title ?? "Poll Not Found",
        meta: [
            {
                name: "description",
                content: poll?.description ?? "",
            },
            {
                name: "slug",
                content: params.slug,
            },
        ],
    }
}
