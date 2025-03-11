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

import { useGetTags } from "~/shared/loaders";
import { useGetNationalProjects } from "~/shared/national/loaders";

export { useFormProjectLoader } from "~/shared/forms/loaders";
export { useFormProjectAction } from "~/shared/forms/actions";
export { useDeleteProject } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalProject = useSignal(false);
    const location = useLocation();
    const nationName = location.params.nation;
    const nation = useComputed$(() => {
        return countries.find(country => country.name.toLowerCase() === nationName.toLowerCase());
    });
    
    const tags = useGetTags();
    const projects = useGetNationalProjects();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    // @ts-ignore
    const currentUsername = useComputed$(() => session.value?.user?.username || "");
    const isAuthenticated = useComputed$(() => !!session.value?.user);

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
                        title={_`Create project for ${nation.value?.name || capitalizeFirst(nationName)}`} 
                        show={showModalProject}
                    >
                        {session.value?.user
                            ? <FormProject
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.NATIONAL}
                                tags={tags.value}
                            />
                            : <SocialLoginButtons />
                        }
                    </Modal>
                    <ProjectList
                        communityName={_`The ${nation.value?.name || capitalizeFirst(nationName)} community`}
                        currentUsername={currentUsername.value}
                        isAuthenticated={isAuthenticated.value}
                        onCreateProject={onCreateProject}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/${nationName}/projects?page=${page}`);
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
    return {
        title: `${nationName} - Projects`,
        meta: [
            {
                name: "description",
                content: `Community projects of ${nationName}`,
            },
        ],
    };
};
