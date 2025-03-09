import { _ } from "compiled-i18n";

export function timeAgo(date: Date | string) {
    // Asegurarnos de que trabajamos con un objeto Date y ajustar a UTC
    const dateObj = date instanceof Date ? date : new Date(date + 'Z');
    
    // Validar que la fecha es válida
    if (isNaN(dateObj.getTime())) {
        console.error('Invalid date provided to timeAgo:', date);
        return _`invalid date`;
    }

    // Obtener la diferencia en segundos, considerando la zona horaria local
    const seconds = Math.floor((Date.now() - dateObj.getTime()) / 1000);

    const intervals = [
        { label: _`year`, seconds: 31536000 },
        { label: _`month`, seconds: 2592000 }, 
        { label: _`day`, seconds: 86400 },
        { label: _`hour`, seconds: 3600 },
        { label: _`minute`, seconds: 60 }
    ];

    // Para propósitos de desarrollo/prueba, si la fecha es futura,
    // tratarla como si fuera pasada
    const absoluteSeconds = Math.abs(seconds);

    for (const interval of intervals) {
        const count = Math.floor(absoluteSeconds / interval.seconds);
        if (count > 1) {
            return _`${count} ${interval.label}s ago`;
        }
        if (count === 1) {
            return _`${count} ${interval.label} ago`;
        }
    }

    // Si han pasado menos de 60 segundos
    if (absoluteSeconds > 30) {
        return _`${absoluteSeconds} seconds ago`;
    }
    return _`a few seconds ago`;
}