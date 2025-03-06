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
                                defaultScope={CommunityType.GLOBAL}
                            />
                        </Modal>
                        : <Modal
                            title={_`Inicia sesión para crear un proyecto`}
                            show={showModalProject}
                        >
                            <div class="p-4 text-center">
                                <p class="mb-6 text-gray-600 dark:text-gray-300">
                                    {_`Necesitas iniciar sesión para crear proyectos y participar en la comunidad.`}
                                </p>
                                <SocialLoginButtons />
                            </div>
                        </Modal>
                    }
                    <ProjectList
                        communityName={_`Comunidad Global`}
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
                        onShowLoginModal$={onShowLoginModal}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Proyectos Globales",
    meta: [
        {
            name: "description",
            content: "Explora y contribuye a proyectos de la comunidad global",
        },
    ],
};
