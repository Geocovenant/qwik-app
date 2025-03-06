import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import { Button } from "~/components/ui";
import DebateCard from "~/components/cards/DebateCard";
import EmptyDebates from "~/components/empty-states/EmptyDebates";
import { type Debate } from "~/shared/types";
import { LuPlus, LuFilter, LuSearch } from "@qwikest/icons/lucide";
import { Pagination } from "@qwik-ui/headless";
import Modal from "~/components/Modal";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import type { QRL } from "@builder.io/qwik";

export interface DebateListProps {
    communityName?: string;
    debates: {
        items: Debate[];
        total: number;
        page: number;
        size: number;
        pages: number;
    };
    onCreateDebate: QRL<() => void>;
    onPageChange$: QRL<(page: number) => void>;
    isAuthenticated?: boolean;
    onShowLoginModal$?: QRL<() => void>;
    currentUsername?: string;
}

export default component$<DebateListProps>(({ 
    communityName, 
    debates, 
    onCreateDebate, 
    onPageChange$, 
    isAuthenticated = true,
    onShowLoginModal$,
    currentUsername
}) => {
    const searchTerm = useSignal('');
    const showLoginModal = useSignal(false);
    
    // Filter debates by search term
    const filteredDebates = useComputed$(() => {
        let filtered = debates.items;
            
        // Apply search filter if there's a search term
        if (searchTerm.value.trim()) {
            const term = searchTerm.value.toLowerCase();
            filtered = filtered.filter(debate => 
                debate.title.toLowerCase().includes(term) || 
                debate.description.toLowerCase().includes(term)
            );
        }
        
        return filtered;
    });

    const handleCreateDebate = $(() => {
        if (!isAuthenticated && onShowLoginModal$) {
            onShowLoginModal$();
            return;
        }
        onCreateDebate();
    });

    // Reusable search component
    const SearchBar = (
        <div class="flex items-center gap-3 w-full sm:w-auto">
            {/* Search bar */}
            <div class="relative flex-1 sm:max-w-xs">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LuSearch class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                    type="search"
                    class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-600 dark:focus:border-cyan-600"
                    placeholder={_`Buscar debates...`}
                    value={searchTerm.value}
                    onInput$={(e) => {
                        searchTerm.value = (e.target as HTMLInputElement).value;
                    }}
                />
                {searchTerm.value && (
                    <button 
                        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick$={() => { searchTerm.value = ''; }}
                        aria-label="Limpiar búsqueda"
                    >
                        <span class="text-xl">&times;</span>
                    </button>
                )}
            </div>

            {/* Filter button */}
            <Button class="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <LuFilter class="w-4 h-4 mr-1" />
                {_`Filtrar`}
            </Button>

            {/* Create debate button */}
            <Button
                class="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700 shadow-sm"
                onClick$={handleCreateDebate}
            >
                <LuPlus class="w-4 h-4 mr-1" />
                {_`Crear`}
            </Button>
        </div>
    );

    // Show empty state if no debates match the filters
    if (!filteredDebates.value?.length) {
        if (searchTerm.value.trim()) {
            return (
                <div class="space-y-6 overflow-y-auto">
                    {/* Header with actions */}
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2">
                        <div class="flex-1">
                            <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span>{_`Debates`}</span>
                                <span class="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm px-2.5 py-0.5 rounded-full">
                                    0
                                </span>
                            </h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {communityName || _`Explora y participa en debates de la comunidad`}
                            </p>
                        </div>

                        {SearchBar}
                    </div>

                    {/* Empty search results */}
                    <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                            <LuSearch class="w-8 h-8 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {_`No se encontraron debates`}
                        </h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-6">
                            {_`Ningún debate coincide con tu búsqueda "${searchTerm.value}". Intenta con otras palabras clave o borra la búsqueda.`}
                        </p>
                        <Button 
                            class="bg-cyan-600 hover:bg-cyan-700 text-white"
                            onClick$={() => { searchTerm.value = ''; }}
                        >
                            {_`Borrar búsqueda`}
                        </Button>
                    </div>
                </div>
            );
        }
        return <EmptyDebates onCreateDebate={onCreateDebate} communityName={communityName} />;
    }

    return (
        <div class="space-y-6 overflow-y-auto">
            {/* Login modal si es necesario */}
            {!isAuthenticated && onShowLoginModal$ && (
                <Modal
                    title={_`Inicia sesión para participar`}
                    show={showLoginModal}
                >
                    <div class="p-4 text-center">
                        <p class="mb-6 text-gray-600 dark:text-gray-300">{_`Necesitas iniciar sesión para participar en debates y en la comunidad.`}</p>
                        <SocialLoginButtons />
                    </div>
                </Modal>
            )}
            
            {/* Header with actions */}
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2">
                <div class="flex-1">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span>{_`Debates`}</span>
                        <span class="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm px-2.5 py-0.5 rounded-full">
                            {filteredDebates.value.length}
                        </span>
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {communityName || _`Explora y participa en debates de la comunidad`}
                    </p>
                </div>

                {SearchBar}
            </div>

            {/* Debate list */}
            <ul class="space-y-4 px-2">
                {filteredDebates.value.map((debate: Debate) => (
                    <li key={`debate-${debate.id}`} class="transform transition-transform hover:-translate-y-1 duration-300">
                        <DebateCard
                            id={debate.id}
                            title={debate.title}
                            description={debate.description}
                            images={debate.images}
                            creator_username={debate.creator.username}
                            creator_avatar={debate.creator.image}
                            created_at={debate.created_at}
                            last_comment_at={debate.created_at}
                            slug={debate.slug}
                            tags={debate.tags}
                            comments_count={debate.points_of_view?.reduce((total, pov) => total + (pov.comments?.length || 0), 0) || 0}
                            scope={debate.scope || "NATIONAL"}
                            isAuthenticated={isAuthenticated}
                            onShowLoginModal$={onShowLoginModal$}
                            points_of_view={debate.points_of_view}
                            currentUsername={currentUsername}
                        />
                    </li>
                ))}
            </ul>

            {/* Pagination - only show if there are results and more than one page */}
            {debates.pages > 1 && !searchTerm.value.trim() && (
                <div class="mt-4 flex justify-center">
                    <Pagination
                        selectedPage={debates.page}
                        totalPages={debates.pages}
                        onPageChange$={onPageChange$}
                        class="pagination-wrapper"
                        selectedClass="pagination-selected-btn"
                        defaultClass="pagination-btn"
                        dividerClass="pagination-divider"
                        prevButtonClass="prevNextButtons"
                        nextButtonClass="prevNextButtons"
                    />
                </div>
            )}
        </div>
    );
}); 