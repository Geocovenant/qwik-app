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

// Import specific loaders for locality
import { useGetTags } from "~/shared/loaders";
import { useGetLocality, useGetLocalProjects } from "~/shared/local/loaders";

export { useFormProjectAction } from "~/shared/forms/actions";
export { useDeleteProject } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalProject = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const regionName = location.params.region;
    const subregionName = location.params.subregion;
    const localityName = location.params.locality;
    
    const locality = useGetLocality();
    const tags = useGetTags();
    const projects = useGetLocalProjects();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    // @ts-ignore
    const currentUsername = useComputed$(() => session.value?.user?.username || "");
    const isAuthenticated = useComputed$(() => !!session.value?.user);
    const localityDisplayName = capitalizeFirst(localityName.replace(/-/g, ' '));

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
                        title={_`Create project for ${localityDisplayName}`} 
                        show={showModalProject}
                    >
                        {session.value?.user
                            ? <FormProject
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.LOCAL}
                                defaultLocalityId={locality.value.id}
                                tags={tags.value}
                            />
                            : <SocialLoginButtons />
                        }
                    </Modal>
                    <ProjectList
                        communityName={_`The ${localityDisplayName} community`}
                        currentUsername={currentUsername.value}
                        isAuthenticated={isAuthenticated.value}
                        onCreateProject={onCreateProject}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/${regionName}/${subregionName}/${localityName}/projects?page=${page}`);
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
    const localityName = capitalizeFirst(params.locality.replace(/-/g, ' '));
    return {
        title: `${localityName} - Projects`,
        meta: [
            {
                name: "description",
                content: `Community projects of ${localityName}`,
            },
        ],
    };
};
