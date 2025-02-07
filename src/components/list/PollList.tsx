import { component$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import PollCard from "~/components/cards/PollCard";

export default component$(() => {
    // Datos de ejemplo para las polls (en una implementación real, estos datos vendran de una API)
    const polls = [
        {
            id: 1,
            title: "¿Cuál es el mayor desafío global que enfrentamos actualmente?",
            description: "Selecciona el desafío que consideras más importante.",
            options: [
                { text: "Cambio climático", percentage: 40 },
                { text: "Desigualdad económica", percentage: 30 },
                { text: "Pandemias", percentage: 20 },
                { text: "Conflictos armados", percentage: 10 },
            ],
        },
        {
            id: 2,
            title: "¿Qué acción crees que tendría el mayor impacto positivo a nivel global?",
            description: "Selecciona la acción que consideras más relevante.",
            options: [
                { text: "Educación universal", percentage: 35 },
                { text: "Energías renovables", percentage: 30 },
                { text: "Reducción de la pobreza", percentage: 25 },
                { text: "Cooperación internacional", percentage: 10 },
            ],
        },
        {
            id: 3,
            title: "¿Cuál es la prioridad que crees que debería tener la inversión pública?",
            description: "Selecciona el área en la que consideras más importante invertir.",
            options: [
                { text: "Salud", percentage: 25 },
                { text: "Educación", percentage: 25 },
                { text: "Infraestructura", percentage: 25 },
                { text: "Innovación", percentage: 25 },
            ],
        },
    ];

    return (
        <div class="space-y-4">
            {polls.length > 0 ? (
                <ul class="space-y-3">
                    {polls.map(poll => (
                        <PollCard
                            key={`poll-${poll.id}`}
                            id={poll.id}
                            description={poll.description}
                            title={poll.title}
                            options={poll.options}
                        />
                    ))}
                </ul>
            ) : (
                <p>{_`No poll available.`}</p>
            )}
        </div>
    );
});


