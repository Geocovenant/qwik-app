import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import Modal from "~/components/Modal";
import ProjectList from "~/components/list/ProjectList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import FormProject from "~/components/forms/FormProject";
import { _ } from "compiled-i18n";

import { useGetInternationalProjects } from "~/shared/international/loaders";

export { useFormProjectLoader } from "~/shared/forms/loaders";
export { useFormProjectAction } from "~/shared/forms/actions";
export { useDeleteProject } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalProject = useSignal(false);
    const projects = useGetInternationalProjects();
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
                    {session.value?.user
                        ? <Modal
                            title={_`Crear proyecto`}
                            show={showModalProject}
                        >
                            <FormProject
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.INTERNATIONAL}
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
                        communityName={_`The International community`}
                        currentUsername={currentUsername.value}
                        isAuthenticated={isAuthenticated.value}
                        onCreateProject={onCreateProject}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/international/projects?page=${page}`);
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

export const head: DocumentHead = {
    title: "International Projects",
    meta: [
        {
            name: "description",
            content: "Projects of the international community in Geounity",
        },
    ],
}; 