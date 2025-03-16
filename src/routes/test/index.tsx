import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
    return (
        <div class="error-container">
            <h1>Test</h1>
            <p>{import.meta.env.PUBLIC_API_URL}</p>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Test | Geounity",
};
