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

import { useGetTags } from "~/shared/loaders";
import { useGetSubregions } from "~/shared/regional/loaders";
import { useGetSubregionalProjects } from "~/shared/subregional/loaders";

export { useFormProjectLoader } from "~/shared/forms/loaders";
export { useFormProjectAction } from "~/shared/forms/actions";
export { useDeleteProject } from "~/shared/actions";

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

    // @ts-ignore
    const currentUsername = useComputed$(() => session.value?.user?.username || "");
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
                        communityName={subregionDisplayName}
                        currentUsername={currentUsername.value}
                        onCreateProject={onCreateProject}
                        isAuthenticated={isAuthenticated.value}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/${subregionName}/projects?page=${page}`);
                        }}
                        projects={{
                            items: projects.value.items,
                            total: projects.value.total || 0,
                            page: projects.value.page || 1,
                            size: projects.value.size || 10,
                            pages: projects.value.pages || 1
                        }}
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