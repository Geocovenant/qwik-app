import { component$, useComputed$ } from "@builder.io/qwik"
import type { QRL } from "@builder.io/qwik"
import { _ } from "compiled-i18n"
import { LuMessageSquare } from "@qwikest/icons/lucide"
import { Badge } from "~/components/ui"
import { dataArray as countriesList } from "~/data/countries"
import OpinionItem from "./OpinionItem"
import type { CountryView } from "~/shared/types"

export interface ViewPointCardProps {
  view: CountryView
  isAuthenticated: boolean
  currentUsername?: string
  onShowLoginModal$: QRL<() => void>
}

export default component$<ViewPointCardProps>(({
  view,
  isAuthenticated,
  currentUsername = "",
  onShowLoginModal$
}) => {
  const viewFlag = useComputed$(() => {
    // Si es una región (sin cca2), mostramos un emoji de bandera genérica
    if (!view.community.cca2) {
      return "🏁"; // Bandera genérica para regiones
    }
    
    const countryData = countriesList.find(
      (country) => country.cca2.toLowerCase() === view.community.cca2?.toLowerCase(),
    )
    return countryData?.flag || "🏳️"
  })

  return (
    <div class="min-w-[600px] max-w-[600px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div class="flex items-center gap-3 p-5 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/80 dark:from-gray-800/30 to-transparent backdrop-blur-sm">
        <div class="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full border border-blue-100 dark:border-blue-800/50 shadow-inner">
          <span class="text-3xl">{viewFlag.value}</span>
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
          <OpinionItem 
            key={opinion.id} 
            opinion={opinion} 
            isAuthenticated={isAuthenticated}
            currentUsername={currentUsername}
            onShowLoginModal$={onShowLoginModal$} 
          />
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
}) 