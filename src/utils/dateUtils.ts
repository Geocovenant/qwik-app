import { _ } from "compiled-i18n";

export function timeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    const intervals = [
        { label: _`year`, seconds: 31536000 },
        { label: _`month`, seconds: 2592000 }, 
        { label: _`day`, seconds: 86400 },
        { label: _`hour`, seconds: 3600 },
        { label: _`minute`, seconds: 60 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count > 1) {
            return _`${count} ${interval.label}s ago`;
        }
        if (count === 1) {
            return _`${count} ${interval.label} ago`;
        }
    }
    return _`a few seconds ago`;
}