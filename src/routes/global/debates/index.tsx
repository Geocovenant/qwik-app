import { $, component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Modal from "~/components/Modal";
import FormDebate from "~/components/forms/FormDebate";
import DebateList from "~/components/list/DebateList";
import { CommunityType } from "~/constants/communityType";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { useSession } from "~/routes/plugin@auth";
import { useGetGlobalDebates, useGetTags } from "~/shared/loaders";

export { useGetGlobalDebates, useFormDebateLoader, useGetTags } from "~/shared/loaders";
export { useFormDebateAction } from "~/shared/actions";

export default component$(() => {
    const session = useSession();
    const showModalDebate = useSignal(false);
    const debates = useGetGlobalDebates();
    const tags = useGetTags();
    const currentPage = useSignal(1);
    const nav = useNavigate();

    const isAuthenticated = useComputed$(() => !!session.value?.user);

    const onSubmitCompleted = $(() => {
        showModalDebate.value = false;
    });

    const onCreateDebate = $(() => {
        showModalDebate.value = true;
    });

    const onShowLoginModal = $(() => {
        showModalDebate.value = true;
    });

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            <div class="flex flex-col min-h-0">
                <div class="h-full overflow-y-auto">
                    {session.value?.user
                        ? <Modal
                            title={_`Crear debate`}
                            show={showModalDebate}
                        >
                            <FormDebate
                                onSubmitCompleted={onSubmitCompleted}
                                defaultScope={CommunityType.GLOBAL}
                                tags={tags.value}
                            />
                        </Modal>
                        : <Modal
                            title={_`Inicia sesión para crear un debate`}
                            show={showModalDebate}
                        >
                            <SocialLoginButtons />
                        </Modal>
                    }
                    <DebateList
                        communityName="The Global community"
                        debates={{
                            items: Array.isArray(debates.value) ? debates.value : [],
                            total: debates.value?.length || 0,
                            page: currentPage.value,
                            size: 10,
                            pages: Math.ceil((debates.value?.length || 0) / 10)
                        }}
                        onCreateDebate={onCreateDebate}
                        onPageChange$={async (page: number) => {
                            currentPage.value = page;
                            await nav(`/global/debates?page=${page}`);
                        }}
                        isAuthenticated={isAuthenticated.value}
                        onShowLoginModal$={onShowLoginModal}
                    />
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Global Debates",
    meta: [
        {
            name: "description",
            content: "Global Debates",
        },
    ],
};
