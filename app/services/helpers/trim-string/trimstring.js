export function trimString(string, symbols, truncate = '...') {
    if (!string) {
        return '';
    }

    if (string.length <= symbols) {
        return string;
    }

    if (string[symbols - 1] === ' ') {
        return string.slice(0, symbols - 1) + truncate;
    }

    return string.slice(0, symbols) + truncate;
}