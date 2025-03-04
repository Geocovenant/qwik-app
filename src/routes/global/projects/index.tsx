import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import Modal from "~/components/Modal";
import ProjectList from "~/components/list/ProjectList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import { useGetGlobalProjects } from "~/shared/loaders";
import FormProject from "~/components/forms/FormProject";
import { _ } from "compiled-i18n";

export { useGetGlobalProjects, useFormDebateLoader } from "~/shared/loaders";
export { useFormDebateAction } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalProject = useSignal(false);
    const projects = useGetGlobalProjects();
    console.log('projects', projects.value)
    const currentPage = useSignal(1);
    const nav = useNavigate();

    const isAuthenticated = useComputed$(() => !!session.value?.user);

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
                    {session.value?.user
                        ? <Modal
                            title={_`Create project`}
                            show={showModalProject}
                        >
                            <FormProject
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.GLOBAL}
                            />
                        </Modal>
                        : <Modal
                            title={_`Sign in to create a project`}
                            show={showModalProject}
                        >
                            <SocialLoginButtons />
                        </Modal>
                    }
                    <ProjectList
                        communityName="The Global community"
                        projects={{
                            items: Array.isArray(projects.value) ? projects.value : [],
                            total: projects.value?.length || 0,
                            page: currentPage.value,
                            size: 10,
                            pages: Math.ceil((projects.value?.length || 0) / 10)
                        }}
                        onCreateProject={onCreateProject}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/global/projects?page=${page}`);
                        }}
                        isAuthenticated={isAuthenticated.value}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Global Projects",
    meta: [
        {
            name: "description",
            content: "Global Projects",
        },
    ],
};
