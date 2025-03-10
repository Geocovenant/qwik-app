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
import { useGetRegionalProjects, useGetRegions, useGetTags } from "~/shared/loaders";

export { useGetRegionalProjects, useGetRegions, useGetTags } from "~/shared/loaders";

export default component$(() => {
    const session = useSession();
    const showModalProject = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    
    const regions = useGetRegions();
    const tags = useGetTags();
    const projects = useGetRegionalProjects();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    const defaultRegion = useComputed$(() => {
        const normalizedRegionName = regionName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        return regions.value.find((r: { name: string; }) => r.name === normalizedRegionName);
    });

    const isAuthenticated = useComputed$(() => !!session.value?.user);
    const regionDisplayName = capitalizeFirst(regionName.replace(/-/g, ' '));

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
                        title={_`Create project for ${regionDisplayName}`} 
                        show={showModalProject}
                    >
                        {session.value?.user
                            ? <FormProject
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.REGIONAL}
                                defaultRegionId={defaultRegion.value?.id}
                                regions={Array.isArray(regions.value) ? regions.value : []}
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
                        communityName={regionDisplayName}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/projects?page=${page}`);
                        }}
                        isAuthenticated={isAuthenticated.value}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const regionName = capitalizeFirst(params.region.replace(/-/g, ' '));
    return {
        title: `${regionName} - Projects`,
        meta: [
            {
                name: "description",
                content: `Community projects of ${regionName}`,
            },
        ],
    };
};
