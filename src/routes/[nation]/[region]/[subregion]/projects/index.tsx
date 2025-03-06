import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate, useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import FormProject from "~/components/forms/FormProject";
import ProjectList from "~/components/list/ProjectList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import { capitalizeFirst } from "~/utils/capitalizeFirst";

// Import necessary loaders
import { useGetSubregionalProjects, useGetSubregions, useGetTags } from "~/shared/loaders";

// Export loaders so Qwik City can find them
export { useGetSubregionalProjects, useGetSubregions, useGetTags, useFormProjectLoader } from "~/shared/loaders";
export { useFormProjectAction } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalProject = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const subregionName = location.params.subregion;
    
    const subregions = useGetSubregions();
    const tags = useGetTags();
    const projects = useGetSubregionalProjects();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    const defaultSubregion = useComputed$(() => {
        const normalizedSubregionName = subregionName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        return subregions.value.find((r: { name: string; }) => r.name === normalizedSubregionName);
    });

    const isAuthenticated = useComputed$(() => !!session.value?.user);
    const subregionDisplayName = capitalizeFirst(subregionName.replace(/-/g, ' '));

    const onSubmitCompleted = $(() => {
        showModalProject.value = false;
    });

    const onCreateProject = $(() => {
        showModalProject.value = true;
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="flex flex-col min-h-0">
                <div class="h-full overflow-y-auto">
                    <Modal 
                        title={_`Create project for ${subregionDisplayName}`} 
                        show={showModalProject}
                    >
                        {session.value?.user
                            ? <FormProject
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.SUBREGIONAL}
                                subregions={Array.isArray(subregions.value) ? subregions.value : []}
                                tags={tags.value}
                            />
                            : <SocialLoginButtons />
                        }
                    </Modal>
                    <ProjectList
                        onCreateProject={onCreateProject}
                        projects={{
                            items: Array.isArray(projects.value?.items) ? projects.value.items : [],
                            total: projects.value?.total || 0,
                            page: projects.value?.page || 1,
                            size: projects.value?.size || 10,
                            pages: projects.value?.pages || 1
                        }}
                        communityName={subregionDisplayName}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/${subregionName}/projects?page=${page}`);
                        }}
                        isAuthenticated={isAuthenticated.value}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const subregionName = capitalizeFirst(params.subregion.replace(/-/g, ' '));
    return {
        title: `${subregionName} - Projects`,
        meta: [
            {
                name: "description",
                content: `Community projects of ${subregionName}`,
            },
        ],
    };
}; 