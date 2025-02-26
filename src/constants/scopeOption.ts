export type ScopeOption = {
    /** Valor interno que se enviará al backend */
    value: string;
    /** Etiqueta mostrada al usuario */
    label: string;
    /** Descripción adicional para aclarar el alcance */
    description: string;
};

export const ScopeOptions: ScopeOption[] = [
    {
        value: 'GLOBAL',
        label: 'Global',
        description: 'Encuesta visible para toda la comunidad global.',
    },
    {
        value: 'INTERNATIONAL',
        label: 'International',
        description: 'Encuesta que involucra a múltiples países.',
    },
    {
        value: 'NATIONAL',
        label: 'National',
        description: 'Encuesta para un solo país.',
    },
    {
        value: 'REGIONAL',
        label: 'regional',
        description: 'Encuesta para provincias o regiones subnacionales.',
    },
];
