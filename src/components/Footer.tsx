import { component$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";

export interface FooterProps {
    isCollapsed?: boolean;
    isMobileView?: boolean;
    variant?: 'sidebar' | 'page';
}

export default component$<FooterProps>(({
    isCollapsed = false,
    isMobileView = false,
    variant = 'sidebar'
}) => {

    const isSidebarCollapsed = variant === 'sidebar' && isCollapsed && !isMobileView;

    return (
        <div class={`
      ${variant === 'sidebar' ? 'px-3 py-2 border-t border-gray-200 dark:border-gray-700' : 'p-4'} 
      ${isSidebarCollapsed ? 'text-center' : ''}
    `}>
            <div class={`flex ${isSidebarCollapsed ? 'flex-col items-center' : 'flex-wrap gap-2'} text-xs text-gray-500 dark:text-gray-400`}>
                <a href="/privacy-policy" class="hover:text-[#713fc2] dark:hover:text-[#713fc2]">
                    {_`Privacy`}
                </a>
                {(!isSidebarCollapsed) && <span>·</span>}
                <a href="/terms-of-service" class="hover:text-[#713fc2] dark:hover:text-[#713fc2]">
                    {_`Terms`}
                </a>
                {(!isSidebarCollapsed) && <span>·</span>}
                <a href="/cookies" class="hover:text-[#713fc2] dark:hover:text-[#713fc2]">
                    {_`Cookies`}
                </a>
                {(!isSidebarCollapsed) && <span>·</span>}
                <a href="/about-us" class="hover:text-[#713fc2] dark:hover:text-[#713fc2]">
                    {_`About us`}
                </a>
                {(!isSidebarCollapsed) && <span>·</span>}
                <a href="/donation" class="hover:text-[#713fc2] dark:hover:text-[#713fc2]">
                    {_`Donation`}
                </a>
                {(!isSidebarCollapsed) && <span>·</span>}
                <a href="/roadmap" class="hover:text-[#713fc2] dark:hover:text-[#713fc2]">
                    {_`Roadmap`}
                </a>

                {/* Copyright en línea cuando hay espacio, o en línea separada cuando colapsa */}
                {!isSidebarCollapsed ? (
                    <>
                        <span>·</span>
                        <span class="ml-auto">{_`Geounity © 2025`}</span>
                    </>
                ) : (
                    <div class="mt-2 w-full text-center">
                        {_`Geounity © 2025`}
                    </div>
                )}
            </div>
        </div>
    );
});
