export function formatDateISO(dateISO: string) {
    const date = new Date(dateISO);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}