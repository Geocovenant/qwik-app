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

export { useFormProjectLoader } from "~/shared/loaders";
export { useFormProjectAction, useDeleteProject } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalProject = useSignal(false);
    const projects = useGetGlobalProjects();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    const isAuthenticated = useComputed$(() => !!session.value?.user);
    // @ts-ignore
    const currentUsername = useComputed$(() => session.value?.user?.username || "");

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
                            title={_`Create Project`}
                            show={showModalProject}
                        >
                            <FormProject
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.GLOBAL}
                            />
                        </Modal>
                        : <Modal
                            title={_`Log in to create a project`}
                            show={showModalProject}
                        >
                            <div class="p-4 text-center">
                                <p class="mb-6 text-gray-600 dark:text-gray-300">
                                    {_`You need to log in to create projects and participate in the community.`}
                                </p>
                                <SocialLoginButtons />
                            </div>
                        </Modal>
                    }
                    <ProjectList
                        communityName={_`Global Community`}
                        projects={{
                            items: Array.isArray(projects.value.items) ? projects.value.items : [],
                            total: projects.value.total || 0,
                            page: projects.value.page || 1,
                            size: projects.value.size || 10,
                            pages: projects.value.pages || 1
                        }}
                        onCreateProject={onCreateProject}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/global/projects?page=${page}`);
                        }}
                        isAuthenticated={isAuthenticated.value}
                        currentUsername={currentUsername.value}
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
            content: "Explore and contribute to global community projects",
        },
    ],
};
