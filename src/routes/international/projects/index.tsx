import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import ProjectList from "~/components/list/ProjectList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import FormProject from "~/components/forms/FormProject";
import { useGetInternationalProjects } from "~/shared/loaders";

// Para el caso internacional, tendremos que crear un loader específico similar al global
// Este es un ejemplo simplificado, puede que necesites crear esta función en loaders.ts


export { useGetInternationalProjects } from "~/shared/loaders";
export { useFormDebateAction } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalProject = useSignal(false);
    const projects = useGetInternationalProjects();
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
                        communityName="La comunidad Internacional"
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
                            await nav(`/international/projects?page=${page}`);
                        }}
                        isAuthenticated={isAuthenticated.value}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Proyectos Internacionales",
    meta: [
        {
            name: "description",
            content: "Proyectos de la comunidad internacional en Geounity",
        },
    ],
}; 