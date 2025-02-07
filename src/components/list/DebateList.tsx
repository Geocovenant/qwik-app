import { component$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import DebateCard from "~/components/cards/DebateCard";

export default component$(() => {
    // Datos de ejemplo para los debates (en una implementación real, estos datos vendrían de una API)
    const debates = [
        {
            id: 1,
            title: "Debate: ¿La tecnología mejora la calidad de vida?",
            description: "Discusión sobre el impacto de la tecnología en la sociedad moderna.",
        },
        {
            id: 2,
            title: "Debate: ¿Es ético el uso de inteligencia artificial?",
            description: "Reflexiona sobre las implicaciones éticas de la IA en diversos campos.",
        },
        {
            id: 3,
            title: "Debate: ¿El cambio climático es una prioridad global?",
            description: "Analiza la urgencia y las acciones necesarias para enfrentar el cambio climático.",
        },
    ];

    return (
        <div class="space-y-4">
            {debates.length > 0 ? (
                <ul class="space-y-3">
                    {debates.map((debate) => (
                        <DebateCard
                            key={`debate-${debate.id}`}
                            id={debate.id}
                            title={debate.title}
                            description={debate.description}
                        />
                    ))}
                </ul>
            ) : (
                <p>{_`No debate available.`}</p>
            )}
        </div>
    );
}); 