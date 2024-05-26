export function appendClassName(base: string, add?: string | null) {
    if (add == null) {
        return base;
    }
    return base + ' ' + add;
}
