import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate, useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import FormProject from "~/components/forms/FormProject";
import ProjectList from "~/components/list/ProjectList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import { dataArray as countries } from "~/data/countries";
import { capitalizeFirst } from "~/utils/capitalizeFirst";

import { useGetTags, useGetUser } from "~/shared/loaders";
import { useGetRegion, useGetRegionalProjects } from "~/shared/regional/loaders";
import { useGetRegions } from "~/shared/national/loaders";

export { useFormProjectLoader } from "~/shared/forms/loaders";
export { useFormProjectAction } from "~/shared/forms/actions";
export { useDeleteProject } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const user = useGetUser();
    const showModalProject = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    
    const nation = useComputed$(() => {
        return countries.find(country => country.name.toLowerCase() === nationName.toLowerCase());
    });

    // This request fetches the other regions of the nation
    const regions = useGetRegions();

    const region = useGetRegion();
    
    const tags = useGetTags();
    const projects = useGetRegionalProjects();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    // @ts-ignore
    const currentUsername = useComputed$(() => user.value.username || "");
    const isAuthenticated = useComputed$(() => !!session.value);

    const onSubmitCompleted = $(() => {
        showModalProject.value = false;
    });

    const onCreateProject = $(() => {
        showModalProject.value = true;
    });

    const onShowLoginModal = $(() => {
        showModalProject.value = true;
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="flex flex-col min-h-0">
                <div class="h-full overflow-y-auto">
                    <Modal 
                        title={_`Create project for ${capitalizeFirst(regionName)}, ${nation.value?.name || capitalizeFirst(nationName)}`} 
                        show={showModalProject}
                    >
                        {session.value
                            ? <FormProject
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.REGIONAL}
                                defaultRegionId={region.value.id}
                                regions={Array.isArray(regions.value) ? regions.value : []}
                                tags={tags.value}
                            />
                            : <SocialLoginButtons />
                        }
                    </Modal>
                    <ProjectList
                        communityName={_`The ${capitalizeFirst(regionName)} community, ${nation.value?.name || capitalizeFirst(nationName)}`}
                        currentUsername={currentUsername.value}
                        isAuthenticated={isAuthenticated.value}
                        onCreateProject={onCreateProject}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/projects?page=${page}`);
                        }}
                        onShowLoginModal$={onShowLoginModal}
                        projects={{
                            items: projects.value.items,
                            total: projects.value.total,
                            page: projects.value.page,
                            size: projects.value.size,
                            pages: projects.value.pages
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = ({ params }) => {
    const nationName = capitalizeFirst(params.nation || "");
    const regionName = capitalizeFirst(params.region || "");
    return {
        title: `${regionName}, ${nationName} - Projects`,
        meta: [
            {
                name: "description",
                content: `Community projects of ${regionName}, ${nationName}`,
            },
        ],
    };
};
